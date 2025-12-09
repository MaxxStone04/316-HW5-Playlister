import { useState, useEffect, useRef } from 'react';
import { ClickAwayListener } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

export default function SongMenu({ anchorEl, open, onClose, song, playlists, onEdit, onRemove, onAddToPlaylist }) {
    const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState(false);
    const menuRef = useRef(null);
    const submenuRef = useRef(null);
    const addToPlaylistItemRef = useRef(null);
    const submenuTimerRef = useRef(null);
    
    useEffect(() => {
        if (!open) {
            setShowPlaylistSubmenu(false);
            if (submenuTimerRef.current) {
                clearTimeout(submenuTimerRef.current);
            }
        }
    }, [open]);

    // Handle click away from menu
    const handleClickAway = (event) => {
        if (
            menuRef.current && 
            !menuRef.current.contains(event.target) &&
            (!submenuRef.current || !submenuRef.current.contains(event.target))
        ) {
            onClose();
        }
    };

    const handleAddToPlaylistHover = () => {
        if (playlists.length > 0) {
            if (submenuTimerRef.current) {
                clearTimeout(submenuTimerRef.current);
            }
            submenuTimerRef.current = setTimeout(() => {
                setShowPlaylistSubmenu(true);
            }, 200);
        }
    };

    const handleAddToPlaylistLeave = () => {
        if (submenuTimerRef.current) {
            clearTimeout(submenuTimerRef.current);
        }
        submenuTimerRef.current = setTimeout(() => {
            setShowPlaylistSubmenu(false);
        }, 300);
    };

    const handleSubmenuEnter = () => {
        if (submenuTimerRef.current) {
            clearTimeout(submenuTimerRef.current);
        }
    };

    const handleSubmenuLeave = () => {
        submenuTimerRef.current = setTimeout(() => {
            setShowPlaylistSubmenu(false);
        }, 300);
    };

    const handleAddToPlaylistClick = (playlistId, playlistName) => {
        onAddToPlaylist(playlistId, playlistName);
        onClose();
    };

    const handleEditClick = () => {
        onEdit();
        onClose();
    };

    const handleRemoveClick = () => {
        onRemove();
        onClose();
    };

    if (!open || !anchorEl) return null;

    const isOwnedByUser = song?.ownerEmail === localStorage.getItem('userEmail');

    // Calculate menu position - ensure it stays on screen
    const anchorRect = anchorEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Position main menu
    let menuLeft = anchorRect.left;
    let menuTop = anchorRect.bottom + 8;
    
    // Ensure menu stays on screen
    if (menuLeft + 180 > viewportWidth) {
        menuLeft = viewportWidth - 180 - 8; // Move left if too far right
    }
    if (menuTop + 200 > viewportHeight) {
        menuTop = anchorRect.top - 200; // Move above if too low
    }
    
    const menuStyle = {
        position: 'fixed',
        top: menuTop,
        left: menuLeft,
        minWidth: '180px',
        zIndex: 1300,
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        overflow: 'hidden'
    };

    // Position submenu - place it to the right of "Add to Playlist" item
    let submenuLeft = menuLeft + 180; // Position to right of main menu
    let submenuTop = menuTop;
    
    // If submenu would go off screen, position it to the left instead
    if (submenuLeft + 200 > viewportWidth) {
        submenuLeft = menuLeft - 200 - 8; // Position to left of main menu
    }
    
    const submenuStyle = {
        position: 'fixed',
        left: submenuLeft,
        top: submenuTop,
        minWidth: '200px',
        maxHeight: '300px',
        overflowY: 'auto',
        zIndex: 1301,
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box>
                {/* Main Menu */}
                <Paper sx={menuStyle} ref={menuRef}>
                    <List sx={{ py: 0 }}>
                        {/* Add to Playlist Item */}
                        <ListItem
                            ref={addToPlaylistItemRef}
                            button
                            onMouseEnter={handleAddToPlaylistHover}
                            onMouseLeave={handleAddToPlaylistLeave}
                            sx={{
                                py: 1.5,
                                px: 2,
                                '&:hover': {
                                    backgroundColor: '#C8ABFF'
                                },
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <ListItemText 
                                primary="Add to Playlist"
                                primaryTypographyProps={{
                                    fontSize: '0.95rem',
                                    fontWeight: 'medium'
                                }}
                            />
                            {playlists.length > 0 && (
                                <Typography sx={{ color: '#888', ml: 1 }}>›</Typography>
                            )}
                        </ListItem>
                        
                        {/* Edit Song Item */}
                        {isOwnedByUser && (
                            <ListItem
                                button
                                onClick={handleEditClick}
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: '#C8ABFF'
                                    }
                                }}
                            >
                                <ListItemText 
                                    primary="Edit Song"
                                    primaryTypographyProps={{
                                        fontSize: '0.95rem',
                                        fontWeight: 'medium'
                                    }}
                                />
                            </ListItem>
                        )}
                        
                        {/* Remove from Catalog Item */}
                        {isOwnedByUser && (
                            <ListItem
                                button
                                onClick={handleRemoveClick}
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: '#C8ABFF'
                                    }
                                }}
                            >
                                <ListItemText 
                                    primary="Remove from Catalog"
                                    primaryTypographyProps={{
                                        fontSize: '0.95rem',
                                        fontWeight: 'medium'
                                    }}
                                />
                            </ListItem>
                        )}
                    </List>
                </Paper>
                
                {/* Playlist Sub-menu */}
                {showPlaylistSubmenu && playlists.length > 0 && (
                    <Paper 
                        sx={submenuStyle}
                        ref={submenuRef}
                        onMouseEnter={handleSubmenuEnter}
                        onMouseLeave={handleSubmenuLeave}
                    >
                        <Box sx={{ 
                            p: 1, 
                            borderBottom: '1px solid #e0e0e0',
                            backgroundColor: '#F5F5F5'
                        }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    fontWeight: 'bold',
                                    color: '#6750A4',
                                    px: 1
                                }}
                            >
                                Add to Playlist:
                            </Typography>
                        </Box>
                        <List dense sx={{ py: 0, maxHeight: '250px', overflow: 'auto' }}>
                            {playlists.map((playlist) => (
                                <ListItem
                                    key={playlist._id}
                                    button
                                    onClick={() => handleAddToPlaylistClick(playlist._id, playlist.name)}
                                    sx={{
                                        py: 1,
                                        px: 2,
                                        '&:hover': {
                                            backgroundColor: '#C8ABFF'
                                        }
                                    }}
                                >
                                    <ListItemText 
                                        primary={playlist.name}
                                        primaryTypographyProps={{
                                            fontSize: '0.9rem',
                                            fontWeight: 'medium'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
}