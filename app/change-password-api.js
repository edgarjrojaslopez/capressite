import bcrypt from 'bcryptjs';

const changePasswordApi = async (currentPassword, newPassword) => {
  const token = localStorage.getItem('token');
  const hashedCurrentPassword = await bcrypt.hash(currentPassword, 10);
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  const response = await fetch('/api/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword: hashedCurrentPassword,
      newPassword: hashedNewPassword,
    }),
  });

  const data = await response.json();
  return data;
};

export default changePasswordApi;
