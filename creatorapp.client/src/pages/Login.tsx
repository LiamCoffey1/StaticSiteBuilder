import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Tabs, Tab } from '@mui/material';
import { login, register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import usePageListStore from '../store/pageListStore';

export default function LoginPage() {
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const loadPages = usePageListStore(s => s.loadPages);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
         await login(email, password);
         await loadPages();
      } else {
        await register(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data || 'Authentication failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>CreatorApp</Typography>
        <Tabs value={mode} onChange={(_, v) => setMode(v)} sx={{ mb: 2 }}>
          <Tab value="login" label="Login" />
          <Tab value="register" label="Register" />
        </Tabs>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} sx={{ mb: 2 }} />
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <Button fullWidth type="submit" variant="contained">{mode === 'login' ? 'Login' : 'Register'}</Button>
        </form>
      </Paper>
    </Box>
  );
}
