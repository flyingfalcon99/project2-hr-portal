import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useOnboarding, useOnboardingLoading, useOnboardingError } from '@/store/hooks';
import { fetchOnboarding, updateTask, completeOnboarding } from '@/store/onboardingSlice';

const DEPARTMENTS = ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance', 'Operations'];

const TASK_TEMPLATES = [
  { id: 'nt1', name: 'IT Setup', category: 'Technology', defaultDueDay: 1 },
  { id: 'nt2', name: 'Badge & Access', category: 'Security', defaultDueDay: 1 },
  { id: 'nt3', name: 'Orientation Training', category: 'Training', defaultDueDay: 3 },
  { id: 'nt4', name: 'Department Training', category: 'Training', defaultDueDay: 7 },
  { id: 'nt5', name: 'Policy Acknowledgment', category: 'Compliance', defaultDueDay: 2 },
  { id: 'nt6', name: 'Emergency Contacts', category: 'HR', defaultDueDay: 1 },
];

const DOCUMENT_TEMPLATES = [
  { id: 'd1', name: 'Offer Letter', category: 'Legal' },
  { id: 'd2', name: 'Employment Agreement', category: 'Legal' },
  { id: 'd3', name: 'Confidentiality Agreement', category: 'Legal' },
  { id: 'd4', name: 'Employee Handbook', category: 'HR' },
  { id: 'd5', name: 'Benefits Information', category: 'HR' },
  { id: 'd6', name: 'Tax Forms (W4/I9)', category: 'Compliance' },
];

