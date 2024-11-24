import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userInfosSelector } from '../features/loginSlice';
import { getAllRoom } from './GroupChatListApi';
import { CustomError } from '../model/CustomError';
import { RoomInfos } from '../model/common';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import { useNavigate } from 'react-router-dom';
import { formatTimestamp } from '../model/common';
import { setList } from '../features/roomlistSlice'; // a revérifier
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
  onUserClick: (id: number, name: string, type:string) => void; // Add this prop
}

const GetRoom: React.FC<GetUserProps> = ({ onUserClick }) => {
  const navigate = useNavigate();
  const userInfos = useSelector(userInfosSelector);
  const [roomsList, setRoomsList] = useState<RoomInfos[]>([]);
  const [error, setError] = useState({} as CustomError);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("loading userInfos...");
  }, [userInfos, dispatch]);

  useEffect(() => {
    getAllRoom(
      userInfos.userId,
      (result: RoomInfos[]) => {
        setError(new CustomError(""));
        setRoomsList(result);
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
    onUserClick(id, name,'group');
    navigate(`/messages/room/${id}`)
  };

  return (
    <Paper elevation={6} sx={{ padding: 4, maxWidth: 420, width: '100%', borderRadius: 2, backgroundColor: '#fff' }}>
      <Typography variant="h6" textAlign='center' sx={{ fontWeight: 'bold', color: '#f1226a' }}>Mes Groupes</Typography>
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : (
        <List>
          {roomsList.length > 0 ? (
            roomsList.map((room, index) => (
              <ListItemButton key={index} onClick={() => handleClick(room.room_id, room.name)} sx={{ mb: 1 }}>
                <ListItemIcon><PersonPinOutlinedIcon sx={{ color: '#000' }} /></ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div" sx={{ color: '#000' }}>
                      {room.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="textSecondary">
                      {room.created_on && formatTimestamp(room.created_on)}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))
          ) : (
            <Typography variant="body2" textAlign='center' sx={{ color: '#000' }}>Aucun Groupe trouvé.</Typography>
          )}
        </List>
      )}
      {error.message && <Alert severity="error" sx={{ mt: 2 }}>{error.message}</Alert>}
    </Paper>
  );
};

export default GetRoom;
