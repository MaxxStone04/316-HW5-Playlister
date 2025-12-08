import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useHistory } from 'react-router-dom';

export default function SongCatalogCard({ song, onSelect, isSelected, index }) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [playlistAnchorEl, setPlaylistAnchorEl] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const history = useHistory();
    
    const open = Boolean(anchorEl);
    const playlistMenuOpen = Boolean(playlistAnchorEl);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setPlaylistAnchorEl(null);
    };

    const handleAddToPlaylistClick = async (event) => {
        event.stopPropagation();
        
        try {
            const response = await fetch('http://localhost:4000/store/playlistpairs', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setPlaylists(data.idNamePairs);
                    setPlaylistAnchorEl(event.currentTarget);
                }
            }
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
        
        setAnchorEl(null);
    };

    const handleEditSong = (event) => {
        event.stopPropagation();
        store.showEditSongModal(index, song);
        handleClose();
    };

    const handleRemoveSong = (event) => {
        event.stopPropagation();
        store.showRemoveSongModal(song._id, song);
        handleClose();
    };

    const handleAddToSpecificPlaylist = async (playlistId) => {
        try {
            const response = await fetch(`http://localhost:4000/store/playlist/${playlistId}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    const playlist = data.playlist;
                    
                    const songExists = playlist.songs.some(
                        s => s.title === song.title && 
                             s.artist === song.artist && 
                             s.year === song.year
                    );
                    
                    if (!songExists) {
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
                            console.log("Song added to playlist successfully");
                            
                            await fetch(`http://localhost:4000/store/songs/${song._id}/increment-count`, {
                                method: 'PUT',
                                credentials: 'include'
                            });
                        }
                    } else {
                        console.log("Song already exists in playlist");
                    }
                }
            }
        } catch (error) {
            console.error("Error adding song to playlist:", error);
        }
        
        handleClose();
    };

    const isOwnedByUser = auth.user && song.ownerEmail === auth.user.email;

    return (
        <Card 
            sx={{ 
                mb: 2, 
                cursor: 'pointer',
                border: isSelected ? 2 : 0,
                borderColor: 'primary.main',
                '&:hover': {
                    bgcolor: 'action.hover'
                },
                position: 'relative'
            }}
            onClick={() => onSelect(song)}
        >
            {isOwnedByUser && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        bgcolor: 'primary.main',
                        borderRadius: '4px 4px 0 0'
                    }}
                />
            )}
            
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="div">
                            {song.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            by {song.artist} ({song.year})
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                            <Typography variant="body2">
                                <strong>Listens:</strong> {song.listens || 0}
                            </Typography>
                            <Typography variant="body2">
                                <strong>In Playlists:</strong> {song.playlistCount || 0}
                            </Typography>
                            {song.ownerEmail && (
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Added by:</strong> {song.ownerEmail}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    
                    {auth.loggedIn && (
                        <IconButton
                            aria-label="more"
                            aria-controls={open ? 'song-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            size="small"
                        >
                            <MoreVertIcon />
                        </IconButton>
                    )}
                </Box>
            </CardContent>
            
            <Menu
                id="song-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem 
                    onClick={handleAddToPlaylistClick}
                    onMouseEnter={handleAddToPlaylistClick}
                >
                    Add to Playlist
                </MenuItem>
                {isOwnedByUser && (
                    <>
                        <MenuItem onClick={handleEditSong}>
                            Edit Song
                        </MenuItem>
                        <MenuItem onClick={handleRemoveSong}>
                            Remove from Catalog
                        </MenuItem>
                    </>
                )}
            </Menu>
            
            <Menu
                id="playlist-submenu"
                anchorEl={playlistAnchorEl}
                open={playlistMenuOpen}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                        <MenuItem 
                            key={playlist._id}
                            onClick={() => handleAddToSpecificPlaylist(playlist._id)}
                        >
                            {playlist.name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>
                        No playlists found
                    </MenuItem>
                )}
            </Menu>
        </Card>
    );
}