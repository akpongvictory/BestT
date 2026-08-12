import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from "../lib/prisma";
import {
  removeDocument,
} from "../controllers/document.controller";
const router = Router();


// =====================================================
// Helper Function: Normalize Email
// =====================================================
// Removes accidental spaces and converts email to lowercase
const normalizeEmail = (email: string) => {
  return email.trim().toLowerCase();
};

// =====================================================
// Helper Function: Normalize Name
// =====================================================
// Removes extra spaces and capitalizes each word
const normalizeName = (name: string) => {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ');
};

// =====================================================
// GET /api/auth
// Authentication API Information
// =====================================================
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'BestT Authentication API',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
    },
  });
});

router.delete(
  "/:id",
  authenticate,
  removeDocument
);
// =====================================================
// POST /api/auth/register
// Register a New User
// =====================================================
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required.',
      });
    }

    // Validate name
    if (!name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty.',
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must contain at least 2 characters.',
      });
    }

    // Normalize values
    const normalizedName = normalizeName(name);
    const normalizedEmail = normalizeEmail(email);

    // Validate email format
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: userWithoutPassword,
    });

  } catch (error) {
    console.error('Registration Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

// =====================================================
// POST /api/auth/login
// Authenticate Existing User
// =====================================================
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Normalize email
    const normalizedEmail = normalizeEmail(email);

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT
          const token = jwt.sign(
      {
      id:user.id,
      email:user.email,
      },
      process.env.JWT_SECRET!,
      {
      expiresIn:"7d"
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
});

// =====================================================
// GET /api/auth/me
// Return Current Authenticated User
// =====================================================
router.get(
  '/me',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
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
      console.error('Fetch Current User Error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
);

// =====================================================
// Export Router
// =====================================================
export default router;