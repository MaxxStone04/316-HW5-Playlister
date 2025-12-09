// REMOVE THIS LINE:
// const { incrementSongListens } = require('../../client/src/store/requests');

// KEEP this:
const auth = require('../auth')
const { createDatabaseManager } = require('../db/create-Database-Manager')
const dbManager = createDatabaseManager();

/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/

createPlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    
    try {
        const user = await dbManager.getUserById(req.userId);

        const playlistData = {...body, ownerEmail: user.email};
        const playlist = await dbManager.createPlaylist(playlistData);
        
        const playlistId = playlist._id || playlist.id;
        const currentPlaylists = user.playlists || [];
        const updatedPlaylists = [...currentPlaylists, playlistId];

        await dbManager.updateUser(req.userId, { playlists: updatedPlaylists });

        return res.status(201).json({
            playlist: playlist
        })
    } catch (error) {
        console.error('Error creating playlist:', error);
        return res.status(400).json({
            errorMessage: 'Playlist Not Created!'
        })
    }
}

deletePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    
    try {
        const playlist = await dbManager.getPlaylistById(req.params.id);
        
        if (!playlist) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        const user = await dbManager.getUserByEmail(playlist.ownerEmail);
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        
        if (playlist.ownerEmail === user.email) {
            
            const currentPlaylists = user.playlists || [];
            const updatedPlaylists = currentPlaylists.filter(pid => {
                const pidString = pid.toString();
                const targetIdString = req.params.id.toString();
                return pidString !== targetIdString;
            });
            await dbManager.updateUser(user._id, { playlists: updatedPlaylists });
            
            await dbManager.deletePlaylist(req.params.id);
            
            return res.status(200).json({});
        } else {
            return res.status(400).json({ 
                errorMessage: "Authentication Error" 
            });
        }
    } catch (error) {
        console.error("Error with deleting the playlist:", error);
        return res.status(400).json({ 
            errorMessage: 'Error deleting playlist' 
        });
    }
}

getPlaylistById = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    try {
        const list = await dbManager.getPlaylistById(req.params.id);
        if (!list) {
            return res.status(400).json({ 
                success: false, 
                errorMessage: 'Playlist not found' 
            });
        }

        // DOES THIS LIST BELONG TO THIS USER?
        const user = await dbManager.getUserById(req.userId);

        if (list.ownerEmail === user.email) {
            return res.status(200).json({ 
                success: true, 
                playlist: list 
            })
        } else {
            return res.status(400).json({ 
                success: false, 
                errorMessage: "Authentication Error" 
            });
        }
    } catch (error) {
        console.error("Error Retrieving Playlist:", error);
        return res.status(400).json({ 
            success: false, 
            errorMessage: error 
        });
    }
}

getPlaylistPairs = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    
    try {
        const user = await dbManager.getUserById(req.userId);
        
        const playlists = await dbManager.getPlaylistPairsByOwnerEmail(user.email);
        
        if (!playlists || playlists.length === 0) {
            return res.status(200).json({ 
                success: true, 
                idNamePairs: [] 
            })
        } else {
            return res.status(200).json({ 
                success: true, 
                idNamePairs: playlists 
            })
        }
    } catch (error) {
        console.error("Error Retrieving Playlist Pairs:", error);
        return res.status(400).json({ 
            success: false, 
            errorMessage: error 
        })
    }
}

getPlaylists = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    
    try {
        const user = await dbManager.getUserById(req.userId);
        const playlists = await dbManager.getPlaylistsByOwnerEmail(user.email);
        
        return res.status(200).json({ 
            success: true, 
            data: playlists 
        })
    } catch (error) {
        console.error("Error Retrieving Playlists", error);
        return res.status(400).json({ 
            success: false, 
            errorMessage: error 
        })
    }
}

