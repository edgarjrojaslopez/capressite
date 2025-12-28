// lib/generateTrackingId.js
export function generateTrackingId(codSocio) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // YY
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // MM
  const day = now.getDate().toString().padStart(2, '0'); // DD
  const fecha = `${year}${month}${day}`;
  const random = Math.floor(100 + Math.random() * 900); // 3-digit random number
  return `S${codSocio}${fecha}${random}`; // Example: S9999999250817123
}