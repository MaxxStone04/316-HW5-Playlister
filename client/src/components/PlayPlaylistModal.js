import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PauseIcon from '@mui/icons-material/Pause';
import YouTubePlayer from './youTubePlayer';

// Modal styles
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '85%',
    maxWidth: 1100,
    maxHeight: '85vh',
    overflow: 'hidden',
    bgcolor: '#B0FFB5', // Background color of the box
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid #0A5C00',
};

const headerStyle = {
    width: '100%',
    height: '60px',
    bgcolor: '#0E8503', // Header background color
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '20px',
    borderRadius: '12px 12px 0 0',
};

const contentStyle = {
    flex: 1,
    display: 'flex',
    padding: '20px',
    gap: '20px',
    overflow: 'hidden',
};

const leftPanelStyle = {
    width: '45%',
    bgcolor: 'white',
    borderRadius: '8px',
    padding: '20px',
    overflowY: 'auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
};

const rightPanelStyle = {
    width: '55%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
};

const playlistHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    paddingBottom: '15px',
    borderBottom: '2px solid #E0E0E0',
};

const songCardStyle = {
    bgcolor: '#FFF7B2',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
};

const selectedSongCardStyle = {
    ...songCardStyle,
    bgcolor: '#FFD466',
    border: '2px solid #FFA726',
};

const controlButtonStyle = {
    bgcolor: '#EE06FF',
    color: 'white',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    minWidth: '60px',
    '&:hover': {
        bgcolor: '#D405E5',
        transform: 'scale(1.05)',
    },
};

const closeButtonStyle = {
    bgcolor: '#219653',
    color: 'white',
    borderRadius: '8px',
    padding: '8px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
        bgcolor: '#1A7C45',
    },
};

