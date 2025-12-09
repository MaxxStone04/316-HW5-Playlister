import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth';
import Copyright from './Copyright';
import SelectAvatarModal from './SelectAvatarModal';
import MUIErrorModal from './MUIErrorModal';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Avatar from '@mui/material/Avatar';

export default function EditAccountScreen() {
    const { auth } = useContext(AuthContext);
    const history = useHistory();
    
    const [formErrors, setFormErrors] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth.user) {
            setFormData({
                userName: auth.user.userName || '',
                email: auth.user.email || '',
                password: '',
                passwordConfirm: ''
            });
            setAvatar(auth.user.avatar || null);
        }
    }, [auth.user]);

    if (!auth.loggedIn) {
        history.push('/login');
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Frontend validation
        const errors = {};
        const { userName, password, passwordConfirm } = formData;
        
        if (!userName.trim()) {
            errors.userName = 'A username is required';
        }
        
        if (password && password.length < 8) {
            errors.password = 'The password must be at least 8 characters';
        }
        
        if (password && password !== passwordConfirm) {
            errors.passwordConfirm = 'These two Passwords do not match';
        }
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        setLoading(true);
        
        try {
            const updateData = {
                userName: userName
            };
            
            if (password) {
                updateData.password = password;
                updateData.passwordVerify = passwordConfirm;
            }
            
            if (avatar && avatar !== auth.user.avatar) {
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
            
            const data = await response.json();
            
            if (response.ok) {
                auth.getLoggedIn();
                history.push('/playlists');
            } else {
                setFormErrors({ submit: data.errorMessage || 'Failed to update account' });
            }
        } catch (error) {
            console.error("Error updating account:", error);
            setFormErrors({ submit: 'An error occurred while updating your account' });
        } finally {
            setLoading(false);
        }
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
    };

    const handleAvatarButtonClick = () => {
        setShowAvatarModal(true);
    };

    const handleClearAvatar = () => {
        setAvatar(null);
    };

    const handleCancel = () => {
        history.goBack();
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
                        Edit Account
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
                                                disabled={loading}
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
                                                    disabled={loading}
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
                                                disabled
                                                helperText="Email cannot be changed"
                                            />
                                        </Box>
                                        
                                        <Box sx={{ position: 'relative', mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                name="password"
                                                type="password"
                                                id="password"
                                                placeholder="New Password (leave blank to keep current)"
                                                value={formData.password}
                                                onChange={handleInputChange('password')}
                                                error={!!formErrors.password}
                                                disabled={loading}
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
                                                    disabled={loading}
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
                                                name="passwordConfirm"
                                                type="password"
                                                id="passwordConfirm"
                                                placeholder="Confirm New Password"
                                                value={formData.passwordConfirm}
                                                onChange={handleInputChange('passwordConfirm')}
                                                error={!!formErrors.passwordConfirm}
                                                disabled={loading}
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
                                                    disabled={loading}
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
                                        
                                        {formErrors.submit && (
                                            <Typography 
                                                variant="caption" 
                                                color="error" 
                                                sx={{ 
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    mb: 2
                                                }}
                                            >
                                                {formErrors.submit}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        type="button"
                                        fullWidth
                                        variant="outlined"
                                        onClick={handleCancel}
                                        disabled={loading}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            borderColor: '#666',
                                            color: '#666',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            '&:hover': {
                                                borderColor: '#333',
                                                color: '#333',
                                                bgcolor: 'rgba(0,0,0,0.04)'
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={loading || !formData.userName.trim()}
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
                                    >
                                        {loading ? 'Updating...' : 'Complete'}
                                    </Button>
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