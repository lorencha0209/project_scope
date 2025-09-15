const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */
class AuthMiddleware {
    constructor() {
        this.secretKey = process.env.JWT_SECRET || 'project-scope-secret-key-2024';
        this.tokenExpiry = process.env.JWT_EXPIRY || '24h';
    }

    /**
     * Generate JWT token for user
     */
    generateToken(user) {
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name
        };
        
        return jwt.sign(payload, this.secretKey, { 
            expiresIn: this.tokenExpiry,
            issuer: 'project-scope',
            audience: 'project-scope-client'
        });
    }

    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, this.secretKey, {
                issuer: 'project-scope',
                audience: 'project-scope-client'
            });
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Middleware to authenticate requests
     */
    authenticate = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ 
                    error: 'Access denied', 
                    message: 'No token provided' 
                });
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix
            
            // Verify token
            const decoded = this.verifyToken(token);
            
            // Check if user still exists and is active
            const users = await db.query(
                'SELECT id, username, email, full_name, is_active FROM users WHERE id = ? AND is_active = TRUE',
                [decoded.id]
            );

            if (users.length === 0) {
                return res.status(401).json({ 
                    error: 'Access denied', 
                    message: 'User not found or inactive' 
                });
            }

            // Add user info to request
            req.user = users[0];
            next();
            
        } catch (error) {
            console.error('Authentication error:', error);
            return res.status(401).json({ 
                error: 'Access denied', 
                message: error.message 
            });
        }
    };

    /**
     * Optional authentication middleware
     * Doesn't fail if no token provided
     */
    optionalAuth = async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                req.user = null;
                return next();
            }

            const token = authHeader.substring(7);
            const decoded = this.verifyToken(token);
            
            const users = await db.query(
                'SELECT id, username, email, full_name, is_active FROM users WHERE id = ? AND is_active = TRUE',
                [decoded.id]
            );

            req.user = users.length > 0 ? users[0] : null;
            next();
            
        } catch (error) {
            req.user = null;
            next();
        }
    };

    /**
     * Rate limiting for login attempts
     */
    createLoginRateLimit() {
        const rateLimit = require('express-rate-limit');
        
        return rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 5, // Limit each IP to 5 requests per windowMs
            message: {
                error: 'Too many login attempts',
                message: 'Please try again in 15 minutes'
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
    }
}

module.exports = new AuthMiddleware();
