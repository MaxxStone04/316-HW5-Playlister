import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PlaylistCard({ playlist }) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = (event) => {
        event.stopPropagation();
        setExpanded(!expanded);
    };

    const handlePlay = (event) => {
        event.stopPropagation();
        store.playPlaylist(playlist);
    };

    const handleEdit = (event) => {
        event.stopPropagation();
        store.editPlaylist(playlist);
    };

    const handleCopy = async (event) => {
        event.stopPropagation();
        await store.copyPlaylist(playlist._id);
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        store.markListForDeletion(playlist._id);
    };

    const isOwnedByUser = auth.user && playlist.ownerEmail === auth.user.email;

    // Button colors from the diagram
    const buttonColors = {
        delete: '#D2292F',
        edit: '#3A64C4',
        copy: '#077836',
        play: '#DE24BC'
    };

    const listeners = playlist.listeners || 0;

    return (
        <Card 
            sx={{ 
                mb: 3, 
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '12px',
                overflow: 'visible',
                position: 'relative',
                minHeight: expanded ? '200px' : '120px'
            }}
        >
            <CardContent sx={{ p: 3, pb: 4 }}>
                {/* Top Section - Always visible */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: expanded ? 3 : 0
                }}>
                    {/* Left side - Avatar and Names */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                        <Avatar 
                            sx={{ 
                                mr: 2, 
                                width: 48, 
                                height: 48,
                                backgroundColor: '#6750A4'
                            }}
                        >
                            {playlist.ownerEmail?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 'bold',
                                    color: 'black',
                                    mb: 0.5
                                }}
                            >
                                {playlist.name}
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#B0B0B0',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {playlist.ownerEmail}
                            </Typography>
                        </Box>
                    </Box>
                    
                    {/* Right side - Buttons */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 1
                    }}>
                        {/* Play Button - Top right */}
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<PlayArrowIcon />}
                            onClick={handlePlay}
                            sx={{
                                backgroundColor: buttonColors.play,
                                borderRadius: '20px',
                                textTransform: 'none',
                                minWidth: '80px',
                                px: 2
                            }}
                        >
                            Play
                        </Button>
                        
                        {/* Action Buttons - Vertically stacked */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: 0.5
                        }}>
                            {isOwnedByUser && (
                                <>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleDelete}
                                        sx={{
                                            backgroundColor: buttonColors.delete,
                                            borderRadius: '20px',
                                            textTransform: 'none',
                                            minWidth: '80px',
                                            px: 2
                                        }}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={handleEdit}
                                        sx={{
                                            backgroundColor: buttonColors.edit,
                                            borderRadius: '20px',
                                            textTransform: 'none',
                                            minWidth: '80px',
                                            px: 2
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </>
                            )}
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<ContentCopyIcon />}
                                onClick={handleCopy}
                                sx={{
                                    backgroundColor: buttonColors.copy,
                                    borderRadius: '20px',
                                    textTransform: 'none',
                                    minWidth: '80px',
                                    px: 2
                                }}
                            >
                                Copy
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Expanded Section - Shows song list */}
                {expanded && playlist.songs && playlist.songs.length > 0 && (
                    <Box sx={{ 
                        mt: 2, 
                        pt: 2, 
                        borderTop: '1px solid #444',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}>
                        {playlist.songs.map((song, index) => (
                            <Box 
                                key={index} 
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    py: 1,
                                    px: 1,
                                    borderRadius: '4px',
                                }}
                            >
                                <Typography 
                                    sx={{ 
                                        color: '#B0B0B0',
                                        minWidth: '30px',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {index + 1}.
                                </Typography>
                                <Typography 
                                    sx={{ 
                                        color: 'black',
                                        fontSize: '0.875rem',
                                        flex: 1
                                    }}
                                >
                                    <strong>{song.title}</strong> by {song.artist} ({song.year})
                                </Typography>
                                {song.duration && (
                                    <Typography 
                                        sx={{ 
                                            color: '#B0B0B0',
                                            fontSize: '0.75rem',
                                            ml: 2
                                        }}
                                    >
                                        {song.duration}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Bottom Section - Listener Count and Expand Button */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: expanded ? 2 : 0,
                    position: 'relative',
                    height: '24px'
                }}>
                    {/* Listener Count - Inside the card at bottom left */}
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: '#B0B0B0',
                            fontSize: '0.875rem',
                            position: 'absolute',
                            bottom: 0,
                            left: 0
                        }}
                    >
                        {listeners} {listeners === 1 ? 'Listener' : 'Listeners'}
                    </Typography>
                    
                    {/* Expand Button - Inside the card at bottom right */}
                    <IconButton
                        onClick={handleExpandClick}
                        sx={{
                            color: '#B0B0B0',
                            position: 'absolute',
                            bottom: -8,
                            right: -8,
                            backgroundColor: 'white',
                            border: '1px solid #444',
                            width: '32px',
                            height: '32px'
                        }}
                    >
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
}