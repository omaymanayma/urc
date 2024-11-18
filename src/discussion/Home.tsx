import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userInfosSelector, setLogout } from '../features/loginSlice';
import GetUser from './listUser';
import MessageList from './messages/getMessages';
import AddMessage from './messages/ajouterMessage';
import { CssBaseline, IconButton, Typography, Box, Drawer, List, Divider, ListItem, Paper } from '@mui/material'; // <-- Added Paper import
import { Logout } from '@mui/icons-material';
import { AppDispatch } from '../app/store';
import { messageReceiverSelector } from '../features/messageSlice';

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userInfos = useSelector(userInfosSelector);
    const receiver = useSelector(messageReceiverSelector);
    const [receiverId, setReceiverId] = useState<number | null>(null);
    const [receiverName, setReceiverName] = useState<string>('');
    const drawerWidth1 = 280;

    useEffect(() => {
        console.log(userInfos);
    }, [userInfos]);

    // Fonction de déconnexion
    const handleLogout = () => {
        dispatch(setLogout());
    };

    // Handle user click to open chat
    const handleUserClick = (id: number, name: string) => {
        setReceiverId(id);
        setReceiverName(name);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f0f0f0' }}>
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
                </Box>

                <Divider sx={{ bgcolor: 'rgba(0,0,0,0.2)' }} />

                <List>
                    <ListItem disablePadding>
                        <Box sx={{ padding: 2 }}>
                            <GetUser onUserClick={handleUserClick} />
                        </Box>
                    </ListItem>
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${drawerWidth1}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    backgroundColor: '#fff', // Blanc
                    borderRadius: '15px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
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

                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2, color: '#f1226a' }}>
                    Chat entre Petrolheads
                </Typography>

                <Divider sx={{ my: 3, bgcolor: 'rgba(0,0,0,0.2)' }} />

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {receiverId ? (
                        <Box sx={{ width: '100%', maxWidth: 800 }}>
                            
                            <Paper sx={{ p: 2, marginBottom: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                <MessageList receiverId={receiverId} receiverName={receiverName} />
                            </Paper>
                            <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                <AddMessage receiverId={receiverId} />
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
