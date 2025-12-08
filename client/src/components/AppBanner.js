import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const handleHome = () => {
        history.push('/');
    }

    const handlePlaylists = () => {
        history.push('/playlists');
    };

    const handleSongs = () => {
        history.push('/songs');
    };

    const handleEditAccount = () => {
        handleMenuClose();
        history.push('/edit-account');
    };

    const menuId = 'primary-search-account-menu';
    
    let menuItems;
    if (auth.loggedIn) {
        menuItems = [
            <MenuItem key="edit" onClick={handleEditAccount}>Edit Account</MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
        ];
    } else {
        menuItems = [
            <MenuItem key="login" onClick={handleMenuClose}>
                <Link to='/login/' style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    Login
                </Link>
            </MenuItem>,
            <MenuItem key="register" onClick={handleMenuClose}>
                <Link to='/register/' style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    Create Account
                </Link>
            </MenuItem>
        ];
    }

    const menu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {menuItems}
        </Menu>
    );

    const isPlaylistsActive = location.pathname === '/playlists' || location.pathname.includes('/playlist/');
    const isSongsActive = location.pathname === '/songs';

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        sx={{ mr: 2 }}
                        onClick={handleHome}
                    >
                        <HomeIcon />
                    </IconButton>

                    <Button
                        color="inherit"
                        onClick={handlePlaylists}
                        sx={{
                            mr: 2,
                            backgroundColor: isPlaylistsActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                            }
                        }}
                    >
                        Playlists
                    </Button>

                    <Button
                        color="inherit"
                        onClick={handleSongs}
                        sx={{
                            mr: 2,
                            backgroundColor: isSongsActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.2)'
                            }
                        }}
                    >
                        Songs Catalog
                    </Button>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        The Playlister
                    </Typography>

                    {store.currentList && (
                        <Box sx={{ mr: 2 }}>
                            <EditToolbar />
                        </Box>
                    )}

                    <Box>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            {auth.loggedIn ? (
                                auth.user?.avatar ? (
                                    <Avatar 
                                        src={auth.user.avatar} 
                                        sx={{ width: 32, height: 32 }}
                                    />
                                ) : (
                                    <AccountCircle />
                                )
                            ) : (
                                <AccountCircle />
                            )}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {menu}
        </Box>
    );
}