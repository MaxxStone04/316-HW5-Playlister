import { useState, useContext } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function NewSongModal({ open, onClose, onSongAdded }) {
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        year: new Date().getFullYear(),
        youTubeId: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (!formData.artist.trim()) {
            newErrors.artist = 'Artist is required';
        }
        
        if (!formData.year) {
            newErrors.year = 'Year is required';
        } else if (formData.year < 1900 || formData.year > new Date().getFullYear()) {
            newErrors.year = 'Please enter a valid year';
        }
        
        if (!formData.youTubeId.trim()) {
            newErrors.youTubeId = 'YouTube ID is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:4000/store/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log("Song added successfully:", data.song);
                
                setFormData({
                    title: '',
                    artist: '',
                    year: new Date().getFullYear(),
                    youTubeId: ''
                });
                
                onSongAdded();
            } else {
                const errorData = await response.json();
                setErrors({ submit: errorData.errorMessage || 'Failed to add song' });
            }
        } catch (error) {
            console.error("Error adding song:", error);
            setErrors({ submit: 'An error occurred while adding the song' });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            artist: '',
            year: new Date().getFullYear(),
            youTubeId: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="new-song-modal"
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" component="h2">
                        Add New Song
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Song Title *"
                        fullWidth
                        margin="normal"
                        value={formData.title}
                        onChange={handleChange('title')}
                        error={!!errors.title}
                        helperText={errors.title}
                        disabled={loading}
                    />
                    
                    <TextField
                        label="Artist *"
                        fullWidth
                        margin="normal"
                        value={formData.artist}
                        onChange={handleChange('artist')}
                        error={!!errors.artist}
                        helperText={errors.artist}
                        disabled={loading}
                    />
                    
                    <TextField
                        label="Year *"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={formData.year}
                        onChange={handleChange('year')}
                        error={!!errors.year}
                        helperText={errors.year}
                        disabled={loading}
                    />
                    
                    <TextField
                        label="YouTube ID *"
                        fullWidth
                        margin="normal"
                        value={formData.youTubeId}
                        onChange={handleChange('youTubeId')}
                        error={!!errors.youTubeId}
                        helperText={errors.youTubeId || "The ID after v= in YouTube URL"}
                        disabled={loading}
                    />
                    
                    {errors.submit && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {errors.submit}
                        </Typography>
                    )}
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Song'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
}