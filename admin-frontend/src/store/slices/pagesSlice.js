import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchPages = createAsyncThunk(
    'pages/fetchPages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/content/pages');
            return response.data.pages;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch pages');
        }
    }
);

export const deletePage = createAsyncThunk(
    'pages/deletePage',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/content/pages/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete page');
        }
    }
);

const pagesSlice = createSlice({
    name: 'pages',
    initialState: {
        items: [],
        isLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPages.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchPages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deletePage.fulfilled, (state, action) => {
                state.items = state.items.filter((p) => p.id !== action.payload);
            });
    }
});

export default pagesSlice.reducer;