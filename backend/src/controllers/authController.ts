import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { validateEmail, validatePassword, validateName } from '../../../shared/validation';
import { updateStreak } from '../middleware/streak';

const JWT_SECRET = process.env.JWT_SECRET || 'pavanxdcl_jwt_super_secure_secret_2026_xyz';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
    }

    if (!validateName(name)) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const { isValid, message } = validatePassword(password);
    if (!isValid) {
      return res.status(400).json({ success: false, message });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        joinedDate,
        streak: 1,
        targetGoal: 'FAANG',
        role: 'STUDENT'
      }
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        joinedDate: newUser.joinedDate,
        streak: newUser.streak,
        targetGoal: newUser.targetGoal,
        progress: {
          dsa: JSON.parse(newUser.progressDsa),
          fullstack: JSON.parse(newUser.progressFullstack),
          aptitude: JSON.parse(newUser.progressAptitude)
        },
        mentorshipSelected: newUser.mentorshipSelected,
        mentorshipRequested: newUser.mentorshipRequested
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Database write failure.' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password.' });
    }

    const userObj = await prisma.user.findFirst({
      where: { email: email.toLowerCase() }
    });

    if (!userObj) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, userObj.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const updatedStreak = await updateStreak(userObj.id);
    userObj.streak = updatedStreak;

    const token = jwt.sign(
      { userId: userObj.id, email: userObj.email, role: userObj.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        name: userObj.name,
        email: userObj.email,
        joinedDate: userObj.joinedDate,
        streak: userObj.streak,
        targetGoal: userObj.targetGoal,
        role: userObj.role,
        progress: {
          dsa: JSON.parse(userObj.progressDsa),
          fullstack: JSON.parse(userObj.progressFullstack),
          aptitude: JSON.parse(userObj.progressAptitude)
        },
        mentorshipSelected: userObj.mentorshipSelected,
        mentorshipRequested: userObj.mentorshipRequested
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Authentication failed.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const updatedStreak = await updateStreak(req.user.userId);

    const userObj = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!userObj) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        name: userObj.name,
        email: userObj.email,
        joinedDate: userObj.joinedDate,
        streak: userObj.streak,
        targetGoal: userObj.targetGoal,
        role: userObj.role,
        progress: {
          dsa: JSON.parse(userObj.progressDsa),
          fullstack: JSON.parse(userObj.progressFullstack),
          aptitude: JSON.parse(userObj.progressAptitude)
        },
        mentorshipSelected: userObj.mentorshipSelected,
        mentorshipRequested: userObj.mentorshipRequested,
        notes: userObj.notes
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
