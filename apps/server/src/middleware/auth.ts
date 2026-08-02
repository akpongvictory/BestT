import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


// =====================================================
// Extend Express Request
// =====================================================
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}


// =====================================================
// Authentication Middleware
// =====================================================
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required.',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format.',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      id: string;
      email: string;
    };

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });

  }

};