updatePlaylist = async (req, res) => {
    if(auth.verifyUser(req) === null){
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            errorMessage: 'You must provide a body to update',
        })
    }

    try {
        const playlist = await dbManager.getPlaylistById(req.params.id);
        
        if (!playlist) {
            return res.status(404).json({
                errorMessage: 'Playlist not found'
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        const user = await dbManager.getUserByEmail(playlist.ownerEmail);

        if (playlist.ownerEmail === user.email) {

            const updatedPlaylist = await dbManager.updatePlaylist(req.params.id, {
                name: body.playlist.name,
                songs: body.playlist.songs
            });
            
            return res.status(200).json({
                success: true,
                id: updatedPlaylist._id,
                message: 'Playlist updated!',
            })
        } else {
            return res.status(400).json({ 
                success: false, 
                errorMessage: "Authentication Error" });
        }
    } catch (error) {
        console.log("Error Updating Playlist", error);
        return res.status(404).json({
            errorMessage: 'Playlist not updated!',
        })
    }
}

searchPlaylists = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({
            success: false,
            errorMessage: 'UNAUTHORIZED'
        });
    }
    
    const { name, userName, songTitle, songArtist, songYear } = req.body;
    
    try {
        // Get the logged-in user
        const loggedInUser = await dbManager.getUserById(req.userId);
        if (!loggedInUser) {
            return res.status(401).json({
                success: false,
                errorMessage: 'User not found'
            });
        }
        
        let query = {};
        
        // Default: show user's own playlists when no search criteria
        if (!name && !userName && !songTitle && !songArtist && !songYear) {
            query.ownerEmail = loggedInUser.email;
        } else {
            // Build search query based on criteria
            if (name) {
                query.name = { $regex: name, $options: 'i' };
            }
            
            if (userName) {
                const users = await dbManager.getUsersByPartialName(userName);
                const userEmails = users.map(u => u.email);
                query.ownerEmail = { $in: userEmails };
            }
            
            // For song-related searches, we need to look inside songs array
            if (songTitle || songArtist || songYear) {
                query['songs'] = { $exists: true, $ne: [] };
            }
        }
        
        let playlists = await dbManager.getPlaylistsByQuery(query);
        
        // Filter by song criteria if needed
        if (songTitle || songArtist || songYear) {
            playlists = playlists.filter(playlist => {
                return playlist.songs.some(song => {
                    let matches = true;
                    if (songTitle) {
                        matches = matches && song.title.toLowerCase().includes(songTitle.toLowerCase());
                    }
                    if (songArtist) {
                        matches = matches && song.artist.toLowerCase().includes(songArtist.toLowerCase());
                    }
                    if (songYear) {
                        matches = matches && song.year.toString().includes(songYear);
                    }
                    return matches;
                });
            });
        }
        
        return res.status(200).json({
            success: true,
            playlists: playlists
        });
    } catch (error) {
        console.error("Error searching playlists:", error);
        return res.status(400).json({
            success: false,
            errorMessage: error.message
        });
    }
}

searchSongs = async (req, res) => {
    // Allow both authenticated users and guests to search songs
    // Remove the auth check or make it optional for this endpoint
    
    const { title, artist, year } = req.body;
    
    try {
        // Build search criteria
        const searchCriteria = {};
        
        if (title && title.trim() !== '') {
            searchCriteria.title = { $regex: title.trim(), $options: 'i' };
        }
        
        if (artist && artist.trim() !== '') {
            searchCriteria.artist = { $regex: artist.trim(), $options: 'i' };
        }
        
        if (year && year !== '') {
            const yearNum = parseInt(year);
            if (!isNaN(yearNum)) {
                searchCriteria.year = yearNum;
            }
        }
        
        // Use the searchSongs method instead of getSongsByQuery
        const songs = await dbManager.searchSongs(searchCriteria);
        
        return res.status(200).json({
            success: true,
            songs: songs
        });
    } catch (error) {
        console.error("Error searching songs:", error);
        return res.status(400).json({
            success: false,
            errorMessage: error.message || 'Failed to search songs'
        });
    }
}

