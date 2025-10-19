import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const dangNhapAdmin = createAsyncThunk(
    "admin/dangNhap",
    async (payload) => {
        const res = await api.post("/auth/dang-nhap-admin", payload);
        return res.data;
    }
);
export const kiemTraAdmin = createAsyncThunk(
    "admin/kiemTraAdmin",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.get("/admin/kiem-tra-admin", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "token_admin"
                    )}`,
                },
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const dangXuatAdmin = createAsyncThunk(
    "admin/dangXuatAdmin",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.get("/auth/dang-xuat", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "token_admin"
                    )}`,
                },
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const dataNhanVien = createAsyncThunk(
    "nhanvien/dataNhanVien",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(
                "https://68aeee05b91dfcdd62bac986.mockapi.io/api/nhan-vien"
            );
            return res;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const themNhanVien = createAsyncThunk(
    "nhanvien/themNhanVien",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "https://68aeee05b91dfcdd62bac986.mockapi.io/api/nhan-vien",
                payload
            );
            return res;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const capNhatNhanVien = createAsyncThunk(
    "nhanvien/capNhatNhanVien",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.put(
                `https://68aeee05b91dfcdd62bac986.mockapi.io/api/nhan-vien/${payload.id}`,
                payload
            );
            return res;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const xoaNhanVien = createAsyncThunk(
    "nhanvien/xoaNhanVien",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.delete(
                `https://68aeee05b91dfcdd62bac986.mockapi.io/api/nhan-vien/${payload}`
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
const nhanVienSlice = createSlice({
    name: "admin",
    initialState: {
        dangNhap: {},
        nhanvien: [],
    },
    extraReducers: (builder) => {
        builder
            .addCase(dangNhapAdmin.fulfilled, (state, action) => {
                state.dangNhap = action.payload;
                localStorage.setItem("token_admin", state.dangNhap.accessToken);
            })
            .addCase(dataNhanVien.fulfilled, (state, action) => {
                state.nhanvien = action.payload.data;
            })
            .addCase(themNhanVien.fulfilled, (state, action) => {
                state.nhanvien.push(action.payload.data);
            })
            .addCase(xoaNhanVien.fulfilled, (state, action) => {
                state.nhanvien = state.nhanvien.filter(
                    (item) => item.id !== action.meta.arg
                );
            })
            .addCase(capNhatNhanVien.fulfilled, (state, action) => {
                const index = state.nhanvien.findIndex(
                    (item) => item.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.nhanvien[index] = action.payload.data;
                }
            });
    },
});

export default nhanVienSlice.reducer;