export default function OnboardingDashboard() {
  const dispatch = useAppDispatch();
  const onboardingList = useOnboarding();
  const loading = useOnboardingLoading();
  const error = useOnboardingError();

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedOnboarding, setSelectedOnboarding] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newTask, setNewTask] = useState({ taskName: '', dueDate: '', category: 'Other' });
  const [newDocument, setNewDocument] = useState({ docName: '', category: 'Other', uploadDate: '' });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchOnboarding());
  }, [dispatch]);

  // Filter onboarding records
  const filteredOnboarding = useMemo(() => {
    let filtered = onboardingList || [];

    if (filterStatus !== 'all') {
      filtered = filtered.filter((ob) => ob.status === filterStatus);
    }

    if (filterDepartment !== 'all') {
      filtered = filtered.filter((ob) => ob.employee?.department === filterDepartment);
    }

    return filtered.sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );
  }, [onboardingList, filterStatus, filterDepartment]);

  // Calculate progress
  const calculateProgress = (onboarding) => {
    if (!onboarding.tasks || onboarding.tasks.length === 0) return 0;
    const completed = onboarding.tasks.filter((t) => t.status === 'completed').length;
    return Math.round((completed / onboarding.tasks.length) * 100);
  };

  // Check if date is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  // Handle task completion
  const handleCompleteTask = async (onboardingId, taskId) => {
    setActionLoading(true);
    try {
      await dispatch(
        updateTask({
          onboardingId,
          taskId,
          updates: { status: 'completed', completedDate: new Date().toISOString() },
        })
      ).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to complete task:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle add task
  const handleAddTask = async () => {
    if (!newTask.taskName || !newTask.dueDate) {
      alert('Please fill in all fields');
      return;
    }

    setActionLoading(true);
    try {
      const task = {
        id: `task-${Date.now()}`,
        name: newTask.taskName,
        category: newTask.category,
        dueDate: newTask.dueDate,
        status: 'pending',
        assignedBy: 'HR',
        createdDate: new Date().toISOString(),
      };

      await dispatch(
        updateTask({
          onboardingId: selectedOnboarding.id,
          taskId: task.id,
          updates: task,
          isNew: true,
        })
      ).unwrap();

      setSuccess(true);
      setNewTask({ taskName: '', dueDate: '', category: 'Other' });
      setActiveModal(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to add task:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle add document
  const handleAddDocument = async () => {
    if (!newDocument.docName || !newDocument.uploadDate) {
      alert('Please fill in all fields');
      return;
    }

    setActionLoading(true);
    try {
      const doc = {
        id: `doc-${Date.now()}`,
        name: newDocument.docName,
        category: newDocument.category,
        uploadDate: newDocument.uploadDate,
        status: 'pending-signature',
        uploadedBy: 'HR',
      };

      await dispatch(
        updateTask({
          onboardingId: selectedOnboarding.id,
          taskId: doc.id,
          updates: doc,
          isDocument: true,
        })
      ).unwrap();

      setSuccess(true);
      setNewDocument({ docName: '', category: 'Other', uploadDate: '' });
      setActiveModal(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to add document:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle complete onboarding
  const handleCompleteOnboarding = async (onboardingId) => {
    if (!confirm('Mark this onboarding as complete? This cannot be undone.')) return;

    setActionLoading(true);
    try {
      await dispatch(completeOnboarding(onboardingId)).unwrap();
      setSuccess(true);
      setActiveModal(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-secondary-900">Onboarding Dashboard</h1>
          <p className="text-secondary-600 mt-1">Manage new hire onboarding and track progress</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-danger-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-success-50 border border-success-200 rounded-lg p-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-success-700">Action completed successfully!</p>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-900 mb-2">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="input-field"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterDepartment('all');
                }}
                className="btn-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Onboarding List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : filteredOnboarding.length === 0 ? (
          <div className="card text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-secondary-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <p className="text-secondary-600">No onboarding records found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOnboarding.map((onboarding) => {
              const progress = calculateProgress(onboarding);
              const isExpanded = expandedId === onboarding.id;

              return (
                <div key={onboarding.id} className="card">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-secondary-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-primary-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-secondary-900">
                            {onboarding.employee?.firstName} {onboarding.employee?.lastName}
                          </h3>
                          <p className="text-sm text-secondary-600">
                            {onboarding.employee?.position} • {onboarding.employee?.department}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-secondary-500">
                        Start Date: {new Date(onboarding.employee?.dateOfJoining).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${
                          onboarding.status === 'completed'
                            ? 'badge-success'
                            : onboarding.status === 'in-progress'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {onboarding.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="py-4 border-b border-secondary-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-secondary-900">Overall Progress</p>
                      <p className="text-sm font-bold text-primary-600">{progress}%</p>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <div className={`overflow-hidden transition-all ${isExpanded ? 'max-h-96 py-4' : 'max-h-0'}`}>
                    <div className="space-y-4">
                      {/* Tasks Section */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-secondary-900 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                            </svg>
                            Tasks
                          </h4>
                          <button
                            onClick={() => {
                              setSelectedOnboarding(onboarding);
                              setActiveModal('add-task');
                            }}
                            className="btn-primary btn-sm"
                          >
                            + Add Task
                          </button>
                        </div>
                        <div className="space-y-2">
                          {onboarding.tasks && onboarding.tasks.length > 0 ? (
                            onboarding.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-secondary-900">{task.name}</p>
                                  <p className="text-xs text-secondary-600">
                                    Category: {task.category} • Due:{' '}
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isOverdue(task.dueDate) && (
                                    <span className="badge badge-danger text-xs">Overdue</span>
                                  )}
                                  {task.status === 'pending' ? (
                                    <button
                                      onClick={() => handleCompleteTask(onboarding.id, task.id)}
                                      disabled={actionLoading}
                                      className="btn-success btn-sm"
                                    >
                                      ✓ Complete
                                    </button>
                                  ) : (
                                    <span className="badge badge-success text-xs">✓ Done</span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-secondary-600">No tasks assigned yet</p>
                          )}
                        </div>
                      </div>

                      {/* Documents Section */}
                      <div className="pt-4 border-t border-secondary-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-secondary-900 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                            </svg>
                            Documents
                          </h4>
                          <button
                            onClick={() => {
                              setSelectedOnboarding(onboarding);
                              setActiveModal('add-document');
                            }}
                            className="btn-primary btn-sm"
                          >
                            + Upload Doc
                          </button>
                        </div>
                        <div className="space-y-2">
                          {onboarding.documents && onboarding.documents.length > 0 ? (
                            onboarding.documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-secondary-900">{doc.name}</p>
                                  <p className="text-xs text-secondary-600">
                                    {doc.category} • Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <span
                                  className={`badge ${
                                    doc.status === 'signed'
                                      ? 'badge-success'
                                      : doc.status === 'pending-signature'
                                      ? 'badge-warning'
                                      : 'badge-secondary'
                                  } text-xs`}
                                >
                                  {doc.status}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-secondary-600">No documents uploaded yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-secondary-200">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : onboarding.id)}
                      className="btn-secondary flex-1"
                    >
                      {isExpanded ? '▼ Hide Details' : '▶ View Details'}
                    </button>
                    {onboarding.status === 'in-progress' && (
                      <button
                        onClick={() => handleCompleteOnboarding(onboarding.id)}
                        disabled={actionLoading}
                        className="btn-success flex-1"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {activeModal === 'add-task' && selectedOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Assign New Task</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Task Name
                </label>
                <input
                  type="text"
                  value={newTask.taskName}
                  onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                  placeholder="Enter task name or select..."
                  className="input-field mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  {TASK_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setNewTask({ ...newTask, taskName: template.name })}
                      className="text-xs p-2 border border-primary-200 rounded hover:bg-primary-50 text-left"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Category
                </label>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="input-field"
                >
                  <option value="Technology">Technology</option>
                  <option value="Training">Training</option>
                  <option value="Compliance">Compliance</option>
                  <option value="HR">HR</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setActiveModal(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                disabled={actionLoading}
                className="btn-primary flex-1"
              >
                {actionLoading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {activeModal === 'add-document' && selectedOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Upload Document</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  value={newDocument.docName}
                  onChange={(e) => setNewDocument({ ...newDocument, docName: e.target.value })}
                  placeholder="Enter document name or select..."
                  className="input-field mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  {DOCUMENT_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setNewDocument({ ...newDocument, docName: template.name })}
                      className="text-xs p-2 border border-primary-200 rounded hover:bg-primary-50 text-left"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Category
                </label>
                <select
                  value={newDocument.category}
                  onChange={(e) => setNewDocument({ ...newDocument, category: e.target.value })}
                  className="input-field"
                >
                  <option value="Legal">Legal</option>
                  <option value="HR">HR</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  Upload Date
                </label>
                <input
                  type="date"
                  value={newDocument.uploadDate}
                  onChange={(e) => setNewDocument({ ...newDocument, uploadDate: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setActiveModal(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleAddDocument}
                disabled={actionLoading}
                className="btn-primary flex-1"
              >
                {actionLoading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
