import { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxHeight: '80vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'auto',
};

const defaultAvatars = [
    'https://mui.com/static/images/avatar/1.jpg',
    'https://mui.com/static/images/avatar/2.jpg',
    'https://mui.com/static/images/avatar/3.jpg',
    'https://mui.com/static/images/avatar/4.jpg',
    'https://mui.com/static/images/avatar/5.jpg',
    'https://mui.com/static/images/avatar/6.jpg',
    'https://mui.com/static/images/avatar/7.jpg',
    'https://mui.com/static/images/avatar/8.jpg',
    'https://mui.com/static/images/avatar/9.jpg',
];

export default function SelectAvatarModal({ open, onClose, onSelect }) {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [error, setError] = useState('');

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxFiles: 1,
        maxSize: 5242880, 
        onDrop: (acceptedFiles, fileRejections) => {
            if (fileRejections.length > 0) {
                const error = fileRejections[0].errors[0];
                if (error.code === 'file-too-large') {
                    setError('File is too large (max 5MB)');
                } else if (error.code === 'file-invalid-type') {
                    setError('Invalid file type. Please use JPG, PNG, or GIF.');
                }
                return;
            }

            const file = acceptedFiles[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    if (img.width !== 100 || img.height !== 100) {
                        setError('Image must be exactly 100x100 pixels');
                        return;
                    }
                    setUploadedImage(e.target.result);
                    setSelectedAvatar(e.target.result);
                    setError('');
                };
                img.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });

    const handleAvatarClick = (avatar) => {
        setSelectedAvatar(avatar);
        setUploadedImage(null);
        setError('');
    };

    const handleConfirm = () => {
        if (selectedAvatar) {
            onSelect(selectedAvatar);
        }
    };

    const handleClearUpload = () => {
        setUploadedImage(null);
        setSelectedAvatar(null);
        setError('');
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="select-avatar-modal"
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" component="h2">
                        Select Avatar
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Upload Custom Avatar
                    </Typography>
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed #ccc',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: 'grey.50',
                            '&:hover': {
                                backgroundColor: 'grey.100'
                            }
                        }}
                    >
                        <input {...getInputProps()} />
                        <Typography>
                            Drag & drop an image here, or click to select
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Must be 100x100 pixels, max 5MB
                        </Typography>
                    </Box>
                    
                    {uploadedImage && (
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Avatar
                                src={uploadedImage}
                                sx={{ width: 100, height: 100, mr: 2 }}
                            />
                            <Button size="small" onClick={handleClearUpload}>
                                Clear
                            </Button>
                        </Box>
                    )}
                    
                    {error && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                    Or choose a default avatar:
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {defaultAvatars.map((avatar, index) => (
                        <Grid item xs={4} sm={3} key={index}>
                            <Avatar
                                src={avatar}
                                sx={{ 
                                    width: 80, 
                                    height: 80, 
                                    cursor: 'pointer',
                                    border: selectedAvatar === avatar ? 3 : 0,
                                    borderColor: 'primary.main',
                                    margin: '0 auto'
                                }}
                                onClick={() => handleAvatarClick(avatar)}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleConfirm}
                        disabled={!selectedAvatar}
                    >
                        Select Avatar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}