import * as React from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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

import { createStorage } from "../helper";
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

const defaultTheme = createTheme();

function Signup() {
  const navigate = useNavigate();
  const [message, setMessage] = React.useState('');
  const [errorControl, setErrorControl] = React.useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const obj = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    };
    await axios.post(
      'http://localhost:4000/api/user/signup', obj
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
      })
  };
  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setErrorControl(false);
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
            Sign up
          </Typography>
          <h2 className='header-first'>Take Control of Your Money</h2>
          <p className='header-second'>Personal budgeting is the secret to financial freedom. Start your journey today.</p>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
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

export default Signup