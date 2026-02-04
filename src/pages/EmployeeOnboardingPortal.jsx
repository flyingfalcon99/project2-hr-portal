import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useCurrentUser, useOnboardingLoading } from '@/store/hooks';
import { fetchOnboardingByEmployee, updateTask, completeOnboarding } from '@/store/onboardingSlice';

const TASK_INSTRUCTIONS = {
  'IT Setup': {
    description: 'Get your computer and access credentials set up',
    details: [
      'Your IT team will provide you with a laptop and equipment',
      'You will receive your email address and login credentials',
      'Two-factor authentication will be configured',
      'VPN and company applications will be installed',
    ],
    duration: '2 hours',
    contact: 'it@company.com',
  },
  'Badge & Access': {
    description: 'Receive your access badge and building access permissions',
    details: [
      'Visit HR office to get your ID badge printed',
      'Register fingerprints for building access system',
      'Receive parking pass and elevator access codes',
      'Emergency contact information will be recorded',
    ],
    duration: '30 minutes',
    contact: 'hr@company.com',
  },
  'Orientation Training': {
    description: 'Complete company orientation and meet the team',
    details: [
      'Overview of company history, mission, and values',
      'Company policies and code of conduct review',
      'Benefits overview and enrollment',
      'Meet your manager and team members',
    ],
    duration: '3 hours',
    contact: 'training@company.com',
  },
  'Department Training': {
    description: 'Learn about your department and role',
    details: [
      'Department overview and structure',
      'Your role and responsibilities',
      'Team workflows and processes',
      'Key systems and tools you will use',
    ],
    duration: '4 hours',
    contact: 'manager@company.com',
  },
  'Policy Acknowledgment': {
    description: 'Review and acknowledge company policies',
    details: [
      'Read employee handbook',
      'Review confidentiality and NDA agreements',
      'Understand anti-harassment and discrimination policies',
      'Sign acknowledgment forms',
    ],
    duration: '1 hour',
    contact: 'compliance@company.com',
  },
  'Emergency Contacts': {
    description: 'Register emergency contact information',
    details: [
      'Provide primary emergency contact details',
      'Provide secondary emergency contact details',
      'Authorize medical information release if needed',
      'Update in company system',
    ],
    duration: '15 minutes',
    contact: 'hr@company.com',
  },
  'Default Task': {
    description: 'Complete this onboarding task',
    details: ['Follow instructions provided by your manager', 'Ask for help if needed', 'Confirm completion'],
    duration: 'Varies',
    contact: 'manager@company.com',
  },
};

const DOCUMENT_INSTRUCTIONS = {
  'Offer Letter': 'Your formal job offer document. Please review and sign if not already signed.',
  'Employment Agreement': 'Your employment contract outlining terms and conditions.',
  'Confidentiality Agreement': 'Legal agreement protecting company confidential information.',
  'Employee Handbook': 'Complete guide to company policies and procedures.',
  'Benefits Information': 'Details about health insurance, 401k, and other benefits.',
  'Tax Forms (W4/I9)': 'Federal tax withholding and employment eligibility verification.',
};

