const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

/**
 * Authentication Routes
 * Handles login, logout, and user verification
 */

// POST /api/auth/login - User login
router.post('/login', auth.createLoginRateLimit(), async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Validation error', 
                message: 'Username and password are required' 
            });
        }

        // Find user by username
        const users = await db.query(
            'SELECT id, username, email, password_hash, full_name, is_active FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                error: 'Authentication failed', 
                message: 'Invalid username or password' 
            });
        }

        const user = users[0];

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({ 
                error: 'Account disabled', 
                message: 'Your account has been disabled' 
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Authentication failed', 
                message: 'Invalid username or password' 
            });
        }

        // Generate JWT token
        const token = auth.generateToken(user);

        // Remove password hash from response
        const { password_hash, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword,
            expiresIn: process.env.JWT_EXPIRY || '24h'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: 'Login failed' 
        });
    }
});

// POST /api/auth/logout - User logout (client-side token removal)
router.post('/logout', auth.authenticate, (req, res) => {
    // Since we're using JWT, logout is handled client-side by removing the token
    // This endpoint is mainly for logging purposes
    res.json({ 
        message: 'Logout successful',
        timestamp: new Date().toISOString()
    });
});

// GET /api/auth/verify - Verify current token
router.get('/verify', auth.authenticate, (req, res) => {
    res.json({
        message: 'Token is valid',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

// GET /api/auth/me - Get current user info
router.get('/me', auth.authenticate, (req, res) => {
    res.json({
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

// POST /api/auth/refresh - Refresh token
router.post('/refresh', auth.authenticate, (req, res) => {
    try {
        // Generate new token with same user info
        const newToken = auth.generateToken(req.user);
        
        res.json({
            message: 'Token refreshed successfully',
            token: newToken,
            expiresIn: process.env.JWT_EXPIRY || '24h'
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: 'Token refresh failed' 
        });
    }
});

module.exports = router;
