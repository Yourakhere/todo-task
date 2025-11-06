const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Input validation middleware
const validateInput = (req, res, next) => {
  const { email, password, username } = req.body;
  const errors = [];

  if (req.path === '/signup' && (!username || username.length < 3)) {
    errors.push('Username must be at least 3 characters long');
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

// Rate limiting (simple version)
const rateLimit = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    const limit = rateLimit.get(ip);
    if (now > limit.resetAt) {
      limit.count = 1;
      limit.resetAt = now + WINDOW_MS;
    } else if (limit.count >= MAX_REQUESTS) {
      return res.status(429).json({ 
        message: 'Too many requests, please try again later',
        resetAt: new Date(limit.resetAt).toISOString()
      });
    } else {
      limit.count++;
    }
  }
  next();
};

router.post('/signup', rateLimiter, validateInput, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check for existing user with detailed error
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        field: existingUser.email === email ? 'email' : 'username'
      });
    }

    // Hash password with appropriate cost factor
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();

    // Log success (but don't expose user details)
    console.log(`New user registered: ${email} (${new Date().toISOString()})`);

    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      redirectTo: '/login'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', rateLimiter, validateInput, async (req, res, next) => {
  try {
    console.log('Login attempt:', { email: req.body.email, timestamp: new Date().toISOString() });
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user and handle invalid credentials consistently
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password with constant-time comparison
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT with appropriate claims
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        audience: process.env.FRONTEND_URL || 'https://yourtodo-frontend.vercel.app',
        issuer: process.env.BACKEND_URL || 'https://yourtodo-backend.vercel.app'
      }
    );

    // Log successful login (but don't expose sensitive data)
    console.log(`User logged in: ${email} (${new Date().toISOString()})`);

    res.json({ 
      token,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;