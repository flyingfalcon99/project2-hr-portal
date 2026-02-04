import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useLeaveRequests, useLeaveLoading, useEmployees } from '@/store/hooks';
import { fetchLeaveRequests, approveLeave, rejectLeave } from '@/store/leaveSlice';
import { useCurrentUser } from '@/store/hooks';
import useNotification from '@/store/useNotification';
import FilterPanel from '@/components/FilterPanel';
import {
  filterLeaves,
  getUniqueLeaveTypes,
  getLeaveCountByStatus,
  debounce,
  hasActiveFilters,
} from '@/utils/filterUtils';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const LEAVE_TYPES = [
  'All Types',
  'Sick Leave',
  'Vacation',
  'Personal Leave',
  'Emergency Leave',
  'Paid Time Off',
];

export default function LeaveRequests() {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const { success: showSuccess, error: showError, info: showInfo } = useNotification();
  const leaveRequests = useLeaveRequests();
  const employees = useEmployees();
  const loading = useLeaveLoading();

  // Tabs for filtering by status
  const [activeTab, setActiveTab] = useState('pending');
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    leaveType: 'All Types',
    startDate: '',
    endDate: '',
    employeeId: '',
  });
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Modal and selection state
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [actionModal, setActionModal] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

  // Map employee data to leave requests
  const enrichedLeaves = leaveRequests.map((leave) => {
    const employee = employees.find((emp) => emp.id === leave.employeeId);
    return {
      ...leave,
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
      employeeEmail: employee?.email || '',
    };
  });

  // Get unique leave types for filter
  const leaveTypes = useMemo(() => getUniqueLeaveTypes(enrichedLeaves), [enrichedLeaves]);

  // Get leave counts by status for badge display
  const leaveCountByStatus = useMemo(() => getLeaveCountByStatus(enrichedLeaves), [enrichedLeaves]);

  // Apply filters
  const filteredLeaves = useMemo(() => {
    let filtered = enrichedLeaves;

    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter((leave) => leave.status === activeTab);
    }

    // Apply search and additional filters
    filtered = filterLeaves(filtered, {
      search: debouncedSearchTerm,
      leaveType: filters.leaveType,
      startDate: filters.startDate,
      endDate: filters.endDate,
      employeeId: filters.employeeId,
    });

    return filtered;
  }, [activeTab, enrichedLeaves, debouncedSearchTerm, filters]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    if (typeof filterName === 'object') {
      // If called with object (all filters at once)
      setFilters(filterName);
    } else {
      // If called with individual filter
      setFilters((prev) => ({ ...prev, [filterName]: value }));
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setFilters({
      leaveType: 'All Types',
      startDate: '',
      endDate: '',
      employeeId: '',
    });
    showInfo('Filters Cleared', 'All search and filter criteria have been reset');
  };

  // Calculate duration
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Handle approve
  const handleApprove = async (leaveId) => {
    setActionLoading(true);

    try {
      await dispatch(approveLeave({ id: leaveId, approvedBy: currentUser.id })).unwrap();
      showSuccess('Leave Approved', 'The leave request has been approved successfully');
      setActionModal(null);
    } catch (err) {
      showError('Approval Failed', err.message || 'Failed to approve leave');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject
  const handleReject = async (leaveId) => {
    if (!rejectionComment.trim()) {
      showError('Rejection Reason Required', 'Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);

    try {
      await dispatch(rejectLeave({ id: leaveId, approvedBy: currentUser.id })).unwrap();
      
      // Save rejection comment
      try {
        await axios.patch(`${API_BASE}/leave-requests/${leaveId}`, {
          rejectionReason: rejectionComment,
        });
      } catch {
        console.log('Comment save failed but rejection succeeded');
      }

      showSuccess('Leave Rejected', 'The leave request has been rejected');
      setActionModal(null);
      setRejectionComment('');
    } catch (err) {
      showError('Rejection Failed', err.message || 'Failed to reject leave');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle bulk approve
  const handleBulkApprove = async () => {
    setActionLoading(true);

    try {
      await Promise.all(
        selectedRequests.map((id) =>
          dispatch(approveLeave({ id, approvedBy: currentUser.id })).unwrap()
        )
      );

      showSuccess(
        `${selectedRequests.length} Approved`,
        `Successfully approved ${selectedRequests.length} leave request${selectedRequests.length > 1 ? 's' : ''}`
      );
      setSelectedRequests([]);
    } catch (err) {
      showError('Bulk Approval Failed', err.message || 'Failed to approve some leave requests');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRequests.length === filteredLeaves.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredLeaves.map((leave) => leave.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedRequests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const tabs = [
    { id: 'pending', label: 'Pending', count: leaveCountByStatus.pending || 0 },
    { id: 'approved', label: 'Approved', count: leaveCountByStatus.approved || 0 },
    { id: 'rejected', label: 'Rejected', count: leaveCountByStatus.rejected || 0 },
    { id: 'all', label: 'All Requests', count: enrichedLeaves.length },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Leave Requests</h1>
              <p className="text-secondary-600 mt-1">Manage employee leave requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-secondary-200 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedRequests([]);
              }}
              className={`py-3 px-4 font-semibold text-sm transition-all border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary-600 border-primary-600'
                  : 'text-secondary-600 border-transparent hover:text-secondary-900'
              }`}
            >
              {tab.label}
              <span className="ml-2 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-900">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="card mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by employee name or leave details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 input-field"
            />
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-secondary-900">Filters</h3>
              {hasActiveFilters(filters) && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {Object.values(filters).filter(v => v && v !== 'All Types').length} active
                </span>
              )}
            </div>
            <button
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className="btn-outline text-sm"
            >
              {filterPanelOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filter Panel */}
          {filterPanelOpen && (
            <div className="mb-4 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Leave Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    Leave Type
                  </label>
                  <select
                    value={filters.leaveType}
                    onChange={(e) => handleFilterChange('leaveType', e.target.value)}
                    className="input-field"
                  >
                    <option value="All Types">All Types</option>
                    {leaveTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employee Filter */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    Employee
                  </label>
                  <select
                    value={filters.employeeId}
                    onChange={(e) => handleFilterChange('employeeId', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Employees</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date Filter */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="input-field"
                  />
                </div>

                {/* End Date Filter */}
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-end gap-2">
                {hasActiveFilters(filters) && (
                  <button
                    onClick={handleClearFilters}
                    className="btn-outline text-sm"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters(filters) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.leaveType !== 'All Types' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                  <span>{filters.leaveType}</span>
                  <button
                    onClick={() => handleFilterChange('leaveType', 'All Types')}
                    className="hover:text-primary-900"
                  >
                    ✕
                  </button>
                </div>
              )}
              {filters.employeeId && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                  <span>
                    {employees.find((e) => e.id === filters.employeeId)?.firstName}{' '}
                    {employees.find((e) => e.id === filters.employeeId)?.lastName}
                  </span>
                  <button
                    onClick={() => handleFilterChange('employeeId', '')}
                    className="hover:text-primary-900"
                  >
                    ✕
                  </button>
                </div>
              )}
              {filters.startDate && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                  <span>From: {filters.startDate}</span>
                  <button
                    onClick={() => handleFilterChange('startDate', '')}
                    className="hover:text-primary-900"
                  >
                    ✕
                  </button>
                </div>
              )}
              {filters.endDate && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                  <span>To: {filters.endDate}</span>
                  <button
                    onClick={() => handleFilterChange('endDate', '')}
                    className="hover:text-primary-900"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-secondary-600 mb-4">
            Showing <strong>{filteredLeaves.length}</strong> leave request{filteredLeaves.length !== 1 ? 's' : ''} {activeTab !== 'all' && `(${activeTab})`}
          </div>

          {/* Bulk Actions */}
          {selectedRequests.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
              <span className="text-sm font-semibold text-secondary-900">
                {selectedRequests.length} selected
              </span>
              <button
                onClick={handleBulkApprove}
                disabled={actionLoading}
                className="btn-success flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Approve All ({selectedRequests.length})
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="hidden md:block card overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
          ) : filteredLeaves.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-secondary-600">No leave requests found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-secondary-50 border-b border-secondary-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRequests.length === filteredLeaves.length && filteredLeaves.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-900 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200">
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(leave.id)}
                        onChange={() => toggleSelect(leave.id)}
                        disabled={leave.status !== 'pending'}
                        className="w-4 h-4 cursor-pointer disabled:opacity-50"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-semibold text-secondary-900">{leave.employeeName}</p>
                        <p className="text-xs text-secondary-500">{leave.employeeEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge-primary">{leave.leaveType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-secondary-700">
                        {new Date(leave.startDate).toLocaleDateString()} -{' '}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-secondary-900">
                        {calculateDuration(leave.startDate, leave.endDate)} days
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-secondary-700 max-w-xs truncate">{leave.reason}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`badge ${
                          leave.status === 'approved'
                            ? 'badge-success'
                            : leave.status === 'pending'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold space-x-2">
                      {leave.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => setActionModal({ type: 'approve', id: leave.id })}
                            className="text-success-600 hover:text-success-700 inline-flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => setActionModal({ type: 'reject', id: leave.id })}
                            className="text-danger-600 hover:text-danger-700 inline-flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-secondary-500">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
          ) : filteredLeaves.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary-600">No leave requests found</p>
            </div>
          ) : (
            filteredLeaves.map((leave) => (
              <div key={leave.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-secondary-900">{leave.employeeName}</p>
                    <p className="text-xs text-secondary-600">{leave.employeeEmail}</p>
                  </div>
                  <span
                    className={`badge ${
                      leave.status === 'approved'
                        ? 'badge-success'
                        : leave.status === 'pending'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b border-secondary-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Leave Type</span>
                    <span className="font-semibold">{leave.leaveType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Duration</span>
                    <span className="font-semibold">
                      {calculateDuration(leave.startDate, leave.endDate)} days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Dates</span>
                    <span className="font-semibold text-right">
                      {new Date(leave.startDate).toLocaleDateString()} to{' '}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="text-secondary-600 mb-1">Reason</p>
                    <p className="text-secondary-900">{leave.reason}</p>
                  </div>
                </div>

                {leave.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActionModal({ type: 'approve', id: leave.id })}
                      className="btn-success flex-1"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setActionModal({ type: 'reject', id: leave.id })}
                      className="btn-danger flex-1"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {/* Approve Confirmation Modal */}
      {actionModal?.type === 'approve' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Approve Leave Request?</h3>
            <p className="text-secondary-600 mb-6">
              This leave request will be marked as approved and the employee will be notified.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setActionModal(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(actionModal.id)}
                disabled={actionLoading}
                className="btn-success flex-1"
              >
                {actionLoading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {actionModal?.type === 'reject' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Reject Leave Request?</h3>
            <p className="text-secondary-600 mb-4">
              Please provide a reason for rejecting this leave request.
            </p>
            <textarea
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="input-field mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActionModal(null);
                  setRejectionComment('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(actionModal.id)}
                disabled={actionLoading || !rejectionComment.trim()}
                className="btn-danger flex-1"
              >
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
