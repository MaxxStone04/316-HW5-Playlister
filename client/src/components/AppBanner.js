import { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
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
        store.setGuestMode(false);
        history.push('/');
    }

    const handleHome = () => {
        history.push('/')
    }

    const handlePlaylists = () => {
        store.closeCurrentList();
        history.push('/playlists');
    };

    const handleSongs = () => {
        history.push('/songs');
    };

    const handleEditAccount = () => {
        handleMenuClose();
        history.push('/edit-account');
    };

    const handleLogin = () => {
        handleMenuClose();
        history.push('/login');
    };

    const handleCreateAccount = () => {
        handleMenuClose();
        history.push('/register');
    };

    const menuId = 'primary-search-account-menu';
    
    let menuItems;
    if (auth.loggedIn) {
        menuItems = [
            <MenuItem key="edit" onClick={handleEditAccount}>Edit Account</MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
        ];
    } else {
        // Both guest and not logged in see the same menu
        menuItems = [
            <MenuItem key="login" onClick={handleLogin}>Login</MenuItem>,
            <MenuItem key="register" onClick={handleCreateAccount}>Create Account</MenuItem>
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
    const isWelcomeScreen = location.pathname === '/';

    // According to diagrams, on Welcome/Create/Login screens, only Home button and Account button show
    // On Playlists/Songs screens, Home, Playlists, Songs Catalog buttons show, plus title in middle
    const showNavigationButtons = !isWelcomeScreen && 
                                  location.pathname !== '/login' && 
                                  location.pathname !== '/register' && 
                                  location.pathname !== '/edit-account';

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar 
                position="static" 
                sx={{ 
                    bgcolor: '#EE06FF',
                    height: 64
                }}
            >
                <Toolbar sx={{ minHeight: 64 }}>
                    {/* Always show Home button on left */}
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

                    {/* Navigation Buttons and Title (only on main screens) */}
                    {showNavigationButtons ? (
                        <>
                            <Button
                                color="inherit"
                                onClick={handlePlaylists}
                                sx={{
                                    mr: 2,
                                    backgroundColor: isPlaylistsActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.3)'
                                    },
                                    fontWeight: isPlaylistsActive ? 'bold' : 'normal'
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
                                    },
                                    fontWeight: isSongsActive ? 'bold' : 'normal'
                                }}
                            >
                                Song Catalog
                            </Button>

                            {/* Title centered - using flexbox to center */}
                            <Box sx={{ 
                                flexGrow: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                pointerEvents: 'none' // Allows clicks to pass through to buttons
                            }}>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="div"
                                    sx={{ 
                                        fontWeight: 'bold'
                                    }}
                                >
                                    The Playlister
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        // On Welcome/Login/Register screens, center the title
                        <Box sx={{ 
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            pointerEvents: 'none'
                        }}>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ 
                                    fontWeight: 'bold'
                                }}
                            >
                                The Playlister
                            </Typography>
                        </Box>
                    )}

                    {/* Edit Toolbar (only when editing a playlist in workspace) */}
                    {store.currentList && location.pathname.includes('/playlist/') && (
                        <Box sx={{ mr: 2 }}>
                            <EditToolbar />
                        </Box>
                    )}

                    {/* Spacer to push everything to the right except avatar */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* User Menu Icon - ALL THE WAY ON THE RIGHT */}
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                        sx={{ 
                            marginLeft: 'auto', // This pushes it to the right
                            ml: 0 // Remove any left margin
                        }}
                    >
                        {auth.loggedIn ? (
                            auth.user?.avatar ? (
                                <Avatar 
                                    src={auth.user.avatar} 
                                    sx={{ width: 32, height: 32 }}
                                />
                            ) : (
                                // If logged in but no avatar, show initials or generic
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                    {auth.user?.userName?.charAt(0) || 'U'}
                                </Avatar>
                            )
                        ) : (
                            // Not logged in (guest or on welcome screen) - show lock icon per diagrams
                            <AccountCircle />
                        )}
                    </IconButton>
                </Toolbar>
            </AppBar>
            {menu}
        </Box>
    );
}