sortPlaylists = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({
            success: false,
            errorMessage: 'Unauthorized User!'
        });
    }
    
    const { field, order } = req.body;
    
    try {
        let playlists = await dbManager.getAllPlaylists();
        
        playlists.sort((a, b) => {
            switch (field) {
                case 'listeners':
                    return order === 'desc' ? (b.listeners - a.listeners) : (a.listeners - b.listeners);
                case 'name':
                    return order === 'desc' ? 
                        b.name.localeCompare(a.name) : 
                        a.name.localeCompare(b.name);
                case 'userName':
                    return order === 'desc' ? 
                        b.ownerEmail.localeCompare(a.ownerEmail) : 
                        a.ownerEmail.localeCompare(b.ownerEmail);
                default:
                    return 0;
            }
        });
        
        return res.status(200).json({
            success: true,
            playlists: playlists
        });
    } catch (error) {
        console.error("Error sorting playlists:", error);
        return res.status(400).json({
            success: false,
            errorMessage: error.message
        });
    }
}

sortSongs = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({
            success: false,
            errorMessage: 'UNAUTHORIZED'
        });
    }
    
    const { field, order } = req.body;
    
    try {
        let songs = await dbManager.getAllSongs();
        
        songs.sort((a, b) => {
            switch (field) {
                case 'listens':
                    return order === 'desc' ? (b.listens - a.listens) : (a.listens - b.listens);
                case 'playlistCount':
                    return order === 'desc' ? (b.playlistCount - a.playlistCount) : (a.playlistCount - b.playlistCount);
                case 'title':
                    return order === 'desc' ? 
                        b.title.localeCompare(a.title) : 
                        a.title.localeCompare(b.title);
                case 'artist':
                    return order === 'desc' ? 
                        b.artist.localeCompare(a.artist) : 
                        a.artist.localeCompare(b.artist);
                case 'year':
                    return order === 'desc' ? (b.year - a.year) : (a.year - b.year);
                default:
                    return 0;
            }
        });
        
        return res.status(200).json({
            success: true,
            songs: songs
        });
    } catch (error) {
        console.error("Error sorting songs:", error);
        return res.status(400).json({
            success: false,
            errorMessage: error.message
        });
    }
}

dupPlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({
            success: false,
            errorMessage: 'Unauthorized User'
        });
    }
    
    try {
        const originalPlaylist = await dbManager.getPlaylistById(req.params.id);
        if (!originalPlaylist) {
            return res.status(404).json({
                success: false,
                errorMessage: 'Playlist not found'
            });
        }
        
        const user = await dbManager.getUserById(req.userId);
        
        const newPlaylistData = {
            name: `${originalPlaylist.name} (Copy)`,
            ownerEmail: user.email,
            songs: JSON.parse(JSON.stringify(originalPlaylist.songs)),
            listeners: 0
        };
        
        const newPlaylist = await dbManager.createPlaylist(newPlaylistData);
        
        return res.status(201).json({
            success: true,
            playlist: newPlaylist
        });
    } catch (error) {
        console.error("Error duplicating playlist:", error);
        return res.status(400).json({
            success: false,
            errorMessage: error.message
        });
    }
}

addSongToCatalog = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({
            success: false,
            errorMessage: 'UNAUTHORIZED'
        });
    }
    
    const { title, artist, year, youTubeId } = req.body;
    
    try {
        // Validate required fields
        if (!title || !artist || !year || !youTubeId) {
            return res.status(400).json({
                success: false,
                errorMessage: 'All fields are required: title, artist, year, youTubeId'
            });
        }
        
        const user = await dbManager.getUserById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                errorMessage: 'User not found'
            });
        }
        
        // Check for duplicate song (same title, artist, year)
        const existingSong = await dbManager.getSongByDetails(title, artist, parseInt(year));
        if (existingSong) {
            return res.status(409).json({
                success: false,
                errorMessage: 'A song with this title, artist, and year already exists'
            });
        }
        
        const songData = {
            title: title.trim(),
            artist: artist.trim(),
            year: parseInt(year),
            youTubeId: youTubeId.trim(),
            ownerEmail: user.email,
            listens: 0,
            playlistCount: 0
        };
        
        const newSong = await dbManager.createSong(songData);
        
        return res.status(201).json({
            success: true,
            song: newSong
        });
    } catch (error) {
        console.error("Error adding song to catalog:", error);
        
        // Handle duplicate key error
        if (error.code === 11000 || error.message.includes('duplicate key')) {
            return res.status(409).json({
                success: false,
                errorMessage: 'A song with this title, artist, and year already exists'
            });
        }
        
        return res.status(400).json({
            success: false,
            errorMessage: error.message || 'Failed to add song to catalog'
        });
    }
}

