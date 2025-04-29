import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { FileTextIcon, DownloadIcon, PrinterIcon, BarChartIcon, PieChartIcon } from 'lucide-react';
import { api } from '../services/api';
import { Employee, Department } from '../types/employee';
export const ReportGenerator = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<'all' | 'department'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('HR');
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'quarter' | 'year'>('all');
  const reportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetchEmployees();
  }, []);
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (error) {
      toast.error('Failed to fetch employee data for reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePrint = () => {
    if (reportRef.current) {
      window.print();
      toast.success('Report printed successfully');
    }
  };
  const handleExportCSV = () => {
    const filteredData = getFilteredEmployees();
    // Create CSV headers
    const headers = ['ID', 'Name', 'Email', 'Department', 'Created At', 'Updated At'];
    // Convert data to CSV rows
    const csvRows = [headers.join(','), ...filteredData.map(emp => [emp.id, `"${emp.name}"`, `"${emp.email}"`, emp.department, new Date(emp.createdAt).toLocaleString(), new Date(emp.updatedAt).toLocaleString()].join(','))];
    // Create CSV content
    const csvContent = csvRows.join('\n');
    // Create download link
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `employee_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV report downloaded successfully');
  };
  const getFilteredEmployees = () => {
    let filtered = [...employees];
    // Filter by department
    if (reportType === 'department') {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }
    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      switch (dateRange) {
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      filtered = filtered.filter(emp => new Date(emp.createdAt) >= cutoffDate);
    }
    return filtered;
  };
  const getDepartmentCounts = () => {
    const counts: Record<Department, number> = {
      HR: 0,
      IT: 0,
      Finance: 0,
      Operations: 0
    };
    employees.forEach(emp => {
      counts[emp.department]++;
    });
    return counts;
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  const filteredEmployees = getFilteredEmployees();
  const departmentCounts = getDepartmentCounts();
  return <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Employee Reports
          </h2>
          <div className="flex space-x-2">
            <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center text-sm">
              <PrinterIcon className="h-4 w-4 mr-1" />
              Print
            </button>
            <button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center text-sm">
              <DownloadIcon className="h-4 w-4 mr-1" />
              Export CSV
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select id="reportType" className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" value={reportType} onChange={e => setReportType(e.target.value as 'all' | 'department')}>
              <option value="all">All Employees</option>
              <option value="department">By Department</option>
            </select>
          </div>
          {reportType === 'department' && <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select id="department" className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value as Department)}>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>}
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select id="dateRange" className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" value={dateRange} onChange={e => setDateRange(e.target.value as 'all' | 'month' | 'quarter' | 'year')}>
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading report data...</p>
        </div> : <div className="p-6" ref={reportRef}>
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FileTextIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                {reportType === 'all' ? 'All Employees Report' : `${selectedDepartment} Department Report`}
              </h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {filteredEmployees.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Report Date</p>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Range</p>
                  <p className="text-lg font-medium text-gray-900">
                    {dateRange === 'all' ? 'All Time' : dateRange === 'month' ? 'Last Month' : dateRange === 'quarter' ? 'Last Quarter' : 'Last Year'}
                  </p>
                </div>
                {reportType === 'department' && <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedDepartment}
                    </p>
                  </div>}
              </div>
            </div>
          </div>
          {reportType === 'all' && <div className="mb-8">
              <div className="flex items-center mb-4">
                <PieChartIcon className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Department Distribution
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(departmentCounts).map(([dept, count]) => <div key={dept} className="bg-white border rounded-md p-4 shadow-sm">
                    <p className="text-sm text-gray-500">{dept}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {count}
                    </p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${dept === 'HR' ? 'bg-purple-600' : dept === 'IT' ? 'bg-blue-600' : dept === 'Finance' ? 'bg-green-600' : 'bg-orange-600'}`} style={{
                width: `${count / employees.length * 100}%`
              }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {(count / employees.length * 100).toFixed(1)}% of total
                    </p>
                  </div>)}
              </div>
            </div>}
          <div>
            <div className="flex items-center mb-4">
              <BarChartIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                Employee Details
              </h3>
            </div>
            {filteredEmployees.length === 0 ? <div className="text-center py-4 text-gray-600">
                No employee data available for the selected filters.
              </div> : <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map(employee => <tr key={employee.id}>
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
                      </tr>)}
                  </tbody>
                </table>
              </div>}
          </div>
        </div>}
    </div>;
};
