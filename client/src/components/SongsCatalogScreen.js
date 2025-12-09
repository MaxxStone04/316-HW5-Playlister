import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import SongCatalogCard from './SongCatalogCard';
import NewSongModal from './NewSongModal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import YouTubePlayer from './youTubePlayer';

export default function SongsCatalogScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useState({
        title: '',
        artist: '',
        year: ''
    });
    const [selectedSong, setSelectedSong] = useState(null);
    const [showNewSongModal, setShowNewSongModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadInitialSongs();
    }, []);

    const loadInitialSongs = async () => {
        setLoading(true);
        try {
            await store.searchSongs({});
        } catch (error) {
            console.error("There was an error loading songs: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (field, value) => {
        setSearchParams({
            ...searchParams,
            [field]: value
        });
    };

    const handleClearField = (field) => {
        setSearchParams({
            ...searchParams,
            [field]: ''
        });
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            await store.searchSongs(searchParams);
        } catch (error) {
            console.error("Error searching songs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        setSearchParams({
            title: '',
            artist: '',
            year: ''
        });
        await loadInitialSongs();
    };

    const handleSortChange = async (event) => {
        await store.sortSongs(event.target.value);
    };

    const handleNewSong = () => {
        setShowNewSongModal(true);
    };

    const handleCloseNewSongModal = () => {
        setShowNewSongModal(false);
    };

    const handleSongAdded = async () => {
        setShowNewSongModal(false);
        await loadInitialSongs();
    };

    const handleSongSelect = (song) => {
        setSelectedSong(song);
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            height: 'calc(100vh - 64px)',
            bgcolor: '#FFFFE4'
        }}>
            {/* Left Panel - Search & Player */}
            <Box sx={{ 
                width: '35%', 
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative' // For positioning New Song button
            }}>
                {/* Header */}
                <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 'bold',
                        color: '#C20CB9',
                        mb: 3
                    }}
                >
                    Songs Catalog
                </Typography>
                
                {/* Search Boxes */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        placeholder="by Title"
                        fullWidth
                        value={searchParams.title}
                        onChange={(e) => handleSearchChange('title', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#E6E0E9',
                                borderRadius: '50px',
                                '& fieldset': {
                                    border: 'none'
                                }
                            }
                        }}
                        InputProps={{
                            endAdornment: searchParams.title && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleClearField('title')}
                                        edge="end"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        placeholder="by Artist"
                        fullWidth
                        value={searchParams.artist}
                        onChange={(e) => handleSearchChange('artist', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#E6E0E9',
                                borderRadius: '50px',
                                '& fieldset': {
                                    border: 'none'
                                }
                            }
                        }}
                        InputProps={{
                            endAdornment: searchParams.artist && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleClearField('artist')}
                                        edge="end"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                        placeholder="by Year"
                        fullWidth
                        value={searchParams.year}
                        onChange={(e) => handleSearchChange('year', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: '#E6E0E9',
                                borderRadius: '50px',
                                '& fieldset': {
                                    border: 'none'
                                }
                            }
                        }}
                        InputProps={{
                            endAdornment: searchParams.year && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleClearField('year')}
                                        edge="end"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                
                {/* Search and Clear Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                        disabled={loading}
                        sx={{
                            bgcolor: '#6750A4',
                            borderRadius: '50px',
                            px: 3,
                            '&:hover': {
                                bgcolor: '#5A4790'
                            }
                        }}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                    
                    <Button
                        variant="contained"
                        onClick={handleClear}
                        disabled={loading}
                        sx={{
                            bgcolor: '#6750A4',
                            borderRadius: '50px',
                            px: 3,
                            '&:hover': {
                                bgcolor: '#5A4790'
                            }
                        }}
                    >
                        Clear
                    </Button>
                </Box>

                {/* YouTube Player */}
                <Box sx={{ 
                    mt: 2, 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {selectedSong ? (
                        <YouTubePlayer 
                            videoId={selectedSong.youTubeId}
                            key={selectedSong._id}
                        />
                    ) : (
                        <Box sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                            borderRadius: 1
                        }}>
                            <Typography 
                                variant="subtitle1" 
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                No song selected
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Select a song to preview
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* New Song Button - Fixed to bottom next to divider */}
                {auth.loggedIn && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleNewSong}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            bottom: 16,
                            bgcolor: '#6750A4',
                            borderRadius: '50px',
                            px: 3,
                            '&:hover': {
                                bgcolor: '#5A4790'
                            }
                        }}
                    >
                        New Song
                    </Button>
                )}
            </Box>
            
            {/* Vertical Divider */}
            <Box sx={{ 
                width: '1px', 
                bgcolor: '#E0E0E0',
                my: 2
            }} />
            
            {/* Right Panel - Results */}
            <Box sx={{ 
                width: '64%', 
                p: 3,
                overflow: 'auto',
                position: 'relative'
            }}>
                {/* Header with Sort and Song Count */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    bgcolor: '#FFFFE4',
                    py: 1,
                    pr: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography 
                            variant="h6"
                            sx={{ color: '#C20CB9' }}
                        >
                            Sort: 
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <Select
                                value={store.songSort || 'listens-hi-lo'}
                                onChange={handleSortChange}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: '20px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#6750A4'
                                    }
                                }}
                            >
                                <MenuItem value="listens-hi-lo">Listens (Hi-Lo)</MenuItem>
                                <MenuItem value="listens-lo-hi">Listens (Lo-Hi)</MenuItem>
                                <MenuItem value="playlistCount-hi-lo">Playlists (Hi-Lo)</MenuItem>
                                <MenuItem value="playlistCount-lo-hi">Playlists (Lo-Hi)</MenuItem>
                                <MenuItem value="title-a-z">Title (A-Z)</MenuItem>
                                <MenuItem value="title-z-a">Title (Z-A)</MenuItem>
                                <MenuItem value="artist-a-z">Artist (A-Z)</MenuItem>
                                <MenuItem value="artist-z-a">Artist (Z-A)</MenuItem>
                                <MenuItem value="year-hi-lo">Year (Hi-Lo)</MenuItem>
                                <MenuItem value="year-lo-hi">Year (Lo-Hi)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    
                    <Typography 
                        variant="subtitle1"
                        sx={{ color: '#C20CB9', fontWeight: 'bold' }}
                    >
                        {loading ? 'Loading...' : `${store.currentSongs?.length || 0} Songs`}
                    </Typography>
                </Box>
                
                {/* Loading State */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <Typography>Loading songs...</Typography>
                    </Box>
                )}
                
                {/* No Results */}
                {!loading && (!store.currentSongs || store.currentSongs.length === 0) && (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        py: 8
                    }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No songs found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Try different search criteria or add a new song
                        </Typography>
                    </Box>
                )}
                
                {/* Song cards */}
                {!loading && store.currentSongs?.map((song, index) => (
                    <SongCatalogCard 
                        key={song._id || index}
                        song={song}
                        index={index}
                        onSelect={handleSongSelect}
                        isSelected={selectedSong?._id === song._id}
                    />
                ))}
            </Box>
            
            {/* New Song Modal */}
            {showNewSongModal && (
                <NewSongModal
                    open={showNewSongModal}
                    onClose={handleCloseNewSongModal}
                    onSongAdded={handleSongAdded}
                />
            )}
        </Box>
    );
}