removeSongFromCatalog = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(401).json({
            success: false,
            errorMessage: 'UNAUTHORIZED'
        });
    }
    
    try {
        const song = await dbManager.getSongById(req.params.id);
        if (!song) {
            return res.status(404).json({
                success: false,
                errorMessage: 'Song not found'
            });
        }
        
        const user = await dbManager.getUserById(req.userId);
        
        if (song.ownerEmail !== user.email) {
            return res.status(403).json({
                success: false,
                errorMessage: 'You can only remove songs you own'
            });
        }
        
        await dbManager.removeSongFromAllPlaylists(song._id);
        
        await dbManager.deleteSong(req.params.id);
        
        return res.status(200).json({
            success: true,
            message: 'Song removed from catalog'
        });
    } catch (error) {
        console.error("Error removing song from catalog:", error);
        return res.status(400).json({
            success: false,
            errorMessage: error.message
        });
    }
}

searchAllPlaylists = async (req, res) => {
    const { name, userName, songTitle, songArtist, songYear } = req.body;

    try {
        let query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i'}
        }

        if (userName) {
            const users = await dbManager.getUsersByPartialName(userName);
            const userEmails = users.map(user => user.email);
            query.ownerEmail = { $in: userEmails };
        }

        let playlists = await dbManager.getPlaylistsByQuery(query);

        if (songTitle || songArtist || songYear) {
            playlists = playlists.filter(playlist => {
                if (!playlist.songs || playlist.songs.length === 0) {
                    return false;
                }

                return playlist.songs.some(song => {
                    let matches = true;
                    if (songTitle) {
                        matches = matches && song.title.toLowerCase().includes(songTitle.toLowerCase());
                    }

                    if (songArtist) {
                        matches = matches && song.artist.toLowerCase().includes(songArtist.toLowerCase());
                    }

                    if (songYear) {
                        matches = matches && song.year.toString().includes(songYear);
                    }
                    return matches;
                });
            });
        }

        return res.status(200).json({
            success: true,
            playlists: playlists
        });

    } catch (error) {
        console.error("There was an error searching all the playlists: ", error);
        return res.status(400).json({
            success: false,
            errorMessage: error.message
        });
    }
}

getAllPlaylists = async (req, res) => {
    try {
        const playlists = await dbManager.getAllPublicPlaylists();

        return res.status(200).json({
            success: true,
            playlists: playlists
        });
        
    } catch (error) {
        console.error("There was an error getting all the playlists:", error);
        return res.status(400).json({
            success: false,
            errorMessage: error.message
        });
    }
}

incrementPlaylistCount = async (req, res) => {
    try {
        const song = await dbManager.getSongById(req.params.id);
        if (!song) {
            return res.status(404).json({
                success: false,
                errorMessage: 'Song not found'
            });
        }
        
        song.playlistCount = (song.playlistCount || 0) + 1;
        await song.save();
        
        return res.status(200).json({
            success: true,
            playlistCount: song.playlistCount
        });
    } catch (error) {
        console.error("Error incrementing playlist count:", error);
        return res.status(500).json({
            success: false,
            errorMessage: 'Internal server error'
        });
    }
}

// Add this function (missing from your exports)
incrementSongListens = async (req, res) => {
    try {
        const song = await dbManager.getSongById(req.params.id);
        if (!song) {
            return res.status(404).json({
                success: false,
                errorMessage: 'Song not found'
            });
        }
        
        song.listens = (song.listens || 0) + 1;
        await song.save();
        
        return res.status(200).json({
            success: true,
            listens: song.listens
        });
    } catch (error) {
        console.error("Error incrementing song listens:", error);
        return res.status(500).json({
            success: false,
            errorMessage: 'Internal server error'
        });
    }
}

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    searchPlaylists,
    searchSongs,
    sortPlaylists,
    sortSongs,
    dupPlaylist,
    addSongToCatalog,
    removeSongFromCatalog,
    searchAllPlaylists,
    getAllPlaylists,
    incrementSongListens,  // Add this to exports
    incrementPlaylistCount
};