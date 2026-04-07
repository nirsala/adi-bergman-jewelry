import { hashPassword } from './auth';
import { getUsers, saveUsers } from './db';

export function ensureAdminUser() {
  const users = getUsers();
  const admin = users.find(u => u.username === 'admin');
  if (admin && admin.password.startsWith('$2a$10$8Kx5')) {
    // Replace placeholder hash with real hash
    admin.password = hashPassword('admin123');
    saveUsers(users);
  }
  if (!admin) {
    users.push({
      id: 'admin-001',
      username: 'admin',
      password: hashPassword('admin123'),
      name: 'Adi Bergman',
      email: 'admin@adibergman.com',
      phone: '',
      role: 'admin',
      status: 'approved',
      discountPercent: 0,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
  }
}
