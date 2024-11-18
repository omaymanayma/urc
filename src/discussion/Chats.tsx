import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userInfosSelector, setLogout } from '../features/loginSlice';
import MessageList from './messages/getMessages';
import AddMessage from './messages/ajouterMessage';
import Box from '@mui/material/Box';
import { useParams, useNavigate } from 'react-router-dom';
import { CssBaseline, IconButton, Typography, Paper } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { AppDispatch } from '../app/store';

const Chats = () => {
    const { receiverId, receiverName } = useParams();
    const userInfos = useSelector(userInfosSelector);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(userInfos);
    }, [userInfos, receiverId]);

    // Fonction de déconnexion
    const handleLogout = () => {
        dispatch(setLogout());
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f0f0f0' }}>
            <CssBaseline />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    margin: '0 auto',
                    position: 'relative',
                    width: '80%',
                    maxWidth: 800,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                {/* Bouton de déconnexion en haut à droite */}
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: '#000',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#333' },
                    }}
                    onClick={handleLogout}
                >
                    <Logout />
                </IconButton>

                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2, color: '#f1226a', textAlign: 'center' }}>
                    Chat entre Petrolheads
                </Typography>

                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, color: '#00796b', textAlign: 'center' }}>
                    Conversation avec {receiverName}
                </Typography>

                <Paper sx={{ p: 2, marginBottom: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <MessageList receiverId={Number(receiverId)} receiverName={String(receiverName)} />
                </Paper>

                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <AddMessage receiverId={Number(receiverId)} />
                </Paper>
            </Box>
        </Box>
    );
};

export default Chats;
