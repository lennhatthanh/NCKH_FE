import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const dataTramSoTan = createAsyncThunk('tramsotan/dataTramSoTan', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('https://68522b030594059b23cc7ea8.mockapi.io/api/tram-so-tan');
        return res;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const dataTramSoTanOpen = createAsyncThunk('tramsotan/dataTramSoTanOpen', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('http://127.0.0.1:3000/tram-so-tan/lay-tram-open');
        return res;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const themTramSoTan = createAsyncThunk('tramsotan/themTramSoTan', async (payload, { rejectWithValue }) => {
    try {
        const res = await api.post('https://68522b030594059b23cc7ea8.mockapi.io/api/tram-so-tan', payload);
        return res;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const capNhatTramSoTan = createAsyncThunk('tramsotan/capNhatTramSoTan', async (payload, { rejectWithValue }) => {
    try {
        const res = await api.put(`https://68522b030594059b23cc7ea8.mockapi.io/api/tram-so-tan/${payload.id}`, payload);
        return res;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const xoaTramSoTan = createAsyncThunk('tramsotan/xoaTramSoTan', async (payload, { rejectWithValue }) => {
    try {
        const res = await api.delete(`https://68522b030594059b23cc7ea8.mockapi.io/api/tram-so-tan/${payload}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
const tramSoTanSlice = createSlice({
    name: 'tramsotan',
    initialState: {
        tramsotan: [],
        tramsotanopen: []
    },
    extraReducers: (builder) => {
        builder
            .addCase(dataTramSoTan.fulfilled, (state, action) => {
                state.tramsotan = action.payload.data;
            })
            .addCase(dataTramSoTanOpen.fulfilled, (state, action) => {
                state.tramsotanopen = action.payload.data.data;
            })
            .addCase(themTramSoTan.fulfilled, (state, action) => {
                state.tramsotan.push(action.payload.data);
            })
            .addCase(xoaTramSoTan.fulfilled, (state, action) => {
                state.tramsotan = state.tramsotan.filter((item) => item.id !== action.meta.arg);
            })
            .addCase(capNhatTramSoTan.fulfilled, (state, action) => {
                const index = state.tramsotan.findIndex((item) => item.id === action.payload.data.id);
                if (index !== -1) {
                    state.tramsotan[index] = action.payload.data;
                }
            });
    },
});

export default tramSoTanSlice.reducer;
