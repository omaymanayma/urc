import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userInfosSelector, setLogout } from '../features/loginSlice';
import GetUser from './listUser';
import GetRoom from './GroupChatList';
import MessageList from './messages/getMessages';
import AddMessage from './messages/ajouterMessage';
import { CssBaseline, IconButton, Typography, Box, Drawer, List, Divider, ListItem, Paper } from '@mui/material'; // <-- Added Paper import
import { Logout } from '@mui/icons-material';
import { AppDispatch } from '../app/store';
import { messageReceiverSelector } from '../features/messageSlice';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate=useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const userInfos = useSelector(userInfosSelector);
    const receiver = useSelector(messageReceiverSelector);
    const [receiverId, setReceiverId] = useState<number | null>(null);
    const [receiverName, setReceiverName] = useState<string>('');
    const [receiverType, setReceiverType] = useState<'user' | 'group' | null>(null);

    const drawerWidth1 = 280;

    useEffect(() => {
        console.log(userInfos);
    }, [userInfos]);

    // Fonction de déconnexion
    const handleLogout = () => {
        dispatch(setLogout());
        sessionStorage.clear();
        navigate("/");
        
    };

    // Mettre à jour handleUserClick pour gérer aussi le type de receiver
    const handleUserClick = (id: number, name: string, type: 'user' | 'group') => {
        setReceiverId(id);
        setReceiverName(name);
        setReceiverType(type); // Nouvel état pour le type de receiver
    };

    return (
        <Box sx={{ display: 'flex', height: '100hv', backgroundColor: '#f0f0f0' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth1,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth1,
                        boxSizing: 'border-box',
                        backgroundColor: '#fff', // Blanc
                        color: '#000', // Noir pour le texte
                        borderRadius: '0 15px 15px 0',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#f1226a', color: '#fff', borderRadius: '0 15px 0 0' }}>
                    <Typography variant="h6" noWrap>
                        UBO
                    </Typography>
                    <IconButton
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: '#000', // Noir
                        color: '#fff', // Blanc pour l'icône
                        '&:hover': { backgroundColor: '#333' },
                    }}
                    onClick={handleLogout}
                >
                    <Logout />
                </IconButton>
                </Box>

                <Divider sx={{ bgcolor: 'rgba(0,0,0,0.2)' }} />

                <List>
                    <ListItem disablePadding >
                        <Box sx={{ display:"flex", padding: 2, flexDirection:"column", gap:3 }}>
                            <GetUser onUserClick={(id, name) => handleUserClick(id, name, 'user')} />
                            <GetRoom onUserClick={(id, name) => handleUserClick(id, name, 'group')} />
                        </Box>
                    </ListItem>
                </List>
            </Drawer>

            <Box
                component="main"
                style={{height:"100vh"}}
                sx={{
                    width: `calc(100% - ${drawerWidth1}px)`,
                    maxHeight:'100%',
                    minHeight:"100%",
                    height:"100%",
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    backgroundColor: '#fff',
                    borderRadius: '15px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',  // Empêche le débordement du conteneur principal
                }}
            >
                

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto'}} style={{height:"100vh"}} >
                    {receiverId ? (
                        <Box sx={{ width: '100%', maxWidth: 800  }}>
                            <Paper sx={{ p: 2, marginBottom: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                <MessageList receiverId={receiverId} receiverName={receiverName} receiverType={receiverType} />
                                <AddMessage receiverId={receiverId} receiverType={receiverType} />
                            </Paper>
                              
                        </Box>
                    ) : (
                        <Typography>Pas encore de conversation sélectionnée.</Typography>
                    )}
                </Box>


            </Box>
        </Box>
    );
};

export default Home;
