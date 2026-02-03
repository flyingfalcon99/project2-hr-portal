import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Async thunks
export const fetchOnboarding = createAsyncThunk(
  'onboarding/fetchOnboarding',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/onboarding`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch onboarding data');
    }
  }
);

export const fetchOnboardingByEmployee = createAsyncThunk(
  'onboarding/fetchOnboardingByEmployee',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/onboarding?employeeId=${employeeId}`);
      return response.data[0] || null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee onboarding');
    }
  }
);

export const createOnboarding = createAsyncThunk(
  'onboarding/createOnboarding',
  async (onboardingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/onboarding`, {
        ...onboardingData,
        status: 'in-progress',
        documents: [],
        assignedTasks: [],
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create onboarding');
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'onboarding/uploadDocument',
  async ({ id, document }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/onboarding/${id}`);
      const updatedData = {
        ...response.data,
        documents: [...(response.data.documents || []), document],
      };
      const updateResponse = await axios.put(`${API_BASE}/onboarding/${id}`, updatedData);
      return updateResponse.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document');
    }
  }
);

export const updateTask = createAsyncThunk(
  'onboarding/updateTask',
  async ({ id, taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/onboarding/${id}`);
      const updatedTasks = response.data.assignedTasks.map((task) =>
        task.taskId === taskId ? { ...task, ...taskData } : task
      );
      const updateResponse = await axios.put(`${API_BASE}/onboarding/${id}`, {
        ...response.data,
        assignedTasks: updatedTasks,
      });
      return updateResponse.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  'onboarding/completeOnboarding',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE}/onboarding/${id}`, {
        status: 'completed',
        completionDate: new Date().toISOString().split('T')[0],
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete onboarding');
    }
  }
);

const initialState = {
  onboardingList: [],
  currentOnboarding: null,
  loading: false,
  error: null,
  success: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
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
    // Fetch Onboarding
    builder
      .addCase(fetchOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.onboardingList = action.payload;
      })
      .addCase(fetchOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Onboarding by Employee
    builder
      .addCase(fetchOnboardingByEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOnboardingByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOnboarding = action.payload;
      })
      .addCase(fetchOnboardingByEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Onboarding
    builder
      .addCase(createOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.onboardingList.push(action.payload);
        state.currentOnboarding = action.payload;
        state.success = true;
      })
      .addCase(createOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Upload Document
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.onboardingList.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.onboardingList[index] = action.payload;
        }
        state.currentOnboarding = action.payload;
        state.success = true;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.onboardingList.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.onboardingList[index] = action.payload;
        }
        state.currentOnboarding = action.payload;
        state.success = true;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Complete Onboarding
    builder
      .addCase(completeOnboarding.pending, (state) => {
        state.loading = true;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.onboardingList.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.onboardingList[index] = action.payload;
        }
        state.currentOnboarding = action.payload;
        state.success = true;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = onboardingSlice.actions;
export default onboardingSlice.reducer;
