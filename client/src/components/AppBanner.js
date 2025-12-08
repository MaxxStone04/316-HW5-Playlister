import { useContext, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom'
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
    const history = useHistory();
    const location = useLocation();

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
    } else if (store.isGuestMode) {
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
            PaperProps={{
                sx: {
                    mt: 1.5,
                    minWidth: 180
                }
            }}
        >
            {menuItems}
        </Menu>
    );

    const isPlaylistsActive = location.pathname === '/playlists' || location.pathname.includes('/playlist/');
    const isSongsActive = location.pathname === '/songs';
    const isWelcomeScreen = location.pathname === '/';

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: '#EE06FF' }}>
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

                    <Box sx={{ 
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: isWelcomeScreen ? 'flex-end' : 'center'
                    }}>
                        {isWelcomeScreen ? (
                            <Box />
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexGrow: 1
                            }}>
                                <Button
                                    color="inherit"
                                    onClick={handlePlaylists}
                                    sx={{
                                        mr: 2,
                                        backgroundColor: isPlaylistsActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.3)'
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
                                        backgroundColor: isSongsActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.3)'
                                        }
                                    }}
                                >
                                    Song Catalog
                                </Button>

                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ 
                                        display: { xs: 'none', md: 'block' },
                                        fontWeight: 'bold',
                                        ml: 4
                                    }}
                                >
                                    The Playlister
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 'auto' 
                    }}>
                        {store.currentList && (
                            <Box sx={{ mr: 2 }}>
                                <EditToolbar />
                            </Box>
                        )}

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