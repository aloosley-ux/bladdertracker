export interface User {
  id: string;
  name: string;
  role: 'parent' | 'caregiver' | 'child';
  avatar?: string;
  email?: string;
}

export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  avatar?: string;
  caregivers: string[]; // user IDs
}

export interface DrinkEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  type: 'cup' | 'beaker' | 'bottle' | 'sippy' | 'other';
  amountMl: number;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface UrineEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  wet: boolean;
  pass: boolean;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export type BristolStoolType = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type BowelAmount = 'S' | 'M' | 'L';

export interface BowelEntry {
  id: string;
  childId: string;
  date: string;
  time: string;
  location: 'toilet' | 'nappy';
  amount: BowelAmount;
  bristolType: BristolStoolType;
  laxativesGiven: boolean;
  notes: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
}

export interface DailyLog {
  date: string;
  childId: string;
  drinks: DrinkEntry[];
  urineEvents: UrineEntry[];
  bowelEvents: BowelEntry[];
}

export interface CaregiverInvite {
  id: string;
  childId: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined';
  invitedBy: string;
  createdAt: string;
}
