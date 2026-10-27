const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'notely_development_jwt_secret_key_987654321_secure';
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRY || '7d'
  });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

const clearAuthCookie = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0)
  });
};

module.exports = { generateTokenAndSetCookie, clearAuthCookie };
