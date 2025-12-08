import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

export default function WelcomeScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    const handleContinueGuest = () => {
        store.setGuestMode(true);
        auth.setGuestMode();
        history.push('/playlists');
    };

    const handleLogin = () => {
        store.setGuestMode(false);
        history.push('/login');
    };

    const handleCreateAccount = () => {
        store.setGuestMode(false);
        history.push('/register');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#FFFFE4', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
        }}>
            <Typography 
                variant="h1" 
                sx={{
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    color: '#333',
                    mb: 2,
                    textAlign: 'center'
                }}
            >
                The Playlister
            </Typography>

            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 8,
                opacity: 0.8 
            }}>
                <QueueMusicIcon sx={{ 
                    fontSize: 150, 
                    color: '#000000',
                    transform: 'rotate(180deg)'
                }} />
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    ml: 2,
                    transform: 'rotate(180deg)'
                }}>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8, 
                width: '80%',
                maxWidth: 800,
                mb: 4
            }}>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#000000',
                        color: 'white',
                        px: 6,
                        py: 2,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                    }}
                    onClick={handleContinueGuest}
                >
                    Continue as Guest
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#000000',
                        color: 'white',
                        px: 6,
                        py: 2,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                    }}
                    onClick={handleLogin}
                >
                    Login
                </Button>


                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#000000',
                        color: 'white',
                        px: 6,
                        py: 2,
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        borderRadius: 2,
                    }}
                    onClick={handleCreateAccount}
                >
                    Create Account
                </Button>
            </Box>
        </Box>
    );
}