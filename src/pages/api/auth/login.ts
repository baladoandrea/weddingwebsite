import type { NextApiRequest, NextApiResponse } from 'next';

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

interface LoginRequest {
  user: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { user, password } = req.body as LoginRequest;

  if (!user || !password) {
    return res.status(400).json({ success: false, error: 'Missing credentials' });
  }

  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    return res.status(500).json({
      success: false,
      error: 'Admin credentials are not configured in environment variables',
    });
  }

  if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
    const token = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return res.status(200).json({ success: true, token });
  }

  return res.status(401).json({ success: false, error: 'Invalid credentials' });
}
