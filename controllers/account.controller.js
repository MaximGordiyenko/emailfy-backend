import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Account } from '../models/account.model.js';
import { Token } from '../models/token.model.js';

import { generateAccessToken, generateRefreshToken } from '../middleware/auth.middleware.js';
import { ApiError } from '../exeptions/api-error.js';

export const signUpAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await Account.create({
      email,
      password: hashedPassword
    });
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Handle Sequelize unique constraint error
    if (error.name === 'SequelizeUniqueConstraintError') {
      const errorDetails = error.errors.map(err => ({
        field: err.path,
        message: `${err.path} "${err.value}" is already taken`
      }));
      
      return res.status(409).json(
        ApiError.Conflict(
          'Email already exists',
          errorDetails
        )
      );
    }
    
    // Handle other validation errors
    if (error.name === 'SequelizeValidationError') {
      const errorDetails = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json(
        ApiError.BadRequest(
          'Validation failed',
          errorDetails
        )
      );
    }
    
    // Handle unexpected errors
    console.error('Signup error:', error);
    return res.status(500).json(
      ApiError(500, 'Internal server error')
    );
  }
};

export const signInAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Account.findOne({ where: { email } });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json(ApiError.Unauthorized());
    }
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    await Token.create({ token: refreshToken, userId: user.id });
    
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({ accessToken });
  } catch (error) {
    res.status(400).json(ApiError.BadRequest('An unexpected error occurred', [error.message]));
  }
};

export const authRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    
    const dbToken = await Token.findOne({ where: { token: refreshToken } });
    if (!dbToken) return res.sendStatus(403);
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403);
      
      const newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      
      await dbToken.destroy(); // Invalidate the old refresh token
      await Token.create({ token: newRefreshToken, userId: user.id });
      
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

export const authLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await Token.destroy({ where: { token: refreshToken } });
      res.clearCookie('refreshToken');
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};
