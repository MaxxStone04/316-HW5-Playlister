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
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import youTubePlayer from './youTubePlayer';

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
            console.error("Error loading songs:", error);
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
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
            <Box sx={{ 
                width: '30%', 
                p: 3, 
                borderRight: 1, 
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography variant="h6" gutterBottom>
                    Songs Catalog
                </Typography>
                
                <TextField
                    label="by Title"
                    fullWidth
                    margin="normal"
                    value={searchParams.title}
                    onChange={(e) => handleSearchChange('title', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                
                <TextField
                    label="by Artist"
                    fullWidth
                    margin="normal"
                    value={searchParams.artist}
                    onChange={(e) => handleSearchChange('artist', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                
                <TextField
                    label="by Year"
                    fullWidth
                    margin="normal"
                    value={searchParams.year}
                    onChange={(e) => handleSearchChange('year', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    type="number"
                />
                
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={handleClear}
                        fullWidth
                        disabled={loading}
                    >
                        Clear
                    </Button>
                </Box>

                <Box sx={{ mt: 4, flexGrow: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Preview
                    </Typography>
                    {selectedSong ? (
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                <strong>{selectedSong.title}</strong> by {selectedSong.artist}
                            </Typography>
                            <youTubePlayer 
                                videoId={selectedSong.youTubeId}
                                key={selectedSong._id} 
                            />
                        </Box>
                    ) : (
                        <Box sx={{ 
                            height: 200, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: 'grey.100',
                            borderRadius: 1
                        }}>
                            <Typography color="text.secondary">
                                Select a song to preview
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
            
            <Box sx={{ 
                width: '70%', 
                p: 3,
                overflow: 'auto',
                position: 'relative'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    bgcolor: 'background.paper',
                    py: 1
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6">
                            Sort: 
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel id="sort-select-label">Sort By</InputLabel>
                            <Select
                                labelId="sort-select-label"
                                value={store.songSort || 'listens-hi-lo'}
                                onChange={handleSortChange}
                                label="Sort By"
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
                    
                    <Typography variant="subtitle1">
                        {loading ? 'Loading...' : `${store.currentSongs?.length || 0} Songs`}
                    </Typography>
                    
                    {auth.loggedIn && (
                        <Fab 
                            color="primary" 
                            aria-label="add new song"
                            size="medium"
                            onClick={handleNewSong}
                        >
                            <AddIcon />
                        </Fab>
                    )}
                </Box>
                
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <Typography>Loading songs...</Typography>
                    </Box>
                )}
                
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