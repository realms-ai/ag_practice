export interface CompanyEntity {
  id: string | number;
  name: string;
  description?: string;
}

export interface JobEntity {
  id: string | number;
  companyId: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface UserEntity {
  id: string | number;
  companyId: string;
  email: string;
  password: string;
}
