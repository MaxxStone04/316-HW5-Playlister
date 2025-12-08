import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useHistory } from 'react-router-dom';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 800,
    maxHeight: '80vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'auto',
};

export default function EditPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const { editPlaylistData } = store;
    const history = useHistory();

    const [playlistName, setPlaylistName] = useState('');
    const [originalName, setOriginalName] = useState('');

    useEffect(() => {
        if (editPlaylistData) {
            setPlaylistName(editPlaylistData.name);
            setOriginalName(editPlaylistData.name);

            if (store.tps) {
                store.tps.clearAllTransactions();
            }
        }
    }, [editPlaylistData, store.tps]);

    if (!editPlaylistData) return null;

    const handleClose = () => {
        store.closeEditModal();
    };

    const handleSave = async () => {
        if (playlistName !== originalName) {
            await store.addEditPlaylistNameTransaction(editPlaylistData._id, originalName, playlistName);
        }
        handleClose();
    };

    const handleAddSong = () => {
        store.setAddingToPlaylist(editPlaylistData._id);
        handleClose();
        history.push('/songs');
    };

    const handleEditSong = (index) => {
        const song = editPlaylistData.songs[index];
        store.showEditSongModal(index, song);
    };

    const handleDuplicateSong = async (index) => {
        const song = { ...editPlaylistData.songs[index] };
        store.addDuplicateSongTransaction(editPlaylistData._id, song, index + 1);
    };

    const handleDeleteSong = async (index) => {
        const song = editPlaylistData.songs[index];
        store.addRemoveSongFromPlaylistTransaction(editPlaylistData._id, song, index);
    };

    const handleUndo = () => {
        store.undo();
    };

    const handleRedo = () => {
        store.redo();
    };

    const canUndo = store.tps && store.tps.hasTransactionToUndo();
    const canRedo = store.tps && store.tps.hasTransactionToDo();

    return (
        <Modal
            open={store.currentModal === 'EDIT_PLAYLIST'}
            onClose={handleClose}
            aria-labelledby="edit-playlist-modal"
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2">
                        Edit Playlist
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <TextField
                        label="Playlist Name"
                        fullWidth
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        variant="outlined"
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddSong}
                    >
                        Add Song
                    </Button>
                </Box>

                <List>
                    {editPlaylistData.songs && editPlaylistData.songs.map((song, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                borderRadius: 1,
                                mb: 0.5,
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <ListItemText
                                primary={`${index + 1}. ${song.title}`}
                                secondary={`by ${song.artist} (${song.year})`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton 
                                    edge="end" 
                                    aria-label="edit"
                                    onClick={() => handleEditSong(index)}
                                    sx={{ mr: 1 }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton 
                                    edge="end" 
                                    aria-label="duplicate"
                                    onClick={() => handleDuplicateSong(index)}
                                    sx={{ mr: 1 }}
                                >
                                    <ContentCopyIcon />
                                </IconButton>
                                <IconButton 
                                    edge="end" 
                                    aria-label="delete"
                                    onClick={() => handleDeleteSong(index)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <IconButton 
                            onClick={handleUndo}
                            disabled={!canUndo}
                            title="Undo"
                        >
                            <UndoIcon />
                        </IconButton>
                        <IconButton 
                            onClick={handleRedo}
                            disabled={!canRedo}
                            title="Redo"
                        >
                            <RedoIcon />
                        </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button onClick={handleClose} variant="outlined">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            variant="contained"
                            disabled={!playlistName.trim()}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}