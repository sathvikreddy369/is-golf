import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { signAccessToken } from '../utils/jwt';

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  charityId?: string;
  role?: 'USER' | 'ADMIN';
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      password: hashedPassword,
      charityId: input.charityId,
      role: input.role === 'ADMIN' ? 'ADMIN' : 'USER'
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      charityId: true,
      isActive: true
    }
  });

  const token = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return { user, token };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.isActive) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const isValid = await bcrypt.compare(input.password, user.password);
  if (!isValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const token = signAccessToken({ id: user.id, email: user.email, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      charityId: user.charityId
    }
  };
};
