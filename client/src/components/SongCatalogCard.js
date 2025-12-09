import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import SongMenu from './SongMenu';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ isselected, isowned }) => ({
    backgroundColor: isselected === 'true' ? '#FFD466' : '#FFF7B2',
    borderRadius: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
    border: isowned === 'true' ? '2px solid #6750A4' : 'none',
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out'
    }
}));

export default function SongCatalogCard({ song, onSelect, isSelected, index }) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    
    const open = Boolean(anchorEl);

    useEffect(() => {
        if (auth.loggedIn) {
            loadUserPlaylists();
        }
    }, [auth.loggedIn]);

    const loadUserPlaylists = async () => {
        try {
            const response = await fetch('http://localhost:4000/store/playlistpairs', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setPlaylists(data.idNamePairs);
                }
            }
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    };

    const handleMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Handle Edit Song button click
    const handleEditSong = () => {
        console.log("Edit Song clicked for:", song.title);
        store.showEditSongModal(index, song);
    };

    // Handle Remove Song button click
    const handleRemoveSong = () => {
        console.log("Remove Song clicked for:", song.title);
        store.showRemoveSongModal(song._id, song);
    };

    const handleAddToPlaylist = async (playlistId, playlistName) => {
        try {
            const response = await fetch(`http://localhost:4000/store/playlist/${playlistId}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    const playlist = data.playlist;
                    
                    // Check if song already exists in playlist
                    const songExists = playlist.songs.some(
                        s => s.title === song.title && 
                             s.artist === song.artist && 
                             s.year === song.year
                    );
                    
                    if (!songExists) {
                        // Add song to playlist
                        const updatedPlaylist = {
                            ...playlist,
                            songs: [...playlist.songs, {
                                title: song.title,
                                artist: song.artist,
                                year: song.year,
                                youTubeId: song.youTubeId
                            }]
                        };
                        
                        const updateResponse = await fetch(`http://localhost:4000/store/playlist/${playlistId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                playlist: updatedPlaylist
                            }),
                            credentials: 'include'
                        });
                        
                        if (updateResponse.ok) {
                            console.log(`Song added to "${playlistName}" playlist!`);
                            
                            // Show success message (you can replace this with a toast notification)
                            alert(`"${song.title}" added to "${playlistName}" playlist!`);
                            
                            // Update song's playlist count
                            try {
                                await fetch(`http://localhost:4000/store/songs/${song._id}/increment-playlist-count`, {
                                    method: 'PUT',
                                    credentials: 'include'
                                });
                            } catch (error) {
                                console.error("Error updating playlist count:", error);
                                // Continue anyway - the main action succeeded
                            }
                        } else {
                            alert("Error adding song to playlist. Please try again.");
                        }
                    } else {
                        alert(`"${song.title}" already exists in "${playlistName}" playlist`);
                    }
                }
            } else {
                alert("Error accessing playlist. Please try again.");
            }
        } catch (error) {
            console.error("Error adding song to playlist:", error);
            alert("Error adding song to playlist. Please try again.");
        }
    };

    const isOwnedByUser = auth.user && song.ownerEmail === auth.user.email;

    return (
        <>
            <StyledCard 
                isselected={isSelected.toString()}
                isowned={isOwnedByUser.toString()}
                onClick={() => onSelect(song)}
            >
                <CardContent sx={{ p: 2, pb: '8px !important' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography 
                                variant="h6" 
                                component="div"
                                sx={{ 
                                    fontWeight: 'bold',
                                    color: '#1E1E1E',
                                    mb: 0.5
                                }}
                            >
                                {song.title} by {song.artist} ({song.year})
                            </Typography>
                            
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 1
                            }}>
                                <Typography 
                                    variant="body2"
                                    sx={{ 
                                        fontWeight: 'medium',
                                        color: '#5D5D5D'
                                    }}
                                >
                                    Listens: {song.listenCount || song.listens || 0}
                                </Typography>
                                
                                <Typography 
                                    variant="body2"
                                    sx={{ 
                                        fontWeight: 'medium',
                                        color: '#5D5D5D'
                                    }}
                                >
                                    Playlists: {song.playlistCount || 0}
                                </Typography>
                            </Box>
                        </Box>
                        
                        {auth.loggedIn && (
                            <IconButton
                                aria-label="song actions"
                                onClick={handleMenuClick}
                                size="small"
                                sx={{
                                    color: '#6750A4',
                                    '&:hover': {
                                        backgroundColor: 'rgba(103, 80, 164, 0.1)'
                                    }
                                }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        )}
                    </Box>
                </CardContent>
            </StyledCard>
            
            {/* Song Menu Component */}
            <SongMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                song={song}
                playlists={playlists}
                onEdit={handleEditSong}
                onRemove={handleRemoveSong}
                onAddToPlaylist={handleAddToPlaylist}
            />
        </>
    );
}