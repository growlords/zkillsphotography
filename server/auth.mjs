import crypto from 'node:crypto';
import { db } from './db.mjs';

const SESSION_DURATION_HOURS = 24 * 7; // 7 days

export function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function verifyPassword(password, salt, storedHash) {
  const hash = hashPassword(password, salt);
  const bufA = Buffer.from(hash, 'hex');
  const bufB = Buffer.from(storedHash, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function authenticateUser(username, password) {
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  if (!user) {
    return { success: false, error: 'Invalid username or password' };
  }

  const isValid = verifyPassword(password, user.salt, user.password_hash);
  if (!isValid) {
    return { success: false, error: 'Invalid username or password' };
  }

  // Create session
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 3600 * 1000).toISOString();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO sessions (token, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).run(token, user.id, expiresAt, now);

  return {
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username
    }
  };
}

export function validateSession(token) {
  if (!token) return null;

  const session = db.prepare(`
    SELECT s.token, s.expires_at, u.id as user_id, u.username
    FROM sessions s
    JOIN admin_users u ON s.user_id = u.id
    WHERE s.token = ?
  `).get(token);

  if (!session) return null;

  if (new Date(session.expires_at) < new Date()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }

  return {
    userId: session.user_id,
    username: session.username
  };
}

export function destroySession(token) {
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }
}

export function changeAdminPassword(userId, currentPassword, newPassword) {
  const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const isValid = verifyPassword(currentPassword, user.salt, user.password_hash);
  if (!isValid) {
    return { success: false, error: 'Incorrect current password' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters' };
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword, newSalt);
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE admin_users
    SET password_hash = ?, salt = ?, updated_at = ?
    WHERE id = ?
  `).run(newHash, newSalt, now, userId);

  // Invalidate other sessions
  return { success: true };
}

// Express middleware
export function requireAuth(req, res, next) {
  const token = req.cookies?.admin_session || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  const user = validateSession(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please login to continue.' });
  }

  req.adminUser = user;
  next();
}
