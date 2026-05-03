// lib/auth-utils.js
// Centralized helper for authentication‑related checks
import bcrypt from 'bcryptjs';

/**
 * Returns true if the stored hash corresponds to the default password
 * (currently "password123"). This is used to force the user to change the
 * password on first login.
 */
export async function shouldForcePasswordChange(hash, /* string */) {
  // bcrypt.compare returns false for non‑matching hashes; we only need to
  // compare against the literal default password.
  return await bcrypt.compare('password123', hash);
}
