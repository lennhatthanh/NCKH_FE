import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const dataThongBao = createAsyncThunk("thongbao/dataThongBao", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("https://68522b030594059b23cc7ea8.mockapi.io/api/thong-bao");
        return res;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
export const themThongBao = createAsyncThunk("thongbao/themThongBao", async (payload, { rejectWithValue }) => {
    try {
        const res = await api.post("https://68522b030594059b23cc7ea8.mockapi.io/api/thong-bao", payload);
        return res;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const capNhatThongBao = createAsyncThunk("thongbao/capNhatThongBao", async (payload, { rejectWithValue }) => {
    try {
        const res = await api.put(`https://68522b030594059b23cc7ea8.mockapi.io/api/thong-bao/${payload.id}`, payload);
        return res;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const xoaThongBao = createAsyncThunk("thongbao/xoaThongBao", async (payload, { rejectWithValue }) => {
    try {
        const res = await api.delete(`https://68522b030594059b23cc7ea8.mockapi.io/api/thong-bao/${payload}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
const thongBaoSlice = createSlice({
    name: "thongbao",
    initialState: {
        thongbao: [],
    },
    extraReducers: (builder) => {
        builder
            .addCase(dataThongBao.fulfilled, (state, action) => {
                state.thongbao = action.payload.data;
            })
            .addCase(themThongBao.fulfilled, (state, action) => {
                state.thongbao.push(action.payload.data);
            })
            .addCase(xoaThongBao.fulfilled, (state, action) => {
                state.thongbao = state.thongbao.filter((item) => item.id !== action.meta.arg);
            })
            .addCase(capNhatThongBao.fulfilled, (state, action) => {
                const index = state.thongbao.findIndex((item) => item.id === action.payload.data.id);
                if (index !== -1) {
                    state.thongbao[index] = action.payload.data;
                }
            });
    },
});

export default thongBaoSlice.reducer;
