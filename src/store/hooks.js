import { useDispatch, useSelector } from 'react-redux';

// Custom typed hooks for Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Selector hooks for specific slices
export const useAuth = () => useAppSelector((state) => state.auth);
export const useEmployee = () => useAppSelector((state) => state.employee);
export const useLeave = () => useAppSelector((state) => state.leave);
export const useOnboarding = () => useAppSelector((state) => state.onboarding);

// Specific selectors
export const useCurrentUser = () => useAppSelector((state) => state.auth.currentUser);
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);
export const useAuthLoading = () => useAppSelector((state) => state.auth.loading);
export const useAuthError = () => useAppSelector((state) => state.auth.error);

export const useEmployees = () => useAppSelector((state) => state.employee.employees);
export const useSelectedEmployee = () => useAppSelector((state) => state.employee.selectedEmployee);
export const useEmployeeLoading = () => useAppSelector((state) => state.employee.loading);
export const useEmployeeError = () => useAppSelector((state) => state.employee.error);
export const useEmployeeSuccess = () => useAppSelector((state) => state.employee.success);

export const useLeaveRequests = () => useAppSelector((state) => state.leave.leaveRequests);
export const useEmployeeLeaves = () => useAppSelector((state) => state.leave.employeeLeaves);
export const useLeaveLoading = () => useAppSelector((state) => state.leave.loading);
export const useLeaveError = () => useAppSelector((state) => state.leave.error);
export const useLeaveSuccess = () => useAppSelector((state) => state.leave.success);

export const useOnboardingList = () => useAppSelector((state) => state.onboarding.onboardingList);
export const useCurrentOnboarding = () =>
  useAppSelector((state) => state.onboarding.currentOnboarding);
export const useOnboardingLoading = () => useAppSelector((state) => state.onboarding.loading);
export const useOnboardingError = () => useAppSelector((state) => state.onboarding.error);
export const useOnboardingSuccess = () => useAppSelector((state) => state.onboarding.success);
