import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';
import { Employee } from '../types/employee';
interface DeleteConfirmationModalProps {
  employee: Employee;
  onConfirm: () => void;
  onCancel: () => void;
}
export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  employee,
  onConfirm,
  onCancel
}) => {
  return <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4 text-red-600">
          <AlertTriangleIcon className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Delete Employee
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete {employee.name}? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>;
};