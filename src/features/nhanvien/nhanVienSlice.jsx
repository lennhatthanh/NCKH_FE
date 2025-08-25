import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';

export const dangNhapAdmin = createAsyncThunk('admin/dangNhap', async (payload) => {
    const res = await api.post('/auth/dang-nhap-admin', payload);
    return res.data;
});
export const kiemTraAdmin = createAsyncThunk('admin/kiemTraAdmin', async (payload, { rejectWithValue }) => {
    try {
        const res = await api.get('/admin/kiem-tra-admin', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token_admin')}`,
            },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const dangXuatAdmin = createAsyncThunk('admin/dangXuatAdmin', async (payload, { rejectWithValue }) => {
    try {
        const res = await api.get('/auth/dang-xuat', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token_admin')}`,
            },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
const nhanVienSlice = createSlice({
    name: 'admin',
    initialState: {
        admin: [],
        dangNhap: {},
    },
    extraReducers: (builder) => {
        builder.addCase(dangNhapAdmin.fulfilled, (state, action) => {
            state.dangNhap = action.payload;
            localStorage.setItem('token_admin', state.dangNhap.accessToken);
        });
    },
});

export default nhanVienSlice.reducer;
