
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Alert, Box, CircularProgress, Link } from '@mui/material';
import { createUser } from './signUpApi';
import { Account } from '../model/common';
import { CustomError } from "../model/CustomError";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [error, setError] = useState({} as CustomError);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const account: Account = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    setIsLoading(true);

    createUser(
      account,
      (result: boolean) => {
        if (result === true) {
          setFormData({ email: '', password: '', confirmPassword: '', username: '' });
          setError(new CustomError(""));
          setIsLoading(false);
          navigate('/login');
        } else {
          console.error("La création de l'utilisateur a échoué.");
          setIsLoading(false);
        }
      },
      (createAccountError: CustomError) => {
        setError(createAccountError);
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
          Petrolheads Community
        </Typography>
        <Typography variant="h5" sx={{ color: '#ffffff', mb: 4 }}>
          Create an Account
        </Typography>
        
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              name="username"
              label="Nom d'utilisateur"
              placeholder="Saisissez votre nom d'utilisateur"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              InputProps={{
                sx: { backgroundColor: 'rgba(255, 255, 255, 0.6)' }
              }}
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label="Email"
              placeholder="Saisissez votre email"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              InputProps={{
                sx: { backgroundColor: 'rgba(255, 255, 255, 0.6)' }
              }}
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              name="password"
              label="Mot de passe"
              type="password"
              placeholder="Saisissez votre mot de passe"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              InputProps={{
                sx: { backgroundColor: 'rgba(255, 255, 255, 0.6)' }
              }}
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              name="confirmPassword"
              label="Confirmez votre mot de passe"
              type="password"
              placeholder="Confirmez votre mot de passe"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              InputProps={{
                sx: { backgroundColor: 'rgba(255, 255, 255, 0.6)' }
              }}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, mb: 1, padding: 1, backgroundColor: '#000', color: '#fff', '&:hover': { backgroundColor: '#333' } }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>
            
            {error.message && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error.message}
              </Alert>
            )}
          </Box>

          <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Link href="/login" underline="hover" sx={{ fontWeight: 'bold', color: '#000' }}>
              Déjà un compte ? Se connecter
            </Link>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default SignUp;