export default function PlayPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { currentPlayingPlaylist, currentPlayingIndex, isPlaying } = store;
    const [repeat, setRepeat] = useState(false);

    if (!currentPlayingPlaylist) return null;

    const currentSong = currentPlayingPlaylist.songs[currentPlayingIndex];
    const songs = currentPlayingPlaylist.songs || [];

    const handleClose = () => {
        store.closePlaylistModal();
    };

    const handleNext = () => {
        if (store.currentPlayingPlaylist) {
            if (currentPlayingIndex === store.currentPlayingPlaylist.songs.length - 1 && repeat) {
                // If at end and repeat is on, go to start
                store.setCurrentSongIndex(0);
            } else {
                const nextIndex = (currentPlayingIndex + 1) % store.currentPlayingPlaylist.songs.length;
                store.setCurrentSongIndex(nextIndex);
            }
        }
    };

    const handlePrev = () => {
        if (store.currentPlayingPlaylist) {
            if (currentPlayingIndex === 0 && repeat) {
                // If at start and repeat is on, go to end
                store.setCurrentSongIndex(store.currentPlayingPlaylist.songs.length - 1);
            } else {
                const prevIndex = currentPlayingIndex > 0 ? 
                    currentPlayingIndex - 1 : 
                    store.currentPlayingPlaylist.songs.length - 1;
                store.setCurrentSongIndex(prevIndex);
            }
        }
    };

    const handlePlayPause = () => {
        store.togglePlayPause();
    };

    const handleSongClick = (index) => {
        store.setCurrentSongIndex(index);
        if (!isPlaying) {
            store.togglePlayPause();
        }
    };

    const handleAutoPlayNext = () => {
        if (isPlaying) {
            handleNext();
        }
    };

    // Get user avatar or initials
    const getCreatorAvatar = () => {
        // Try to get from auth context if it's the logged-in user
        if (auth.loggedIn && auth.user?.email === currentPlayingPlaylist.ownerEmail) {
            return auth.user?.avatar || null;
        }
        // Otherwise use email initial
        return null;
    };

    const getCreatorInitials = () => {
        const email = currentPlayingPlaylist.ownerEmail || '';
        return email.charAt(0).toUpperCase();
    };

    const creatorAvatar = getCreatorAvatar();
    const creatorInitials = getCreatorInitials();

    return (
        <Modal
            open={store.currentModal === 'PLAY_PLAYLIST'}
            onClose={handleClose}
            aria-labelledby="play-playlist-modal"
            sx={{
                backdropFilter: 'blur(4px)',
            }}
        >
            <Box sx={modalStyle}>
                {/* Header */}
                <Box sx={headerStyle}>
                    <Typography 
                        variant="h5" 
                        component="h2"
                        sx={{ 
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '24px'
                        }}
                    >
                        Play Playlist
                    </Typography>
                </Box>

                {/* Content */}
                <Box sx={contentStyle}>
                    {/* Left Panel - Playlist Info & Songs */}
                    <Box sx={leftPanelStyle}>
                        {/* Playlist Header */}
                        <Box sx={playlistHeaderStyle}>
                            <Avatar
                                src={creatorAvatar}
                                sx={{ 
                                    width: 60, 
                                    height: 60,
                                    bgcolor: creatorAvatar ? 'transparent' : '#0E8503',
                                    fontSize: '24px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {creatorInitials}
                            </Avatar>
                            <Box>
                                <Typography 
                                    variant="h5"
                                    sx={{ 
                                        fontWeight: 'bold',
                                        color: '#1E1E1E',
                                        lineHeight: 1.2
                                    }}
                                >
                                    {currentPlayingPlaylist.name}
                                </Typography>
                                <Typography 
                                    variant="body1"
                                    sx={{ 
                                        color: '#666666',
                                        fontSize: '16px'
                                    }}
                                >
                                    {currentPlayingPlaylist.ownerEmail}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Songs List */}
                        <Box sx={{ flex: 1, overflowY: 'auto', mt: 1 }}>
                            {songs.map((song, index) => (
                                <Box
                                    key={index}
                                    sx={index === currentPlayingIndex ? selectedSongCardStyle : songCardStyle}
                                    onClick={() => handleSongClick(index)}
                                >
                                    <Typography 
                                        variant="subtitle1"
                                        sx={{ 
                                            fontWeight: 'bold',
                                            color: '#1E1E1E',
                                            mb: 0.5
                                        }}
                                    >
                                        {index + 1}. {song.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2"
                                        sx={{ 
                                            color: '#5D5D5D',
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        by {song.artist} ({song.year})
                                    </Typography>
                                    {song.youTubeId && (
                                        <Typography 
                                            variant="caption"
                                            sx={{ 
                                                color: '#888888',
                                                display: 'block',
                                                mt: 0.5
                                            }}
                                        >
                                            YouTube ID: {song.youTubeId}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Right Panel - YouTube Player & Controls */}
                    <Box sx={rightPanelStyle}>
                        {/* YouTube Player */}
                        <Box sx={{ 
                            flex: 1,
                            bgcolor: 'black',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {currentSong && currentSong.youTubeId ? (
                                <YouTubePlayer
                                    videoId={currentSong.youTubeId}
                                    playing={isPlaying}
                                    onPlay={() => store.togglePlayPause()}
                                    onPause={() => store.togglePlayPause()}
                                    onEnd={handleAutoPlayNext}
                                    key={currentSong.youTubeId + currentPlayingIndex}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            ) : (
                                <Box sx={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        No video available
                                    </Typography>
                                    <Typography variant="body2">
                                        This song doesn't have a YouTube ID
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Player Controls */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            gap: '30px',
                            mt: '10px'
                        }}>
                            <IconButton 
                                sx={controlButtonStyle}
                                onClick={handlePrev}
                                title="Previous Song"
                            >
                                <SkipPreviousIcon sx={{ fontSize: 32 }} />
                            </IconButton>
                            
                            <IconButton 
                                sx={controlButtonStyle}
                                onClick={handlePlayPause}
                                title={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? (
                                    <PauseIcon sx={{ fontSize: 32 }} />
                                ) : (
                                    <PlayArrowIcon sx={{ fontSize: 32 }} />
                                )}
                            </IconButton>
                            
                            <IconButton 
                                sx={controlButtonStyle}
                                onClick={handleNext}
                                title="Next Song"
                            >
                                <SkipNextIcon sx={{ fontSize: 32 }} />
                            </IconButton>
                        </Box>

                        {/* Current Song Info */}
                        {currentSong && (
                            <Box sx={{ 
                                textAlign: 'center',
                                mt: '10px',
                                p: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '8px'
                            }}>
                                <Typography 
                                    variant="h6"
                                    sx={{ 
                                        fontWeight: 'bold',
                                        color: '#1E1E1E',
                                        mb: 0.5
                                    }}
                                >
                                    {currentSong.title}
                                </Typography>
                                <Typography 
                                    variant="body1"
                                    sx={{ 
                                        color: '#666666'
                                    }}
                                >
                                    {currentSong.artist} • {currentSong.year}
                                </Typography>
                                {currentSong.youTubeId && (
                                    <Typography 
                                        variant="caption"
                                        sx={{ 
                                            color: '#888888',
                                            display: 'block',
                                            mt: 0.5
                                        }}
                                    >
                                        Now Playing
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Close Button */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    padding: '15px 20px',
                    borderTop: '2px solid #0A5C00'
                }}>
                    <Button 
                        sx={closeButtonStyle}
                        onClick={handleClose}
                        startIcon={<CloseIcon />}
                    >
                        Close
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}