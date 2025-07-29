import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import config  from '../utils/config';
import IUser from '../types/user';
import Req from "../types/req"
import {Request, Response, NextFunction} from "express"
/**
 * Generate JWT token for a user
 * @param {Object} user - User object containing user data
 * @param {string} expiresIn - Token expiration time (default: '24h')
 * @returns {string} JWT token
 */

const generateToken = (user: IUser, expiresIn = '24h') => {
  try {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role || 'user',
      // Add any other user data you want to include in the token
    };
    
    return jwt.sign(payload, config.Secret, { expiresIn });
  } catch (error: any) {
    throw new Error('Error generating token: ' + error.message);
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token: any) => {
  try {
    return jwt.verify(token, config.Secret);
  } catch (error: any) {
    throw new Error('Invalid token: ' + error.message);
  }
};

/**
 * Extract token from request headers
 * @param {Object} req - Express request object
 * @returns {string|null} JWT token or null if not found
 */
const extractToken = (req: Req) => {
  // Check Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.substring(7);
  }
  
  // Check for token in cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  // Check for token in query parameters
  if (req.query.token) {
    return req.query.token;
  }
  
  return null;
};

/**
 * Authentication middleware to protect routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = (req: Req, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }
    const decoded = verifyToken(token)
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = (req: Req, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    
    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Role-based authorization middleware
 * @param {...string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const authorizeRoles = (...roles: any[]) => {
  return (req: Req, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

/**
 * Refresh token middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const refreshToken = (req: Req, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    const decoded = verifyToken(refreshToken)
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

export {
  generateToken,
  verifyToken,
  extractToken,
  authenticateToken,
  optionalAuth,
  authorizeRoles,
  refreshToken,
};
