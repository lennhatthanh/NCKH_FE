import adminSlice from "../features/admin/adminSlice"
import nhanVienSlice from "../features/nhanvien/nhanVienSlice"
import nguoiDungSlice from "../features/nguoidung/nguoiDungSlice"
import cuuTroSlice from "../features/cuutro/cuuTroSlice"
import guiMailSlice from "../features/guimail/guiMailSlice"
import iotSlice from "../features/iot/iotSlice"
import thongBaoSlice from "../features/thongbao/thongBaoSlice"
import thongKeSlice from "../features/thongke/thongKeSlice"
import tramSoTanSlice from "../features/tramsotan/tramSoTanSlice"
import yeuCauSlice from "../features/tramsotan/tramSoTanSlice"
import { configureStore, combineReducers } from "@reduxjs/toolkit";
export const store = configureStore({
    reducer: {
      admin: adminSlice,
      nhanvien: nhanVienSlice,
      nguoidung: nguoiDungSlice,
      cuutro: cuuTroSlice,
      guimail: guiMailSlice,
      iot: iotSlice,
      thongbao: thongBaoSlice,
      thongke: thongKeSlice,
      tramsotan: tramSoTanSlice,
      yeucau: yeuCauSlice,
    },
});
