export type UserRole = 'USER' | 'ADMIN';

export interface Charity {
  id: string;
  name: string;
  category?: string | null;
  description: string;
  image: string;
  website: string;
  featured?: boolean;
  location?: string | null;
  upcomingEventTitle?: string | null;
  upcomingEventDate?: string | null;
  impactMetric?: string | null;
  active?: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  charityId?: string | null;
  isActive?: boolean;
  emailNotifications?: boolean;
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
