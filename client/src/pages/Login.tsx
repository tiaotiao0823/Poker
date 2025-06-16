import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Tab,
  Tabs,
} from '@mui/material';
import { auth } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await auth.login(username, password);
      localStorage.setItem('token', response.token);
      navigate('/lobby');
    } catch (err: any) {
      setError(err.response?.data?.message || '登入失敗');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await auth.register(username, password);
      localStorage.setItem('token', response.token);
      navigate('/lobby');
    } catch (err: any) {
      setError(err.response?.data?.message || '註冊失敗');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="登入" />
            <Tab label="註冊" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleLogin}>
            <Typography variant="h5" component="h1" gutterBottom>
              登入
            </Typography>
            <TextField
              fullWidth
              label="用戶名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="密碼"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              登入
            </Button>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleRegister}>
            <Typography variant="h5" component="h1" gutterBottom>
              註冊
            </Typography>
            <TextField
              fullWidth
              label="用戶名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="密碼"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              註冊
            </Button>
          </form>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Login; 