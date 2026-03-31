import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  exp: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
};
