import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import PlaylistCard from './PlaylistCard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function PlaylistsScreen() {
    const { store } = useContext(GlobalStoreContext);
    const [searchParams, setSearchParams] = useState({
        name: '',
        userName: '',
        songTitle: '',
        songArtist: '',
        songYear: ''
    });

    const handleSearchChange = (field, value) => {
        setSearchParams({
            ...searchParams,
            [field]: value
        });
    };

    const handleSearch = () => {
        if (store.isGuestMode) {
            store.searchAllPlaylists(searchParams);
        } else {
            store.searchPlaylists(searchParams);
        }
    };

    const handleClear = () => {
        setSearchParams({
            name: '',
            userName: '',
            songTitle: '',
            songArtist: '',
            songYear: ''
        });
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
            <Box sx={{ 
                width: '30%', 
                p: 3, 
                borderRight: 1, 
                borderColor: 'divider',
                bgcolor: 'background.paper'
            }}>
                <Typography variant="h6" gutterBottom>
                    Playlists
                </Typography>
                
                <TextField
                    label="by Playlist Name"
                    fullWidth
                    margin="normal"
                    value={searchParams.name}
                    onChange={(e) => handleSearchChange('name', e.target.value)}
                />
                
                <TextField
                    label="by User Name"
                    fullWidth
                    margin="normal"
                    value={searchParams.userName}
                    onChange={(e) => handleSearchChange('userName', e.target.value)}
                />
                
                <TextField
                    label="by Song Title"
                    fullWidth
                    margin="normal"
                    value={searchParams.songTitle}
                    onChange={(e) => handleSearchChange('songTitle', e.target.value)}
                />
                
                <TextField
                    label="by Song Artist"
                    fullWidth
                    margin="normal"
                    value={searchParams.songArtist}
                    onChange={(e) => handleSearchChange('songArtist', e.target.value)}
                />
                
                <TextField
                    label="by Song Year"
                    fullWidth
                    margin="normal"
                    value={searchParams.songYear}
                    onChange={(e) => handleSearchChange('songYear', e.target.value)}
                    type="number"
                />
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                        fullWidth
                    >
                        Search
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={handleClear}
                        fullWidth
                    >
                        Clear
                    </Button>
                </Box>
            </Box>
            
            <Box sx={{ 
                width: '70%', 
                p: 3,
                overflow: 'auto'
            }}>
                <Typography variant="h6" gutterBottom>
                    Playlists Found: {store.currentPlaylists?.length || 0}
                </Typography>
                
                {store.currentPlaylists?.map(playlist => (
                    <PlaylistCard key={playlist._id} playlist={playlist} />
                ))}
            </Box>
        </Box>
    );
}