import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { getStorage, capitalize, clearStorage } from '../helper';


export default function Navbar() {

    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    const getData = () => {
        setUser(JSON.parse(getStorage('user')));
    }
    useEffect(() => {
        getData();
    }, [location]);

    const logout = () => {
        clearStorage();
        navigate('/');
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Tooltip title={location.pathname !== '/home' ? 'Click on this to see the dashboard' : ''}>
                        <DashboardIcon
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => { navigate('/home') }}
                            className='pointer'
                        >
                            <MenuIcon />
                        </DashboardIcon>
                    </Tooltip>
                    <Typography variant="h6" component="div" color="inherit" sx={{ flexGrow: 1 }}>
                        <Tooltip title={location.pathname !== '/home' ? 'Click on this to see the dashboard' : ''}>
                            <span onClick={() => { navigate('/home') }} className='pointer title1'>Manage Your Budgets</span>
                        </Tooltip>
                        <Typography className='navbar-welcome' variant="span" component="span">
                            Welcome
                        </Typography>
                        <Tooltip title={location.pathname !== '/home/profile' ? 'Click on this to see your expense reports' : ''}>
                            <Typography className=' pointer' variant="span" component="span" onClick={() => { navigate('profile') }}>
                                <span className='navbar-name'> {user ? `${capitalize(user.name)} ` : ''}</span>
                            </Typography>
                        </Tooltip>
                    </Typography>

                    <Tooltip title="Logout">
                        <IconButton color="inherit" aria-label="add an alarm" onClick={logout}>
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </Box>
    );
}