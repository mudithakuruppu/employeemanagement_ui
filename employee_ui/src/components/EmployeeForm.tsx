import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { SaveIcon, ArrowLeftIcon } from 'lucide-react';
import { api } from '../services/api';
import { EmployeeInput, DEPARTMENTS, Department } from '../types/employee';

export const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState<EmployeeInput>({
    name: '',
    email: '',
    department: 'HR',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    department?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployee = useCallback(async (employeeId: number) => {
    try {
      setLoading(true);
      const employee = await api.getEmployee(employeeId);
      setFormData({
        name: employee.name,
        email: employee.email,
        department: employee.department,
      });
    } catch {
      toast.error('Failed to fetch employee details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (isEditMode) {
      fetchEmployee(parseInt(id as string));
    }
  }, [id, fetchEmployee, isEditMode]);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; department?: string } = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Department validation
    if (!DEPARTMENTS.includes(formData.department)) {
      newErrors.department = 'Please select a valid department';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'department' ? value as Department : value,
    }));

    // Clear error for the field being updated
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      if (isEditMode) {
        await api.updateEmployee(parseInt(id as string), formData);
        toast.success('Employee updated successfully');
      } else {
        await api.createEmployee(formData);
        toast.success('Employee added successfully');
      }
      navigate('/');
    } catch (error: any) {
      if (error.response?.data?.message === 'Email already exists') {
        setErrors((prev) => ({
          ...prev,
          email: 'This email is already in use',
        }));
      } else {
        toast.error(isEditMode ? 'Failed to update employee' : 'Failed to add employee');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to List
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter employee name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter employee email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`mt-1 block w-full border ${errors.department ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md text-sm font-medium text-white flex items-center"
            >
              {submitting && (
                <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              )}
              <SaveIcon className="h-4 w-4 mr-1" />
              {isEditMode ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
