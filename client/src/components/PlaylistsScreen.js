import { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import PlaylistCard from './PlaylistCard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

export default function PlaylistsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useState({
        name: '',
        userName: '',
        songTitle: '',
        songArtist: '',
        songYear: ''
    });
    const [loading, setLoading] = useState(false);

    // Background color for the entire screen
    const backgroundColor = '#FFFFE4';
    const searchFieldBgColor = '#E6E0E9';
    const buttonBgColor = '#6750A4';

    // Load user's playlists on mount
    useEffect(() => {
        loadUserPlaylists();
    }, [auth.loggedIn]);

    const loadUserPlaylists = async () => {
        setLoading(true);
        try {
            await store.searchPlaylists({});
        } catch (error) {
            console.error("Error loading playlists:", error);
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
            await store.searchPlaylists(searchParams);
        } catch (error) {
            console.error("Error searching playlists:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        setSearchParams({
            name: '',
            userName: '',
            songTitle: '',
            songArtist: '',
            songYear: ''
        });
        await loadUserPlaylists();
    };

    const handleSortChange = async (event) => {
        await store.sortPlaylists(event.target.value);
    };

    const handleCreateNewList = () => {
        store.createNewList();
    };

    const searchFields = [
        { label: 'by Playlist Name', field: 'name' },
        { label: 'by User Name', field: 'userName' },
        { label: 'by Song Title', field: 'songTitle' },
        { label: 'by Song Artist', field: 'songArtist' },
        { label: 'by Song Year', field: 'songYear' }
    ];

    return (
        <Box sx={{ 
            display: 'flex', 
            height: 'calc(100vh - 64px)',
            backgroundColor: backgroundColor
        }}>
            {/* Left Panel - Search */}
            <Box sx={{ 
                width: '30%', 
                p: 3, 
                borderRight: 1, 
                borderColor: 'divider',
                backgroundColor: backgroundColor,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 'bold',
                        color: '#C20CB9',
                        mb: 3
                    }}
                >
                    Playlists
                </Typography>
                
                {searchFields.map(({ label, field }) => (
                    <TextField
                        key={field}
                        label={label}
                        fullWidth
                        margin="normal"
                        value={searchParams[field]}
                        onChange={(e) => handleSearchChange(field, e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: searchFieldBgColor,
                                borderRadius: '8px',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#6750A4'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#6750A4',
                                    borderWidth: 2
                                }
                            }
                        }}
                        InputProps={{
                            endAdornment: searchParams[field] && (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="clear field"
                                        onClick={() => handleClearField(field)}
                                        edge="end"
                                        size="small"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                ))}
                
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                        fullWidth
                        disabled={loading}
                        sx={{
                            backgroundColor: buttonBgColor,
                            borderRadius: '20px',
                            '&:hover': {
                                backgroundColor: '#5A4793'
                            },
                            py: 1.5
                        }}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={handleClear}
                        fullWidth
                        disabled={loading}
                        sx={{
                            backgroundColor: buttonBgColor,
                            borderRadius: '20px',
                            color: 'white',
                            py: 1.5
                        }}
                    >
                        Clear
                    </Button>
                </Box>
            </Box>
            
            {/* Right Panel - Results */}
            <Box sx={{ 
                width: '70%', 
                p: 3,
                overflow: 'auto',
                backgroundColor: backgroundColor,
                position: 'relative'
            }}>
                {/* Header - Fixed at top */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    backgroundColor: backgroundColor,
                    position: 'sticky',
                    top: -24,
                    zIndex: 100,
                    pt: 2,
                    pb: 2,
                    marginLeft: -24,
                    marginRight: -24,
                    paddingLeft: 24,
                    paddingRight: 24,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" sx={{ color: '#49454F' }}>
                            Sort: 
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel id="playlist-sort-label">Sort By</InputLabel>
                            <Select
                                labelId="playlist-sort-label"
                                value={store.playlistSort || 'listeners-hi-lo'}
                                onChange={handleSortChange}
                                label="Sort By"
                                sx={{
                                    backgroundColor: 'white',
                                    borderRadius: '4px'
                                }}
                            >
                                <MenuItem value="listeners-hi-lo">Listeners (Hi-Lo)</MenuItem>
                                <MenuItem value="listeners-lo-hi">Listeners (Lo-Hi)</MenuItem>
                                <MenuItem value="name-a-z">Playlist Name (A-Z)</MenuItem>
                                <MenuItem value="name-z-a">Playlist Name (Z-A)</MenuItem>
                                <MenuItem value="user-a-z">User Name (A-Z)</MenuItem>
                                <MenuItem value="user-z-a">User Name (Z-A)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    
                    <Typography variant="subtitle1" sx={{ color: '#49454F', fontWeight: 'medium' }}>
                        {loading ? 'Loading...' : `${store.currentPlaylists?.length || 0} Playlists`}
                    </Typography>
                </Box>
                
                {/* Loading State */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <Typography sx={{ color: '#49454F' }}>Loading playlists...</Typography>
                    </Box>
                )}
                
                {/* No Results */}
                {!loading && (!store.currentPlaylists || store.currentPlaylists.length === 0) && (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        py: 12
                    }}>
                        <Typography variant="h6" color="#49454F" gutterBottom>
                            No playlists found
                        </Typography>
                        <Typography variant="body2" color="#49454F">
                            {auth.loggedIn ? 'Create your first playlist!' : 'Try searching for playlists'}
                        </Typography>
                    </Box>
                )}
                
                {/* Playlist cards */}
                <Box sx={{ pb: 8 }}>
                    {!loading && store.currentPlaylists?.map((playlist) => (
                        <PlaylistCard 
                            key={playlist._id}
                            playlist={playlist}
                        />
                    ))}
                </Box>
            </Box>
            
            {/* New Playlist Button - Positioned in the middle-right area */}
            {auth.loggedIn && !store.isGuestMode && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateNewList}
                    sx={{
                        backgroundColor: buttonBgColor,
                        borderRadius: '20px',
                        position: 'fixed',
                        bottom: 24,
                        left: 'calc(30% + 100px)', // Aligns with the right side of the left panel
                        zIndex: 1000,
                        '&:hover': {
                            backgroundColor: '#5A4793'
                        },
                        px: 3,
                        py: 1.5,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                >
                    New Playlist
                </Button>
            )}
        </Box>
    );
}