import {  createSlice, PayloadAction} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { RoomInfos } from '../model/common';

const initialState = {
     list : [] as RoomInfos[],
}

export const roomlistSlice = createSlice({
    name: 'roomlist',
    initialState,
    reducers: {
        setList : (state, action: PayloadAction<RoomInfos[]> ) =>{
            state.list=action.payload;
        }
    },
    
});

export const { setList} = roomlistSlice.actions;

export const roomListSelector = (state : RootState)=> state.roomlist.list;
export default roomlistSlice.reducer;
