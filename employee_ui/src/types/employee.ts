export interface Employee {
    id: number;
    name: string;
    email: string;
    department: Department;
    createdAt: string;
    updatedAt: string;
  }
  export type Department = 'HR' | 'IT' | 'Finance' | 'Operations';
  export const DEPARTMENTS: Department[] = ['HR', 'IT', 'Finance', 'Operations'];
  export interface EmployeeInput {
    name: string;
    email: string;
    department: Department;
  }