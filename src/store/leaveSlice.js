import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

// Async thunks
export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchLeaveRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/leave-requests`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave requests');
    }
  }
);

export const fetchLeavesByEmployee = createAsyncThunk(
  'leave/fetchLeavesByEmployee',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/leave-requests?employeeId=${employeeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee leaves');
    }
  }
);

export const submitLeaveRequest = createAsyncThunk(
  'leave/submitLeaveRequest',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/leave-requests`, {
        ...leaveData,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0],
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit leave request');
    }
  }
);

export const approveLeave = createAsyncThunk(
  'leave/approveLeave',
  async ({ id, approvedBy }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE}/leave-requests/${id}`, {
        status: 'approved',
        approvedBy,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve leave');
    }
  }
);

export const rejectLeave = createAsyncThunk(
  'leave/rejectLeave',
  async ({ id, approvedBy }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE}/leave-requests/${id}`, {
        status: 'rejected',
        approvedBy,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject leave');
    }
  }
);

export const cancelLeave = createAsyncThunk(
  'leave/cancelLeave',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/leave-requests/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel leave');
    }
  }
);

const initialState = {
  leaveRequests: [],
  employeeLeaves: [],
  loading: false,
  error: null,
  success: false,
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Leave Requests
    builder
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Leaves by Employee
    builder
      .addCase(fetchLeavesByEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeavesByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeLeaves = action.payload;
      })
      .addCase(fetchLeavesByEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Submit Leave Request
    builder
      .addCase(submitLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests.push(action.payload);
        state.employeeLeaves.push(action.payload);
        state.success = true;
      })
      .addCase(submitLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Approve Leave
    builder
      .addCase(approveLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.loading = false;
        const updateLeave = (leaves) => {
          const index = leaves.findIndex((leave) => leave.id === action.payload.id);
          if (index !== -1) {
            leaves[index] = action.payload;
          }
        };
        updateLeave(state.leaveRequests);
        updateLeave(state.employeeLeaves);
        state.success = true;
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Reject Leave
    builder
      .addCase(rejectLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        state.loading = false;
        const updateLeave = (leaves) => {
          const index = leaves.findIndex((leave) => leave.id === action.payload.id);
          if (index !== -1) {
            leaves[index] = action.payload;
          }
        };
        updateLeave(state.leaveRequests);
        updateLeave(state.employeeLeaves);
        state.success = true;
      })
      .addCase(rejectLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Cancel Leave
    builder
      .addCase(cancelLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = state.leaveRequests.filter((leave) => leave.id !== action.payload);
        state.employeeLeaves = state.employeeLeaves.filter((leave) => leave.id !== action.payload);
        state.success = true;
      })
      .addCase(cancelLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = leaveSlice.actions;
export default leaveSlice.reducer;
