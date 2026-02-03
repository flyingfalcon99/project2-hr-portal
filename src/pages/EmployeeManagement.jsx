import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useEmployees, useEmployeeLoading } from '@/store/hooks';
import { fetchEmployees } from '@/store/employeeSlice';
import useNotification from '@/store/useNotification';
import FilterPanel from '@/components/FilterPanel';
import {
  filterEmployees,
  getUniqueDepartments,
  getUniquePositions,
  debounce,
  hasActiveFilters,
} from '@/utils/filterUtils';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const ITEMS_PER_PAGE = 10;
const DEPARTMENTS = [
  'All Departments',
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Customer Support',
];
const STATUS_OPTIONS = ['All Status', 'active', 'inactive', 'on-leave'];

export default function EmployeeManagement() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { success: showSuccess, error: showError, info: showInfo } = useNotification();
  const employees = useEmployees();
  const loading = useEmployeeLoading();

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: 'All Departments',
    position: 'All Positions',
    status: 'All Status',
  });
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deactivateId, setDeactivateId] = useState(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
      setCurrentPage(1); // Reset to first page on new search
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Get unique positions for filter dropdown
  const positions = useMemo(() => getUniquePositions(employees), [employees]);

  // Apply filters and search
  const filteredEmployees = useMemo(() => {
    return filterEmployees(employees, {
      search: debouncedSearchTerm,
      department: filters.department,
      position: filters.position,
      status: filters.status,
    });
  }, [employees, debouncedSearchTerm, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmployees, currentPage]);

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    if (typeof filterName === 'object') {
      // If called with object (all filters at once)
      setFilters(filterName);
      setCurrentPage(1);
    } else {
      // If called with individual filter
      setFilters((prev) => ({ ...prev, [filterName]: value }));
      setCurrentPage(1);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setFilters({
      department: 'All Departments',
      position: 'All Positions',
      status: 'All Status',
    });
    setCurrentPage(1);
    showInfo('Filters Cleared', 'All search and filter criteria have been reset');
  };

  const handleDeactivate = async (id) => {
    setDeactivateLoading(true);
    try {
      const employee = employees.find((emp) => emp.id === id);
      await axios.put(`${API_BASE}/employees/${id}`, {
        ...employee,
        status: 'inactive',
      });
      dispatch(fetchEmployees());
      setDeactivateId(null);
      showSuccess('Employee Deactivated', `${employee.firstName} ${employee.lastName} has been deactivated`);
    } catch (error) {
      console.error('Failed to deactivate employee:', error);
      showError('Deactivation Failed', 'Unable to deactivate employee. Please try again.');
    } finally {
      setDeactivateLoading(false);
    }
  };

  const exportToCSV = () => {
    if (filteredEmployees.length === 0) {
      showError('No Data', 'There are no employees to export. Please adjust your filters.');
      return;
    }

    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Position', 'Joining Date', 'Status'];
    const rows = filteredEmployees.map((emp) => [
      emp.id,
      emp.firstName,
      emp.lastName,
      emp.email,
      emp.phone,
      emp.department,
      emp.position,
      emp.dateOfJoining,
      emp.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showSuccess('Export Successful', `${filteredEmployees.length} employee records exported`);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Employee Management</h1>
              <p className="text-secondary-600 mt-1">Manage and organize your workforce</p>
            </div>
            <button
              onClick={() => navigate('/employees/add')}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.5 1.5H9.5V9H1.5v1h7.5v7.5h1V10h7.5V9h-7.5V1.5z" />
              </svg>
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Global Search
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                  aria-label="Search employees"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Filter Panel Button */}
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onToggle={setFilterPanelOpen}
                isOpen={filterPanelOpen}
                filterGroups={[
                  {
                    name: 'department',
                    label: 'Department',
                    type: 'select',
                    options: DEPARTMENTS,
                  },
                  {
                    name: 'position',
                    label: 'Position',
                    type: 'select',
                    options: positions,
                  },
                  {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    options: STATUS_OPTIONS,
                  },
                ]}
              />

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-secondary-200 text-secondary-700 hover:border-secondary-300 bg-white transition-colors"
                title="Export filtered results to CSV"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0 0V8m0 4h4m-4 0H8m14 0a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Export
              </button>

              {/* Clear Filters - Only show if filters are active */}
              {hasActiveFilters(filters) || searchTerm ? (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-secondary-200 text-secondary-700 hover:border-secondary-300 bg-white transition-colors"
                  title="Clear all filters and search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All
                </button>
              ) : null}

              {/* Results Count */}
              <div className="ml-auto text-sm text-secondary-600">
                <span className="font-semibold text-secondary-900">{filteredEmployees.length}</span>
                {' '}
                {filteredEmployees.length === 1 ? 'employee' : 'employees'}
                {employees.length !== filteredEmployees.length && ` (of ${employees.length})`}
              </div>
            </div>

            {/* Active Filters Display */}
            {(hasActiveFilters(filters) || searchTerm) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-secondary-200">
                {searchTerm && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-sm">
                    <span className="text-primary-700">
                      Search: <span className="font-semibold">{searchTerm}</span>
                    </span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-primary-600 hover:text-primary-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {filters.department !== 'All Departments' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-sm">
                    <span className="text-primary-700">
                      Dept: <span className="font-semibold">{filters.department}</span>
                    </span>
                    <button
                      onClick={() => handleFilterChange('department', 'All Departments')}
                      className="text-primary-600 hover:text-primary-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {filters.position !== 'All Positions' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-sm">
                    <span className="text-primary-700">
                      Position: <span className="font-semibold">{filters.position}</span>
                    </span>
                    <button
                      onClick={() => handleFilterChange('position', 'All Positions')}
                      className="text-primary-600 hover:text-primary-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {filters.status !== 'All Status' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-sm">
                    <span className="text-primary-700">
                      Status: <span className="font-semibold">{filters.status}</span>
                    </span>
                    <button
                      onClick={() => handleFilterChange('status', 'All Status')}
                      className="text-primary-600 hover:text-primary-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={exportToCSV}
            className="btn-outline flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block card overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
          ) : paginatedEmployees.length === 0 ? (
            <div className="py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-secondary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-4 text-secondary-600">No employees found</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {paginatedEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {employee.firstName[0]}
                              {employee.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-semibold text-secondary-900">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-xs text-secondary-500">ID: {employee.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-secondary-700">{employee.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge-primary">{employee.department}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-secondary-700">{employee.position}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`badge ${
                            employee.status === 'active' ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold space-x-2">
                        <button
                          onClick={() => navigate(`/employees/${employee.id}`)}
                          className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/employees/${employee.id}/edit`)}
                          className="text-accent-600 hover:text-accent-700 inline-flex items-center gap-1"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        {employee.status === 'active' && (
                          <button
                            onClick={() => setDeactivateId(employee.id)}
                            className="text-danger-600 hover:text-danger-700 inline-flex items-center gap-1"
                            title="Deactivate"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-secondary-50 px-6 py-4 border-t border-secondary-200 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-secondary-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
          ) : paginatedEmployees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary-600">No employees found</p>
            </div>
          ) : (
            <>
              {paginatedEmployees.map((employee) => (
                <div key={employee.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {employee.firstName[0]}
                          {employee.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-secondary-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-secondary-500">{employee.email}</p>
                      </div>
                    </div>
                    <span
                      className={`badge ${
                        employee.status === 'active' ? 'badge-success' : 'badge-danger'
                      }`}
                    >
                      {employee.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b border-secondary-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Department</span>
                      <span className="font-semibold text-secondary-900">{employee.department}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Position</span>
                      <span className="font-semibold text-secondary-900">{employee.position}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Joined</span>
                      <span className="font-semibold text-secondary-900">{employee.dateOfJoining}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/employees/${employee.id}`)}
                      className="btn-primary flex-1 btn-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/employees/${employee.id}/edit`)}
                      className="btn-outline flex-1 btn-sm"
                    >
                      Edit
                    </button>
                    {employee.status === 'active' && (
                      <button
                        onClick={() => setDeactivateId(employee.id)}
                        className="btn-danger flex-1 btn-sm"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Mobile Pagination */}
              {totalPages > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary flex-1 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-center py-2 px-4 text-secondary-700 font-semibold">
                    {currentPage}/{totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary flex-1 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      {deactivateId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Deactivate Employee?</h3>
            <p className="text-secondary-600 mb-6">
              This action will deactivate the employee account. They will not be able to access the system.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeactivateId(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeactivate(deactivateId)}
                disabled={deactivateLoading}
                className="btn-danger flex-1"
              >
                {deactivateLoading ? 'Deactivating...' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
