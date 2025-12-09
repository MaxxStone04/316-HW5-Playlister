import { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AuthContext from '../auth'
import MUIErrorModal from './MUIErrorModal'
import Copyright from './Copyright'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ClearIcon from '@mui/icons-material/Clear';

export default function LoginScreen() {
    const { auth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Clear previous errors
        if (auth.errorMessage) {
            auth.clearError && auth.clearError();
        }
        setFormErrors({});
        
        // Basic frontend validation
        const errors = {};
        
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }
        
        if (!formData.password) {
            errors.password = 'Password is required';
        }
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        auth.loginUser(formData.email, formData.password);
    };

    const handleInputChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
        // Clear error for this field when user starts typing
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

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFE4', // Background color from diagram
            }}
        >
            <Container 
                component="main" 
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    width: '100%',
                    py: 8
                }}
            >
                <CssBaseline />
                
                {/* Lock Icon */}
                <Box sx={{ m: 2 }}>
                    <LockOutlinedIcon 
                        sx={{ 
                            fontSize: 48,
                            color: 'text.primary'
                        }} 
                    />
                </Box>
                
                {/* Sign In Title */}
                <Typography 
                    component="h1" 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 'bold',
                        mb: 6,
                        color: 'text.primary',
                        fontSize: { xs: '2rem', sm: '2.5rem' }
                    }}
                >
                    Sign In
                </Typography>
                
                <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    sx={{ 
                        width: '100%',
                        maxWidth: 500,
                        px: { xs: 2, sm: 0 }
                    }}
                >
                    {/* Email Field */}
                    <TextField
                        fullWidth
                        required
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        sx={{ 
                            mb: 4,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#E6E0E9',
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'black',
                                    borderWidth: 2
                                }
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '1.1rem'
                            },
                            '& .MuiOutlinedInput-input': {
                                fontSize: '1.1rem',
                                py: 1.5
                            }
                        }}
                        InputProps={{
                            endAdornment: formData.email && (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="clear email"
                                        onClick={handleClearField('email')}
                                        edge="end"
                                        size="medium"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    
                    {/* Password Field */}
                    <TextField
                        fullWidth
                        required
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        sx={{ 
                            mb: 5,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#E6E0E9',
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'black',
                                    borderWidth: 2
                                }
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '1.1rem'
                            },
                            '& .MuiOutlinedInput-input': {
                                fontSize: '1.1rem',
                                py: 1.5
                            }
                        }}
                        InputProps={{
                            endAdornment: formData.password && (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="clear password"
                                        onClick={handleClearField('password')}
                                        edge="end"
                                        size="medium"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    
                    {/* Sign In Button */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            py: 2,
                            mb: 4,
                            backgroundColor: 'black',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            borderRadius: 2,
                            height: 56,
                            '&:hover': {
                                backgroundColor: '#333333',
                                boxShadow: 3,
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        Sign In
                    </Button>
                    
                    {/* Sign Up Link - RED TEXT */}
                    <Box sx={{ textAlign: 'left', mb: 6 }}>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#FF0000', // Red color
                                fontWeight: 'medium',
                                fontSize: '1.1rem'
                            }}
                        >
                            Don't have an account?{' '}
                            <Link 
                                component={RouterLink}
                                to="/register/"
                                sx={{ 
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    color: '#FF0000', // Red color
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: '#CC0000'
                                    }
                                }}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                    
                    {/* Copyright */}
                    <Copyright sx={{ 
                        mt: 4, 
                        fontSize: '1rem',
                        color: 'text.secondary'
                    }} />
                </Box>
                
                {/* Error Modal */}
                {auth.errorMessage && <MUIErrorModal />}
            </Container>
        </Box>
    );
}