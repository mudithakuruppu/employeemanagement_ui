import axios from 'axios';
import { Employee, EmployeeInput } from '../types/employee';

const API_URL = 'http://localhost:8080/api/employee';

export const api = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await axios.get(`${API_URL}/get-all`);
    return response.data;
  },

  getEmployee: async (id: number): Promise<Employee> => {
    const response = await axios.get(`${API_URL}/search/${id}`);
    return response.data;
  },

  createEmployee: async (employee: EmployeeInput): Promise<void> => {
    await axios.post(`${API_URL}/add`, employee);
  },

  updateEmployee: async (id: number, employee: EmployeeInput): Promise<Employee> => {
    // Note: backend doesn't take `id` as param, just include it inside the body
    const fullEmployee = { ...employee, id };
    const response = await axios.put(`${API_URL}/update`, fullEmployee);
    return response.data;
  },

  deleteEmployee: async (id: number): Promise<boolean> => {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  }
};
