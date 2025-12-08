import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth';
import Copyright from './Copyright';
import SelectAvatarModal from './SelectAvatarModal';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function EditAccountScreen() {
    const { auth } = useContext(AuthContext);
    const history = useHistory();
    
    const [formData, setFormData] = useState({
        userName: auth.user?.userName || '',
        email: auth.user?.email || '',
        password: '',
        passwordConfirm: ''
    });
    
    const [errors, setErrors] = useState({});
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [avatar, setAvatar] = useState(auth.user?.avatar || '');

    if (!auth.loggedIn) {
        history.push('/login');
        return null;
    }

    const handleChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
        
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.userName.trim()) {
            newErrors.userName = 'Username is required';
        }
        
        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {

            const updateData = {
                userName: formData.userName
            };
            
            if (formData.password) {
                updateData.password = formData.password;
            }
            
            if (avatar) {
                updateData.avatar = avatar;
            }
            
            const response = await fetch('http://localhost:4000/auth/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData),
                credentials: 'include'
            });
            
            if (response.ok) {
                auth.getLoggedIn();
                history.push('/playlists');
            } else {
                const errorData = await response.json();
                setErrors({ submit: errorData.errorMessage });
            }
        } catch (error) {
            console.error("Error updating account:", error);
            setErrors({ submit: 'An error occurred while updating your account' });
        }
    };

    const handleAvatarSelect = (avatarData) => {
        setAvatar(avatarData);
        setShowAvatarModal(false);
    };

    const handleCancel = () => {
        history.goBack();
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Edit Account
                </Typography>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                            src={avatar}
                            sx={{ width: 100, height: 100, mb: 1 }}
                        />
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="span"
                            onClick={() => setShowAvatarModal(true)}
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                bgcolor: 'white',
                                '&:hover': { bgcolor: 'grey.100' }
                            }}
                        >
                            <PhotoCamera />
                        </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Click camera icon to change avatar
                    </Typography>
                </Box>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="User Name"
                        name="userName"
                        autoComplete="username"
                        value={formData.userName}
                        onChange={handleChange('userName')}
                        error={!!errors.userName}
                        helperText={errors.userName}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        disabled
                        helperText="Email cannot be changed"
                    />
                    
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="New Password (leave blank to keep current)"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange('password')}
                        error={!!errors.password}
                        helperText={errors.password || "At least 8 characters"}
                    />
                    
                    <TextField
                        margin="normal"
                        fullWidth
                        name="passwordConfirm"
                        label="Confirm New Password"
                        type="password"
                        id="passwordConfirm"
                        autoComplete="new-password"
                        value={formData.passwordConfirm}
                        onChange={handleChange('passwordConfirm')}
                        error={!!errors.passwordConfirm}
                        helperText={errors.passwordConfirm}
                    />
                    
                    {errors.submit && (
                        <Typography color="error" align="center" sx={{ mt: 2 }}>
                            {errors.submit}
                        </Typography>
                    )}
                    
                    <Box sx={{ mt: 3, mb: 2, display: 'flex', gap: 2 }}>
                        <Button
                            type="button"
                            fullWidth
                            variant="outlined"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                        >
                            Complete
                        </Button>
                    </Box>
                </Box>
                
                <Copyright sx={{ mt: 5 }} />
            </Box>
            
            {showAvatarModal && (
                <SelectAvatarModal
                    open={showAvatarModal}
                    onClose={() => setShowAvatarModal(false)}
                    onSelect={handleAvatarSelect}
                />
            )}
        </Container>
    );
}