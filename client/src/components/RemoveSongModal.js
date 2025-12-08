import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import WarningIcon from '@mui/icons-material/Warning';

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

export default function RemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);
    const { currentModal, songToRemove } = store;

    if (!songToRemove) return null;

    const handleClose = () => {
        store.hideModals();
    };

    const handleConfirm = async () => {
        try {
            const response = await fetch(`http://localhost:4000/store/songs/${songToRemove._id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            if (response.ok) {
                store.searchSongs(store.songSearch);
                handleClose();
            }
        } catch (error) {
            console.error("Error removing song:", error);
        }
    };

    return (
        <Modal
            open={currentModal === 'REMOVE_SONG'}
            onClose={handleClose}
            aria-labelledby="remove-song-modal"
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WarningIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                        Remove Song?
                    </Typography>
                </Box>
                
                <Typography sx={{ mt: 2 }}>
                    Are you sure you want to remove "{songToRemove.title}" by {songToRemove.artist} from the catalog?
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Doing so will remove it from all of your playlists.
                </Typography>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirm} 
                        variant="contained" 
                        color="error"
                    >
                        Remove Song
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}