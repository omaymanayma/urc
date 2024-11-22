import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './NotFound';
import {Login} from "../user/Login";
import SignUp from '../user/SignUp';
import Notifications from './Notifications';
import Home from '../discussion/Home';
import Chats from '../discussion/Chats';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../app/store";
import {useEffect} from "react";
import { setLogout, setToken, setUserInfos } from '../features/loginSlice';

const AppRouter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = sessionStorage.getItem('token');
  const tokenID = sessionStorage.getItem('id');
  const tokenUsernanme = sessionStorage.getItem('username');

  useEffect(() => {
    if (token && tokenID && tokenUsernanme &&token!=='') {
      dispatch(setToken(token)); 
      dispatch(setUserInfos({userId:Number(tokenID), username:tokenUsernanme}));
      console.log("token : " + tokenID);
    } else {
      dispatch(setLogout());

    }
  }, [token, dispatch]);


  return (
<Notifications>
<Router>

      <Routes>

        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/home/user/:receiverName/:receiverId" element={<Chats />} />

        <Route path="*" element={<NotFound />} />


      </Routes>

    </Router>

</Notifications>


  );


};

export default AppRouter;
