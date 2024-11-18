import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, CircularProgress, Box, Alert, Link } from '@mui/material';
import { loginUser } from "./loginApi";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { setUserInfos } from "../features/loginSlice";
import { CustomError } from "../model/CustomError";
import { Session, UserInfos } from "../model/common";

export function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [error, setError] = useState({} as CustomError);
    const [session, setSession] = useState({} as Session);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        setIsLoading(true);

        loginUser(
            { user_id: -1, username: data.get('login') as string, password: data.get('password') as string },
            (result: Session) => {
                setSession(result);
                form.reset();
                setError(new CustomError(""));
                const userInfosData = { username: result.username, userId: result.id } as UserInfos;
                dispatch(setUserInfos(userInfosData));
                navigate('/home');
            },
            (loginError: CustomError) => {
                setError(loginError);
                setSession({} as Session);
                setIsLoading(false);
            }
        );
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                backgroundImage: 'url(/images/porsche-gt3rs2.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: 2,
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(102, 102, 102, 0.7)',
                    padding: 4,
                    borderRadius: 2,
                    maxWidth: 420,
                    width: '100%',
                    textAlign: 'center',
                    marginLeft: '5%',
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ffffff', mb: 2 }}>
                    UBO Petrolheads Community
                </Typography>
                <Typography variant="h5" sx={{ color: '#ffffff', mb: 4 }}>
                    Welcome Back!
                </Typography>
                
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            name="login"
                            label="Username"
                            placeholder="Enter your username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            InputProps={{
                                sx: { backgroundColor: 'rgba(255, 255, 255, 0.6)' }
                            }}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            InputProps={{
                                sx: { backgroundColor: 'rgba(255, 255, 255, 0.6)' }
                            }}
                        />
                        
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2, mb: 1, padding: 1, backgroundColor: '#000', color: '#fff', '&:hover': { backgroundColor: '#333' } }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                        </Button>
                        
                        {error.message && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error.message}
                            </Alert>
                        )}
                    </Box>

                    <Grid container justifyContent="center" sx={{ mt: 3 }}>
                        <Link href="/signup" underline="hover" sx={{ fontWeight: 'bold', color: '#000' }}>
                            Create an Account
                        </Link>
                    </Grid>

                    {session.token && (
                        <Typography variant="body2" align="center" sx={{ mt: 2, color: '#555' }}>
                            Logged in as <strong>{session.username}</strong>
                        </Typography>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
