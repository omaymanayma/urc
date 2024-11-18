import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userInfosSelector } from '../features/loginSlice';
import { getAllUser } from './listUsersApi';
import { CustomError } from '../model/CustomError';
import { UserInfos } from '../model/common';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import { useNavigate } from 'react-router-dom';
import { formatTimestamp } from '../model/common';
import { setList } from '../features/userlistSlice';
import { AppDispatch } from '../app/store';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';

interface GetUserProps {
  onUserClick: (id: number, name: string) => void; // Add this prop
}

const GetUser: React.FC<GetUserProps> = ({ onUserClick }) => {
  const navigate = useNavigate();
  const userInfos = useSelector(userInfosSelector);
  const [usersList, setUsersList] = useState<UserInfos[]>([]);
  const [error, setError] = useState({} as CustomError);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("loading userInfos...");
  }, [userInfos, dispatch]);

  useEffect(() => {
    getAllUser(
      userInfos.userId,
      (result: UserInfos[]) => {
        setError(new CustomError(""));
        setUsersList(result);
        dispatch(setList(result));
        setLoading(false);
      },
      (loginError: CustomError) => {
        console.log(loginError);
        setError(loginError);
        setLoading(false);
      }
    ); 
  }, [navigate, userInfos, dispatch]);

  const handleClick = (id: number, name: string) => {
    // Instead of navigate, use onUserClick from props
    onUserClick(id, name);
  };

  return (
    <Paper elevation={6} sx={{ padding: 4, maxWidth: 420, width: '100%', borderRadius: 2, backgroundColor: '#fff' }}>
      <Typography variant="h6" textAlign='center' sx={{ fontWeight: 'bold', color: '#f1226a' }}>Mes Contacts</Typography>
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : (
        <List>
          {usersList.length > 0 ? (
            usersList.map((user, index) => (
              <ListItemButton key={index} onClick={() => handleClick(user.userId, user.username)} sx={{ mb: 1 }}>
                <ListItemIcon><PersonPinOutlinedIcon sx={{ color: '#000' }} /></ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div" sx={{ color: '#000' }}>
                      {user.username}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="textSecondary">
                      {user.last_login && formatTimestamp(user.last_login)}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))
          ) : (
            <Typography variant="body2" textAlign='center' sx={{ color: '#000' }}>Aucun contact trouvé.</Typography>
          )}
        </List>
      )}
      {error.message && <Alert severity="error" sx={{ mt: 2 }}>{error.message}</Alert>}
    </Paper>
  );
};

export default GetUser;
