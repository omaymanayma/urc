import {  createSlice, PayloadAction} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { UserInfos } from '../model/common';

const initialState = {
     list : [] as UserInfos[],
}

export const userlistSlice = createSlice({
    name: 'userlist',
    initialState,
    reducers: {
        setList : (state, action: PayloadAction<UserInfos[]> ) =>{
            state.list=action.payload;
        }
    },
    
});

export const { setList} = userlistSlice.actions;

export const userListSelector = (state : RootState)=> state.userlist.list;
export const fetFilteredUsers = (state : { user: RootState }, userId : string) => state.user.userlist.list.filter(user => user.userId !== parseInt(userId));
export default userlistSlice.reducer;
