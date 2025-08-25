import { createSlice } from "@reduxjs/toolkit";
import api from '../../api/api';

const initial = { isAuthenticated:false, role:"guest", profile:null, token:null };

const slice = createSlice({
  name:"user",
  initialState: initial,
  reducers:{
    loginAs:(s,{payload})=>{
      s.isAuthenticated = true;
      s.role = payload.role;             
      s.profile = payload.profile || {name:"Guest"};
      s.token = payload.token || null;
    },
    logout:(s)=>Object.assign(s, initial),
  }
});

export const { loginAs, logout } = slice.actions;
export const selectIsAuthed = s => s.user.isAuthenticated;
export const selectRole     = s => s.user.role;
export default slice.reducer;
