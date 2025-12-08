import { useContext, useState } from 'react';
import AuthContext from '../auth'
import MUIErrorModal from './MUIErrorModal'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);
    const [formErrors, setFormErrors] = useState({});
    const [avatar, setAvatar] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        // Frontend validation
        const errors = {};
        const userName = formData.get('userName');
        const email = formData.get('email');
        const password = formData.get('password');
        const passwordVerify = formData.get('passwordVerify');
        
        if (!userName.trim()) {
            errors.userName = 'A username is required';
        }
        
        if (!email.trim()) {
            errors.email = 'An email is required';
        }
        
        if (!password) {
            errors.password = 'A password is required';
        } else if (password.length < 8) {
            errors.password = 'The password must be at least 8 characters';
        }
        
        if (!passwordVerify) {
            errors.passwordVerify = 'Please confirm your password';
        } else if (password !== passwordVerify) {
            errors.passwordVerify = 'These two passwords do not match';
        }
        
        if (!avatar) {
            errors.avatar = 'Please select an avatar';
        }
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        auth.registerUser(
            userName,
            email,
            password,
            passwordVerify,
            avatar
        );
    };

    const handleAvatarSelect = (avatarData) => {
        setAvatar(avatarData);
        if (formErrors.avatar) {
            setFormErrors({...formErrors, avatar: ''});
        }
    };

    let modalJSX = "";
    if (auth.errorMessage !== null){
        modalJSX = <MUIErrorModal />;
    }

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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="username"
                                name="userName"
                                required
                                fullWidth
                                id="userName"
                                label="User Name"
                                error={!!formErrors.userName}
                                helperText={formErrors.userName}
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
                                error={!!formErrors.email}
                                helperText={formErrors.email}
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
                                error={!!formErrors.password}
                                helperText={formErrors.password || "Minimum 8 characters"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="passwordVerify"
                                label="Confirm Password"
                                type="password"
                                id="passwordVerify"
                                autoComplete="new-password"
                                error={!!formErrors.passwordVerify}
                                helperText={formErrors.passwordVerify}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Avatar: 
                                </Typography>
                                {avatar ? (
                                    <Avatar 
                                        src={avatar} 
                                        sx={{ width: 40, height: 40, ml: 2 }}
                                    />
                                ) : (
                                    <Avatar 
                                        sx={{ width: 40, height: 40, ml: 2, bgcolor: 'grey.400' }}
                                    >
                                        ?
                                    </Avatar>
                                )}
                                <Button 
                                    size="small" 
                                    sx={{ ml: 2 }}
                                    onClick={() => {
                                        // We'll handle this with the modal
                                        // For now, just show a message
                                        alert("Avatar selection will be implemented with the modal");
                                    }}
                                >
                                    Select Avatar
                                </Button>
                            </Box>
                            {formErrors.avatar && (
                                <Typography color="error" variant="caption">
                                    {formErrors.avatar}
                                </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                                Image must be 100x100 pixels
                            </Typography>
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
                            <Link href="/login/" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
            { modalJSX }
        </Container>
    );
}