import { Account } from '../models/account.model.js';
import jwt from 'jsonwebtoken';

export const getDashboardDate = async (req, res) => {
  try {
    // Assuming user data is attached to req.user by the `authenticateToken` middleware
    const user = req.user;
    console.log('dashboard data:', user);
    
    // Fetch user-specific dashboard data (replace with actual logic)
    const dashboardData = {
      message: `Welcome, ${user.username}!`,
      // Additional data based on your use case
      stats: {
        projects: 5,
        tasks: 12,
        notifications: 3,
      },
    };
    
    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
