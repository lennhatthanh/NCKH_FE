import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const dataMonChoi = createAsyncThunk('monchoi/dataMonChoi', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/mon-choi/lay-mon-choi');
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const themMonChoi = createAsyncThunk('monchoi/themMonChoi', async (payload, { rejectWithValue }) => {
    try {
        const res = await api.post('/mon-choi/them-mon-choi', payload);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const capNhatMonChoi = createAsyncThunk('monchoi/capNhatMonChoi', async (payload, { rejectWithValue }) => {
    try {
        const res = await api.put('/mon-choi/cap-nhat-mon-choi', payload);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const xoaMonChoi = createAsyncThunk('monchoi/xoaMonChoi', async (payload, { rejectWithValue }) => {
    try {
        const res = await api.delete(`/mon-choi/xoa-mon-choi/${payload}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
const yeuCauSlice = createSlice({
    name: 'monchoi',
    initialState: {
        monchoi: [],
    },
    extraReducers: (builder) => {
        builder
            .addCase(dataMonChoi.fulfilled, (state, action) => {
                state.monchoi = action.payload.data;
            })
            .addCase(themMonChoi.fulfilled, (state, action) => {
                state.monchoi.push(action.payload.data);
            })
            .addCase(xoaMonChoi.fulfilled, (state, action) => {
                state.monchoi = state.monchoi.filter((item) => item.id !== action.meta.arg);
            })
            .addCase(capNhatMonChoi.fulfilled, (state, action) => {
                const index = state.monchoi.findIndex((item) => item.id === action.payload.data.id);
                if (index !== -1) {
                    state.monchoi[index] = action.payload.data;
                }
            });
    },
});

export default yeuCauSlice.reducer;
