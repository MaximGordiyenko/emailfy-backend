import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Account } from '../models/account.model.js';
import { Token } from '../models/token.model.js';

import { generateAccessToken, generateRefreshToken } from '../middleware/auth.middleware.js';
import { ApiError } from '../exeptions/api-error.js';

export const signUpAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await Account.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Username already exists." });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const savedUser = await Account.create({
      email,
      password: hashedPassword
    });
    
    res.status(201).json({
      message: "User registered successfully",
      accountId: savedUser.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signInAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Account.findOne({ where: { email } });
    
    if (!user) return res.status(400).send("Invalid username or password.");
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword)
      return res.status(400).send("Invalid username or password.");
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    await Token.create({ token: refreshToken, accountId: user.id });
    
    res.status(200).json({
      message: "User registered successfully",
      accessToken: accessToken,
      refreshToken: refreshToken
    });
    
  } catch (error) {
    res.status(500).json(ApiError.BadRequest('Authentication failed', [error.message]));
  }
};

export const authRefreshToken = async (req, res) => {
  try {
    const { token: refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }
    
    // Find the refresh token in the database
    const dbToken = await Token.findOne({ where: { token: refreshToken } });
    if (!dbToken) return res.status(403).json({ error: 'Invalid refresh token' });
    
    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
      }
      
      // Generate new tokens
      const newAccessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const newRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      
      // Invalidate the old refresh token and store the new one
      await dbToken.destroy();
      await Token.create({ token: newRefreshToken, accountId: user.id });
      
      res.status(200).json({
        message: 'New accessToken & refreshToken provided',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    });
  } catch (err) {
    console.error('Error during token refresh:', err);
    res.status(500).json({ error: 'Failed to refresh token' });
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

export const getAccountInformation = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    const decoded = jwt.decode(token);
    
    const isExistUser = await Account.findByPk(decoded.id);
    
    res.status(200).json(isExistUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    const decoded = jwt.decode(token);
    
    const account = await Account.findOne({
      where: { id: decoded.id }
    });
    
    console.log('The account is:.', account);
    
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAudienceStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    const decoded = jwt.decode(token);
    
    const account = await Account.findOne({
      where: { id: decoded.id }
    });
    
    console.log('The account is:.', account);
    
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
