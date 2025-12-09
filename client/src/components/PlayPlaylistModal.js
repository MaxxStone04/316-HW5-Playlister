import { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import CloseIcon from '@mui/icons-material/Close';
import YouTubePlayer from './youTubePlayer';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 1200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function PlayPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const { currentPlayingPlaylist, currentPlayingIndex, isPlaying } = store;

    if (!currentPlayingPlaylist) return null;

    const currentSong = currentPlayingPlaylist.songs[currentPlayingIndex];

    const handleClose = () => {
        store.closePlaylistModal();
    };

    const handleNext = () => {
        store.nextSong();
    };

    const handlePrev = () => {
        store.prevSong();
    };

    const handlePlayPause = () => {
        store.togglePlayPause();
    };

    return (
        <Modal
            open={store.currentModal === 'PLAY_PLAYLIST'}
            onClose={handleClose}
            aria-labelledby="play-playlist-modal"
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" component="h2">
                        Play Playlist
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ width: '40%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ mr: 2 }}>
                                {currentPlayingPlaylist.ownerEmail.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="h6">
                                    {currentPlayingPlaylist.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {currentPlayingPlaylist.ownerEmail}
                                </Typography>
                            </Box>
                        </Box>

                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {currentPlayingPlaylist.songs.map((song, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        bgcolor: index === currentPlayingIndex ? 'action.selected' : 'transparent',
                                        borderRadius: 1,
                                        mb: 0.5
                                    }}
                                >
                                    <ListItemText
                                        primary={`${index + 1}. ${song.title}`}
                                        secondary={`by ${song.artist} (${song.year})`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    <Box sx={{ width: '60%' }}>
                        {currentSong && (
                            <>
                                <YouTubePlayer
                                    videoId={currentSong.youTubeId}
                                    playing={isPlaying}
                                    onEnd={handleNext}
                                />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
                                    <IconButton size="large" onClick={handlePrev}>
                                        <SkipPreviousIcon fontSize="large" />
                                    </IconButton>
                                    <IconButton size="large" onClick={handlePlayPause}>
                                        {isPlaying ? (
                                            <PauseIcon fontSize="large" />
                                        ) : (
                                            <PlayArrowIcon fontSize="large" />
                                        )}
                                    </IconButton>
                                    <IconButton size="large" onClick={handleNext}>
                                        <SkipNextIcon fontSize="large" />
                                    </IconButton>
                                </Box>

                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                    <Typography variant="h6">
                                        {currentSong.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {currentSong.artist} • {currentSong.year}
                                    </Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}