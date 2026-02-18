const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'Hjk908';

export const validateAdminCredentials = (user: string, password: string): boolean => {
  return user === ADMIN_USER && password === ADMIN_PASSWORD;
};

export const generateAdminToken = (): string => {
  return 'admin_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
};

export const validateAdminToken = (token: string): boolean => {
  return token ? token.startsWith('admin_') : false;
};

export const setAdminToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('adminToken', token);
  }
};

export const getAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('adminToken');
  }
  return null;
};

export const clearAdminToken = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('adminToken');
  }
};
