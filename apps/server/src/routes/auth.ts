import { Router, Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../services/email.service';

const router = Router();

const appUrl =
  process.env.APP_URL ?? 'https://best-t-client-ms3n-a0we78vp5-akpongvictorys-projects.vercel.app';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not configured.');
}

const VERIFICATION_TOKEN_EXPIRY_MS =
  24 * 60 * 60 * 1000;

const PASSWORD_RESET_TOKEN_EXPIRY_MS =
  60 * 60 * 1000;

// Normalize email for consistent storage and lookup.
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// Normalize whitespace without changing capitalization.
const normalizeName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ');
};

// Create a secure email verification token.
const createVerificationToken = async (
  userId: string
): Promise<string> => {
  const token = crypto
    .randomBytes(32)
    .toString('hex');

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const expiresAt = new Date(
    Date.now() + VERIFICATION_TOKEN_EXPIRY_MS
  );

  await prisma.emailVerificationToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return token;
};

// Create a secure password reset token.
const createPasswordResetToken = async (
  userId: string
): Promise<string> => {
  const token = crypto
    .randomBytes(32)
    .toString('hex');

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const expiresAt = new Date(
    Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MS
  );

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return token;
};

// GET /api/auth
router.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'BestT Authentication API',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
      resendVerification:
        'POST /api/auth/resend-verification',
      verifyEmail: 'GET /api/auth/verify-email',
      forgotPassword:
        'POST /api/auth/forgot-password',
      resetPassword:
        'POST /api/auth/reset-password',
    },
  });
});

