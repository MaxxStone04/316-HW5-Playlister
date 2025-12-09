import { useContext, useState } from 'react';
import AuthContext from '../auth';
import MUIErrorModal from './MUIErrorModal';
import Copyright from './Copyright';
import SelectAvatarModal from './SelectAvatarModal';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Avatar from '@mui/material/Avatar';

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);
    const [formErrors, setFormErrors] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const errors = {};
        const { userName, email, password, passwordConfirm } = formData;
        
        if (!userName.trim()) {
            errors.userName = 'A username is required';
        }
        
        if (!email.trim()) {
            errors.email = 'An email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Invalid email format';
        }
        
        if (!password) {
            errors.password = 'A password is required';
        } else if (password.length < 8) {
            errors.password = 'The password must be at least 8 characters';
        }
        
        if (!passwordConfirm) {
            errors.passwordConfirm = 'Please confirm your password';
        } else if (password !== passwordConfirm) {
            errors.passwordConfirm = 'These two Passwords do not match';
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
            passwordConfirm,
            avatar
        );
    };

    const handleInputChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
        
        if (formErrors[field]) {
            setFormErrors({
                ...formErrors,
                [field]: ''
            });
        }
    };

    const handleClearField = (field) => () => {
        setFormData({
            ...formData,
            [field]: ''
        });
        
        if (formErrors[field]) {
            setFormErrors({
                ...formErrors,
                [field]: ''
            });
        }
    };

    const handleAvatarSelect = (avatarData) => {
        setAvatar(avatarData);
        setShowAvatarModal(false);
        if (formErrors.avatar) {
            setFormErrors({...formErrors, avatar: ''});
        }
    };

    const handleAvatarButtonClick = () => {
        setShowAvatarModal(true);
    };

    const handleClearAvatar = () => {
        setAvatar(null);
        setFormErrors({...formErrors, avatar: 'Please select an avatar'});
    };

    let modalJSX = "";
    if (auth.errorMessage !== null){
        modalJSX = <MUIErrorModal />;
    }

    return (
        <Box sx={{ 
            bgcolor: '#FFFFE4', 
            minHeight: '100vh',
            pt: 8
        }}>
            <CssBaseline />
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ m: 2 }}>
                        <LockOutlinedIcon 
                            sx={{ 
                                fontSize: 48,
                                color: 'text.primary'
                            }} 
                        />
                    </Box>
                    
                    <Typography 
                        component="h1" 
                        variant="h4" 
                        sx={{ 
                            mb: 5,
                            fontWeight: 'bold',
                            color: 'text.primary'
                        }}
                    >
                        Create Account
                    </Typography>
                    
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        width: 120,
                                        pt: 1 
                                    }}>
                                        {avatar ? (
                                            <>
                                                <Avatar
                                                    src={avatar}
                                                    sx={{ 
                                                        width: 80, 
                                                        height: 80,
                                                        mb: 1.5,
                                                        border: '2px solid #E6E0E9',
                                                        bgcolor: 'white'
                                                    }}
                                                />
                                                <Button 
                                                    size="small" 
                                                    variant="outlined"
                                                    sx={{ 
                                                        fontSize: '0.75rem',
                                                        color: '#666',
                                                        borderColor: '#666',
                                                        borderRadius: 1,
                                                        px: 2,
                                                        py: 0.5,
                                                    }}
                                                    onClick={handleClearAvatar}
                                                >
                                                    Clear
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Avatar
                                                    sx={{ 
                                                        width: 80, 
                                                        height: 80,
                                                        mb: 1.5,
                                                        bgcolor: 'grey.300',
                                                        border: '2px dashed #E6E0E9'
                                                    }}
                                                >
                                                    ?
                                                </Avatar>
                                                <Button 
                                                    size="small" 
                                                    variant="contained"
                                                    sx={{ 
                                                        fontSize: '0.75rem',
                                                        bgcolor: '#666',
                                                        borderRadius: 1,
                                                        px: 2,
                                                        py: 0.5,
                                                        '&:hover': {
                                                            bgcolor: '#333'
                                                        }
                                                    }}
                                                    onClick={handleAvatarButtonClick}
                                                >
                                                    Select
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                    
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ position: 'relative', mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                id="userName"
                                                name="userName"
                                                placeholder="User Name"
                                                value={formData.userName}
                                                onChange={handleInputChange('userName')}
                                                error={!!formErrors.userName}
                                            />
                                            {formData.userName && (
                                                <IconButton
                                                    size="small"
                                                    onClick={handleClearField('userName')}
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 8,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: '#666'
                                                    }}
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            {formErrors.userName && (
                                                <Typography 
                                                    variant="caption" 
                                                    color="error" 
                                                    sx={{ 
                                                        display: 'block',
                                                        mt: 0.5,
                                                        ml: 1
                                                    }}
                                                >
                                                    {formErrors.userName}
                                                </Typography>
                                            )}
                                        </Box>
                                        
                                        <Box sx={{ position: 'relative', mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                id="email"
                                                name="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleInputChange('email')}
                                                error={!!formErrors.email}
                                            />
                                            {formData.email && (
                                                <IconButton
                                                    size="small"
                                                    onClick={handleClearField('email')}
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 8,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: '#666'
                                                    }}
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            {formErrors.email && (
                                                <Typography 
                                                    variant="caption" 
                                                    color="error" 
                                                    sx={{ 
                                                        display: 'block',
                                                        mt: 0.5,
                                                        ml: 1
                                                    }}
                                                >
                                                    {formErrors.email}
                                                </Typography>
                                            )}
                                        </Box>
                                        
                                        <Box sx={{ position: 'relative', mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                name="password"
                                                type="password"
                                                id="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleInputChange('password')}
                                                error={!!formErrors.password}
                                            />
                                            {formData.password && (
                                                <IconButton
                                                    size="small"
                                                    onClick={handleClearField('password')}
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 8,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: '#666'
                                                    }}
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            {formErrors.password && (
                                                <Typography 
                                                    variant="caption" 
                                                    color="error" 
                                                    sx={{ 
                                                        display: 'block',
                                                        mt: 0.5,
                                                        ml: 1
                                                    }}
                                                >
                                                    {formErrors.password}
                                                </Typography>
                                            )}
                                        </Box>
                                        
                                        <Box sx={{ position: 'relative', mb: 4 }}>
                                            <TextField
                                                fullWidth
                                                required
                                                name="passwordConfirm"
                                                type="password"
                                                id="passwordConfirm"
                                                placeholder="Password Confirm"
                                                value={formData.passwordConfirm}
                                                onChange={handleInputChange('passwordConfirm')}
                                                error={!!formErrors.passwordConfirm}
                                            />
                                            {formData.passwordConfirm && (
                                                <IconButton
                                                    size="small"
                                                    onClick={handleClearField('passwordConfirm')}
                                                    sx={{
                                                        position: 'absolute',
                                                        right: 8,
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: '#666'
                                                    }}
                                                >
                                                    <ClearIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            {formErrors.passwordConfirm && (
                                                <Typography 
                                                    variant="caption" 
                                                    color="error" 
                                                    sx={{ 
                                                        display: 'block',
                                                        mt: 0.5,
                                                        ml: 1
                                                    }}
                                                >
                                                    {formErrors.passwordConfirm}
                                                </Typography>
                                            )}
                                        </Box>
                                        
                                        {formErrors.avatar && (
                                            <Typography 
                                                variant="caption" 
                                                color="error" 
                                                sx={{ 
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    mb: 2
                                                }}
                                            >
                                                {formErrors.avatar}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        bgcolor: 'black',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        '&:disabled': {
                                            bgcolor: '#666',
                                            color: '#999'
                                        }
                                    }}
                                    disabled={!avatar}
                                >
                                    Create Account
                                </Button>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'flex-end',
                                    mt: 1
                                }}>
                                    <Link 
                                        href="/login/" 
                                        variant="body2"
                                        sx={{ 
                                            color: '#FC2020',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Already have an account? Sign in
                                    </Link>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    
                    <Box sx={{ mt: 6, mb: 4, width: '100%' }}>
                        <Copyright />
                    </Box>
                </Box>
            </Container>
            
            {modalJSX}
            
            {showAvatarModal && (
                <SelectAvatarModal
                    open={showAvatarModal}
                    onClose={() => setShowAvatarModal(false)}
                    onSelect={handleAvatarSelect}
                />
            )}
        </Box>
    );
}