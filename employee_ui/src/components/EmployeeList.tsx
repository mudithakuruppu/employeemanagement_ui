import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PlusIcon, PencilIcon, TrashIcon, ArrowUpDownIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { api } from '../services/api';
import { Employee, Department, DEPARTMENTS } from '../types/employee';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
export const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<Department | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    direction: 'asc' | 'desc';
  }>({
    key: 'name',
    direction: 'asc'
  });
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  useEffect(() => {
    fetchEmployees();
  }, []);
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await api.deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
      toast.success('Employee deleted successfully');
      setEmployeeToDelete(null);
    } catch (error) {
      toast.error('Failed to delete employee');
      console.error(error);
    }
  };
  const handleSort = (key: keyof Employee) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({
      key,
      direction
    });
  };
  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  const filteredEmployees = sortedEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'All' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  return <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Employee Directory
          </h2>
          <Link to="/add" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Employee
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" placeholder="Search by name or email..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center">
            <FilterIcon className="h-5 w-5 text-gray-400 mr-2" />
            <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterDepartment} onChange={e => setFilterDepartment(e.target.value as Department | 'All')}>
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>
                  {dept}
                </option>)}
            </select>
          </div>
        </div>
      </div>
      {loading ? <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading employees...</p>
        </div> : filteredEmployees.length === 0 ? <div className="p-6 text-center">
          <p className="text-gray-600">No employees found.</p>
        </div> : <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('id')}>
                  <div className="flex items-center">
                    ID
                    <ArrowUpDownIcon className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    Name
                    <ArrowUpDownIcon className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                  <div className="flex items-center">
                    Email
                    <ArrowUpDownIcon className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('department')}>
                  <div className="flex items-center">
                    Department
                    <ArrowUpDownIcon className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('createdAt')}>
                  <div className="flex items-center">
                    Created At
                    <ArrowUpDownIcon className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('updatedAt')}>
                  <div className="flex items-center">
                    Updated At
                    <ArrowUpDownIcon className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map(employee => <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${employee.department === 'HR' ? 'bg-purple-100 text-purple-800' : ''}
                      ${employee.department === 'IT' ? 'bg-blue-100 text-blue-800' : ''}
                      ${employee.department === 'Finance' ? 'bg-green-100 text-green-800' : ''}
                      ${employee.department === 'Operations' ? 'bg-orange-100 text-orange-800' : ''}
                    `}>
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(employee.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(employee.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link to={`/edit/${employee.id}`} className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button onClick={() => setEmployeeToDelete(employee)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}
      {employeeToDelete && <DeleteConfirmationModal employee={employeeToDelete} onConfirm={() => handleDelete(employeeToDelete.id)} onCancel={() => setEmployeeToDelete(null)} />}
    </div>;
};
