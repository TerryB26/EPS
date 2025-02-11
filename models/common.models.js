import crypto from 'crypto';

export const encryptResponse = (req, res, next) => {
  const originalSend = res.send;
  res.send = (body) => {
    const cipher = crypto.createCipher('aes-256-cbc', 'your-encryption-key');
    let encrypted = cipher.update(body, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    originalSend.call(res, encrypted);
  };
  next();
};