export default function EmployeeOnboardingPortal() {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const loading = useOnboardingLoading();

  const [onboarding, setOnboarding] = useState(null);
  const [view, setView] = useState('checklist'); // 'checklist', 'timeline', 'congratulations'
  const [selectedTask, setSelectedTask] = useState(null);
  const [uploadModal, setUploadModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser?.employeeId) {
      dispatch(fetchOnboardingByEmployee(currentUser.employeeId))
        .unwrap()
        .then((data) => {
          setOnboarding(data);
          if (data?.status === 'completed') {
            setView('congratulations');
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [dispatch, currentUser]);

  // Calculate progress
  const progress = useMemo(() => {
    if (!onboarding) return { completed: 0, total: 0, percentage: 0 };

    const allItems = [...(onboarding.tasks || []), ...(onboarding.documents || [])];
    const completedItems = allItems.filter((item) => item.status === 'completed' || item.status === 'signed').length;

    return {
      completed: completedItems,
      total: allItems.length,
      percentage: allItems.length > 0 ? Math.round((completedItems / allItems.length) * 100) : 0,
    };
  }, [onboarding]);

  // Handle task completion
  const handleCompleteTask = async (taskId) => {
    setActionLoading(true);
    try {
      await dispatch(
        updateTask({
          onboardingId: onboarding.id,
          taskId,
          updates: { status: 'completed', completedDate: new Date().toISOString() },
        })
      ).unwrap();

      // Update local state
      setOnboarding((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, status: 'completed', completedDate: new Date().toISOString() } : t
        ),
      }));

      setSuccess(true);
      setSelectedTask(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to complete task');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle document upload
  const handleUploadDocument = async (docId) => {
    if (!uploadedFile) {
      alert('Please select a file');
      return;
    }

    setActionLoading(true);
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await dispatch(
        updateTask({
          onboardingId: onboarding.id,
          taskId: docId,
          updates: {
            status: 'signed',
            uploadedDate: new Date().toISOString(),
            fileName: uploadedFile.name,
          },
          isDocument: true,
        })
      ).unwrap();

      // Update local state
      setOnboarding((prev) => ({
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === docId
            ? {
                ...d,
                status: 'signed',
                uploadedDate: new Date().toISOString(),
                fileName: uploadedFile.name,
              }
            : d
        ),
      }));

      setSuccess(true);
      setUploadModal(null);
      setUploadedFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle complete onboarding
  const handleCompleteOnboarding = async () => {
    if (progress.completed !== progress.total) {
      alert('Please complete all tasks and documents before finishing onboarding');
      return;
    }

    setActionLoading(true);
    try {
      await dispatch(completeOnboarding(onboarding.id)).unwrap();
      setOnboarding((prev) => ({ ...prev, status: 'completed' }));
      setView('congratulations');
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setActionLoading(false);
    }
  };

  if (!onboarding && !loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
        <div className="card text-center py-12">
          <p className="text-secondary-600">No onboarding record found</p>
        </div>
      </div>
    );
  }

  // Congratulations Screen
  if (view === 'congratulations') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-50 to-primary-50 flex items-center justify-center p-4">
        <div className="card text-center py-12 max-w-md">
          <div className="mb-6 inline-block">
            <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-success-600 mb-2">Welcome!</h1>
          <p className="text-2xl font-semibold text-secondary-900 mb-4">
            Congratulations, {currentUser?.firstName}!
          </p>
          <p className="text-secondary-600 mb-8">
            You have successfully completed your onboarding. You're all set to start your new journey with us!
          </p>
          <div className="space-y-3">
            <p className="text-sm text-secondary-700">
              ✓ All tasks completed<br />
              ✓ All documents signed<br />
              ✓ Ready to work
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-secondary-200">
            <p className="text-sm text-secondary-600 mb-4">Next steps:</p>
            <ul className="text-sm text-secondary-700 space-y-2">
              <li>• Check your email for important information</li>
              <li>• Meet with your manager to discuss your first day</li>
              <li>• Explore the HR portal for company resources</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to {currentUser?.firstName}!</h1>
          <p className="text-primary-100">Let's get you onboarded and ready to contribute</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Your Progress</p>
              <h2 className="text-3xl font-bold text-secondary-900">
                {progress.completed} of {progress.total} Complete
              </h2>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-primary-600">{progress.percentage}%</div>
            </div>
          </div>

          <div className="w-full bg-secondary-200 rounded-full h-4 mb-6">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('checklist')}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                view === 'checklist'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200'
              }`}
            >
              ☑ Checklist
            </button>
            <button
              onClick={() => setView('timeline')}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                view === 'timeline'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200'
              }`}
            >
              📅 Timeline
            </button>
          </div>
        </div>

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
            <p className="text-sm text-success-700">Task completed successfully!</p>
          </div>
        )}

        {/* Checklist View */}
        {view === 'checklist' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tasks Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card">
                <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                  </svg>
                  Tasks to Complete
                </h3>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {onboarding?.tasks && onboarding.tasks.length > 0 ? (
                      onboarding.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            selectedTask?.id === task.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-secondary-200 bg-white hover:border-primary-300'
                          } ${task.status === 'completed' ? 'bg-success-50 border-success-200' : ''}`}
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {task.status === 'completed' ? (
                                <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-secondary-300" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-secondary-900">{task.name}</p>
                              <p className="text-sm text-secondary-600">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            {task.status === 'completed' && (
                              <span className="badge badge-success text-xs">✓ Done</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-secondary-600">No tasks assigned yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Documents Section */}
              <div className="card">
                <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  Documents to Sign
                </h3>

                <div className="space-y-3">
                  {onboarding?.documents && onboarding.documents.length > 0 ? (
                    onboarding.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          doc.status === 'signed' ? 'bg-success-50 border-success-200' : 'border-secondary-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex-shrink-0 mt-1">
                              {doc.status === 'signed' ? (
                                <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-warning-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-secondary-900">{doc.name}</p>
                              {doc.status === 'signed' && doc.uploadedDate && (
                                <p className="text-sm text-success-700">
                                  ✓ Signed on {new Date(doc.uploadedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          {doc.status !== 'signed' && (
                            <button
                              onClick={() => setUploadModal(doc.id)}
                              className="btn-primary btn-sm"
                            >
                              Upload
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-secondary-600">No documents to sign</p>
                  )}
                </div>
              </div>
            </div>

            {/* Details Panel */}
            <div className="card">
              {selectedTask ? (
                <div>
                  <h4 className="text-lg font-bold text-secondary-900 mb-4">{selectedTask.name}</h4>

                  <div className="space-y-4 mb-6">
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <p className="text-sm text-primary-900">
                        {TASK_INSTRUCTIONS[selectedTask.name]?.description ||
                          TASK_INSTRUCTIONS['Default Task'].description}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-secondary-600 uppercase mb-2">Instructions</p>
                      <ul className="space-y-2">
                        {(
                          TASK_INSTRUCTIONS[selectedTask.name]?.details ||
                          TASK_INSTRUCTIONS['Default Task'].details
                        ).map((detail, idx) => (
                          <li key={idx} className="text-sm text-secondary-700 flex gap-2">
                            <span className="text-primary-600 flex-shrink-0">▸</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-secondary-200">
                      <div>
                        <p className="text-xs text-secondary-600 mb-1">Duration</p>
                        <p className="font-semibold text-secondary-900">
                          {TASK_INSTRUCTIONS[selectedTask.name]?.duration ||
                            TASK_INSTRUCTIONS['Default Task'].duration}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary-600 mb-1">Contact</p>
                        <p className="font-semibold text-secondary-900">
                          {TASK_INSTRUCTIONS[selectedTask.name]?.contact ||
                            TASK_INSTRUCTIONS['Default Task'].contact}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedTask.status !== 'completed' && (
                    <button
                      onClick={() => handleCompleteTask(selectedTask.id)}
                      disabled={actionLoading}
                      className="btn-success w-full"
                    >
                      {actionLoading ? 'Marking Complete...' : '✓ Mark as Complete'}
                    </button>
                  )}

                  {selectedTask.status === 'completed' && (
                    <div className="bg-success-50 border border-success-200 rounded-lg p-3 text-center">
                      <p className="text-sm text-success-700 font-semibold">✓ Completed</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-secondary-300 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-secondary-600">Select a task to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline View */}
        {view === 'timeline' && (
          <div className="card">
            <h3 className="text-xl font-bold text-secondary-900 mb-8">Your Onboarding Journey</h3>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 to-primary-600" />

              {/* Timeline items */}
              <div className="space-y-8">
                {onboarding?.tasks && onboarding.tasks.length > 0 && (
                  <>
                    {onboarding.tasks.map((task) => (
                      <div key={task.id} className="relative pl-16">
                        <div
                          className={`w-10 h-10 rounded-full absolute left-0 flex items-center justify-center ${
                            task.status === 'completed'
                              ? 'bg-success-500 border-4 border-white shadow-lg'
                              : 'bg-secondary-200 border-4 border-white'
                          }`}
                        >
                          {task.status === 'completed' && (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>

                        <div
                          className={`p-4 rounded-lg border-2 ${
                            task.status === 'completed'
                              ? 'bg-success-50 border-success-200'
                              : 'bg-secondary-50 border-secondary-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-secondary-900">{task.name}</p>
                              <p className="text-sm text-secondary-600 mt-1">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                              {task.status === 'completed' && task.completedDate && (
                                <p className="text-sm text-success-700 mt-1">
                                  Completed: {new Date(task.completedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {task.status === 'completed' && (
                              <span className="badge badge-success">Done</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {onboarding?.documents && onboarding.documents.length > 0 && (
                  <>
                    {onboarding.documents.map((doc) => (
                      <div key={doc.id} className="relative pl-16">
                        <div
                          className={`w-10 h-10 rounded-full absolute left-0 flex items-center justify-center ${
                            doc.status === 'signed'
                              ? 'bg-success-500 border-4 border-white shadow-lg'
                              : 'bg-secondary-200 border-4 border-white'
                          }`}
                        >
                          {doc.status === 'signed' && (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>

                        <div
                          className={`p-4 rounded-lg border-2 ${
                            doc.status === 'signed'
                              ? 'bg-success-50 border-success-200'
                              : 'bg-secondary-50 border-secondary-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-secondary-900">{doc.name}</p>
                              {doc.status === 'signed' && doc.uploadedDate && (
                                <p className="text-sm text-success-700 mt-1">
                                  Signed: {new Date(doc.uploadedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {doc.status === 'signed' && (
                              <span className="badge badge-success">Signed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Complete Button */}
        {progress.percentage === 100 && onboarding?.status === 'in-progress' && (
          <div className="mt-8">
            <button
              onClick={handleCompleteOnboarding}
              disabled={actionLoading}
              className="btn-success w-full py-4 text-lg"
            >
              {actionLoading ? 'Completing...' : '🎉 Complete My Onboarding'}
            </button>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Upload Document</h3>

            <div className="mb-6">
              <p className="text-sm text-secondary-600 mb-4">
                {DOCUMENT_INSTRUCTIONS[
                  onboarding.documents.find((d) => d.id === uploadModal)?.name
                ] || 'Please upload the required document.'}
              </p>

              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                <svg className="mx-auto h-8 w-8 text-secondary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <input
                  type="file"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <p className="text-sm text-primary-600 font-semibold">
                    {uploadedFile ? uploadedFile.name : 'Click to upload'}
                  </p>
                  <p className="text-xs text-secondary-600">PDF, DOC, or DOCX</p>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setUploadModal(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={() => handleUploadDocument(uploadModal)}
                disabled={actionLoading || !uploadedFile}
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
