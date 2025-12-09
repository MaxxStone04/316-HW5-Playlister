const BASE_URL = 'http://localhost:4000/store';

async function fetchHandler(url, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options
        });

        let data = {};
        
        // Try to parse JSON only if there's content
        if (response.status !== 204) {
            try {
                data = await response.json();
            } catch (jsonError) {
                console.warn('Failed to parse JSON response:', jsonError);
            }
        }

        if (!response.ok) {
            const error = new Error(data.errorMessage || `HTTP ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return {
            status: response.status,
            data: data,
        };
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// THESE ARE ALL THE REQUESTS WE'LL BE MAKING
export const createPlaylist = (newListName, newSongs, userEmail) => {
    return fetchHandler(`/playlist/`, {
        method: 'POST',
        body: JSON.stringify({
            name: newListName,
            songs: newSongs,
            ownerEmail: userEmail
        })
    });
}

export const deletePlaylistById = (id) => fetchHandler(`/playlist/${id}`, {
    method: 'DELETE'
});

export const getPlaylistById = (id) => fetchHandler(`/playlist/${id}`);

export const getPlaylistPairs = () => fetchHandler(`/playlistpairs/`);

export const updatePlaylistById = (id, playlist) => {
    return fetchHandler(`/playlist/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            playlist: playlist
        })
    });
}

// New endpoints for HW5
export const searchPlaylists = (searchParams) => {
    return fetchHandler(`/playlists/search`, {
        method: 'POST',
        body: JSON.stringify(searchParams)
    });
}

export const searchSongs = (searchParams) => {
    return fetchHandler(`/songs/search`, {
        method: 'POST',
        body: JSON.stringify(searchParams)
    });
}

export const sortPlaylists = (sortParams) => {
    return fetchHandler(`/playlists/sort`, {
        method: 'POST',
        body: JSON.stringify(sortParams)
    });
}

export const sortSongs = (sortParams) => {
    return fetchHandler(`/songs/sort`, {
        method: 'POST',
        body: JSON.stringify(sortParams)
    });
}

export const dupPlaylist = (playlistId) => {
    return fetchHandler(`/playlist/${playlistId}/dup`, {
        method: 'POST'
    });
}

export const addSongToCatalog = (songData) => {
    return fetchHandler(`/songs`, {
        method: 'POST',
        body: JSON.stringify(songData)
    });
}

export const removeSongFromCatalog = (songId) => {
    return fetchHandler(`/songs/${songId}`, {
        method: 'DELETE'
    });
}

export const updateSongInCatalog = (songId, songData) => {
    return fetchHandler(`/songs/${songId}`, {
        method: 'PUT',
        body: JSON.stringify(songData)
    });
}

export const incrementSongListens = (songId) => {
    return fetchHandler(`/songs/${songId}/listen`, {
        method: 'PUT'
    });
}

const apis = {
    createPlaylist,
    deletePlaylistById,
    getPlaylistById,
    getPlaylistPairs,
    updatePlaylistById,
    searchPlaylists,
    searchSongs,
    sortPlaylists,
    sortSongs,
    dupPlaylist,
    addSongToCatalog,
    removeSongFromCatalog
}

export default apis;