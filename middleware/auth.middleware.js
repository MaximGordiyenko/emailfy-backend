import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
}

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET);
}

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Failed to authenticate token' });
    req.user = user;
    next();
  });
}
