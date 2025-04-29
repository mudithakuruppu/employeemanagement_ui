import axios from 'axios';
import { Employee, EmployeeInput } from '../types/employee';
const API_URL = '/api';
export const api = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data;
  },
  getEmployee: async (id: number): Promise<Employee> => {
    const response = await axios.get(`${API_URL}/employees/${id}`);
    return response.data;
  },
  createEmployee: async (employee: EmployeeInput): Promise<Employee> => {
    const response = await axios.post(`${API_URL}/employees`, employee);
    return response.data;
  },
  updateEmployee: async (id: number, employee: EmployeeInput): Promise<Employee> => {
    const response = await axios.put(`${API_URL}/employees/${id}`, employee);
    return response.data;
  },
  deleteEmployee: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/employees/${id}`);
  }
};