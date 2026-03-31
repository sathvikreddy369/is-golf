export type UserRole = 'USER' | 'ADMIN';

export interface Charity {
  id: string;
  name: string;
  description: string;
  image: string;
  website: string;
  active?: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  charityId?: string | null;
  isActive?: boolean;
  charity?: Charity | null;
  subscription?: {
    id: string;
    planType: 'MONTHLY' | 'YEARLY';
    price: string;
    status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
    renewalDate: string;
    charityPercentage: string;
  } | null;
}