// POST /api/auth/register
router.post(
  '/register',
  async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      // Validate required fields.
      if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Name, email and password are required.',
        });
      }

      // Normalize input.
      const normalizedName = normalizeName(name);
      const normalizedEmail =
        normalizeEmail(email);

      // Validate name.
      if (!normalizedName) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty.',
        });
      }

      if (normalizedName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            'Name must contain at least 2 characters.',
        });
      }

      // Validate email.
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message:
            'Please provide a valid email address.',
        });
      }

      // Validate password.
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message:
            'Password must be at least 8 characters long.',
        });
      }

      // Check whether the email is already registered.
      const existingUser =
        await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email is already registered.',
        });
      }

      // Hash password.
      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      // Create user.
      const user = await prisma.user.create({
        data: {
          name: normalizedName,
          email: normalizedEmail,
          password: hashedPassword,
          emailVerified: false,
        },
      });

      // Create verification token.
      const verificationToken =
        await createVerificationToken(user.id);

      const verificationUrl =
        `${appUrl}/verify-email?token=${verificationToken}`;

      // Send verification email.
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        verificationUrl,
      });

      // Remove password from response.
      const {
        password: _password,
        ...userWithoutPassword
      } = user;

      return res.status(201).json({
        success: true,
        message:
          'Registration successful. Please check your email to verify your account.',
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error('Registration Error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate required fields.
      if (
        typeof email !== 'string' ||
        typeof password !== 'string'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Email and password are required.',
        });
      }

      // Normalize email.
      const normalizedEmail =
        normalizeEmail(email);

      // Find user.
      const user =
        await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        });

      // Use the same error for unknown users and incorrect passwords.
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      // Compare password.
      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      // Require email verification before login.
      if (!user.emailVerified) {
        return res.status(403).json({
          success: false,
          message:
            'Please verify your email address before logging in.',
          emailVerified: false,
        });
      }

      // Generate JWT.
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        jwtSecret,
        {
          expiresIn: '7d',
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Login Error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// GET /api/auth/me
router.get(
  '/me',
  authenticate,
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const user =
        await prisma.user.findUnique({
          where: {
            id: req.user!.id,
          },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Authenticated user.',
        data: user,
      });
    } catch (error) {
      console.error(
        'Fetch Current User Error:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// GET /api/auth/verify-email
router.get(
  '/verify-email',
  async (req: Request, res: Response) => {
    try {
      const { token } = req.query;

      if (
        !token ||
        typeof token !== 'string'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Verification token is required.',
        });
      }

      // Hash token received from email.
      const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Find verification token.
      const verificationToken =
        await prisma.emailVerificationToken.findUnique(
          {
            where: {
              tokenHash,
            },
            include: {
              user: {
                select: {
                  id: true,
                  emailVerified: true,
                },
              },
            },
          }
        );

      if (!verificationToken) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid or expired verification link.',
        });
      }

      // Check expiration.
      if (
        verificationToken.expiresAt <
        new Date()
      ) {
        await prisma.emailVerificationToken.delete(
          {
            where: {
              id: verificationToken.id,
            },
          }
        );

        return res.status(400).json({
          success: false,
          message:
            'This verification link has expired. Please request a new one.',
        });
      }

      // Clean up token if already verified.
      if (
        verificationToken.user.emailVerified
      ) {
        await prisma.emailVerificationToken.delete(
          {
            where: {
              id: verificationToken.id,
            },
          }
        );

        return res.status(200).json({
          success: true,
          message: 'Email is already verified.',
        });
      }

      // Verify email and consume token atomically.
      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: verificationToken.userId,
          },
          data: {
            emailVerified: true,
          },
        }),
        prisma.emailVerificationToken.delete({
          where: {
            id: verificationToken.id,
          },
        }),
      ]);

      return res.status(200).json({
        success: true,
        message:
          'Email verified successfully. You can now log in.',
      });
    } catch (error) {
      console.error(
        'Email Verification Error:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// POST /api/auth/resend-verification
router.post(
  '/resend-verification',
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Email is required.',
        });
      }

      // Normalize email.
      const normalizedEmail =
        normalizeEmail(email);

      // Find user.
      const user =
        await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        });

      // Do not reveal whether an account exists.
      if (!user) {
        return res.status(200).json({
          success: true,
          message:
            'If an account exists with this email, a verification email has been sent.',
        });
      }

      // Don't resend if already verified.
      if (user.emailVerified) {
        return res.status(200).json({
          success: true,
          message:
            'This email address is already verified.',
        });
      }

      // Remove previous verification tokens.
      await prisma.emailVerificationToken.deleteMany(
        {
          where: {
            userId: user.id,
          },
        }
      );

      // Create new verification token.
      const verificationToken =
        await createVerificationToken(user.id);

      const verificationUrl =
        `${appUrl}/verify-email?token=${verificationToken}`;

      // Send verification email.
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        verificationUrl,
      });

      return res.status(200).json({
        success: true,
        message:
          'If an account exists with this email, a verification email has been sent.',
      });
    } catch (error) {
      console.error(
        'Resend Verification Error:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Email is required.',
        });
      }

      // Normalize email.
      const normalizedEmail =
        normalizeEmail(email);

      // Find user.
      const user =
        await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        });

      // Do not reveal whether an account exists.
      if (!user) {
        return res.status(200).json({
          success: true,
          message:
            'If an account exists with this email, a password reset link has been sent.',
        });
      }

      // Remove existing reset tokens.
      await prisma.passwordResetToken.deleteMany(
        {
          where: {
            userId: user.id,
          },
        }
      );

      // Create new reset token.
      const resetToken =
        await createPasswordResetToken(
          user.id
        );

      const resetUrl =
        `${appUrl}/reset-password?token=${resetToken}`;

      // Send password reset email.
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });

      return res.status(200).json({
        success: true,
        message:
          'If an account exists with this email, a password reset link has been sent.',
      });
    } catch (error) {
      console.error(
        'Forgot Password Error:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;

      if (
        !token ||
        typeof token !== 'string'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Reset token is required.',
        });
      }

      if (
        !password ||
        typeof password !== 'string'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'New password is required.',
        });
      }

      // Validate password.
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message:
            'Password must be at least 8 characters long.',
        });
      }

      // Hash token received from email.
      const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Find reset token.
      const resetToken =
        await prisma.passwordResetToken.findUnique(
          {
            where: {
              tokenHash,
            },
          }
        );

      if (!resetToken) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid or expired password reset link.',
        });
      }

      // Check expiration.
      if (
        resetToken.expiresAt <
        new Date()
      ) {
        await prisma.passwordResetToken.delete(
          {
            where: {
              id: resetToken.id,
            },
          }
        );

        return res.status(400).json({
          success: false,
          message:
            'This password reset link has expired. Please request a new one.',
        });
      }

      // Hash new password.
      const hashedPassword =
        await bcrypt.hash(password, 10);

      // Update password and invalidate all reset tokens.
      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: resetToken.userId,
          },
          data: {
            password: hashedPassword,
          },
        }),
        prisma.passwordResetToken.deleteMany({
          where: {
            userId: resetToken.userId,
          },
        }),
      ]);

      return res.status(200).json({
        success: true,
        message:
          'Password reset successfully. You can now log in with your new password.',
      });
    } catch (error) {
      console.error(
        'Reset Password Error:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);
export default router;
