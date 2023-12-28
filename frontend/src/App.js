import React, { useEffect } from 'react';
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import './App.css';
import { createStorage } from "./helper";


function Copyright(props) {
  return (
    <Typography className='footer' variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Budget App
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = React.useState('');
  const [errorControl, setErrorControl] = React.useState(false);
  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setErrorControl(false);
  };

  useEffect(()=>{
    if(location.state != null) {
      setMessage({ msg: location.state.message, status: 'success' });
      setErrorControl(true);
    }
  },[location.state])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let obj = {
      email: data.get('email'),
      password: data.get('password'),
    }
    await axios.post(
      'http://localhost:4000/api/user/login', obj
    )
      .then((response) => {
        if (response.status === 200) {
          createStorage('user', response.data);
          setMessage({ msg: response.data.message, status: 'success' });
          setErrorControl(true);
          navigate('/home');
        }
      })
      .catch(error => {
        setMessage({ msg: error.response.data.error, status: 'error' });
        setErrorControl(true);
        console.log(error)
      })
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <div>
            <h2 className='header-first'>Take Control of Your Money</h2>
            <p className='header-second'>Personal budgeting is the secret to financial freedom. Start your journey today.</p>
          </div>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgot" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      <Snackbar onClose={handleClose} autoHideDuration={3000}
        open={errorControl} >
        <Alert onClose={handleClose} severity={message.status} sx={{ width: '100%' }}>
          {message.msg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
