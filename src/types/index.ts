export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalTeams: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

