import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store';
import Copyright from './Copyright';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/masterial/CssBaseline';
import Typography from '@mui/material/Typography';

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
                <Typography compponent="h1" variant="h3" sx={{ mb: 3 }}>
                    Tha Playlister
                </Typography>

                <Box sx={{ width: '100%', mt: 1 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 2 }}
                        onClick={handleContinueGuest}
                    >
                        Continue as Guest
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 1, mb: 2, py: 2 }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 1, mb: 2, py: 2 }}
                        onClick={handleCreateAccount}
                    >
                        Create Account
                    </Button>
                </Box>

                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Box>
        </Container>
    );
}