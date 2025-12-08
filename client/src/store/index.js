import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import {jsTPS} from "jstps"
import storeRequestSender from './requests'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
import AddSongToPlaylist_Transaction from '../transactions/AddSongToPlaylist_Transaction'
import EditPlaylistName_Transaction from '../transactions/EditPlaylistName_Transaction'
import RemoveSongFromPlaylist_Transaction from '../transactions/RemoveSongFromPlaylist_Transaction'
import DuplicateSong_Transaction from '../transactions/DuplicateSong_Transaction'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SET_PLAYLIST_SEARCH_RESULTS: "SET_PLAYLIST_SEARCH_RESULTS",
    SET_SONG_SEARCH_RESULTS: "SET_SONG_SEARCH_RESULTS",
    SET_PLAYLIST_SORT: "SET_PLAYLIST_SORT",
    SET_SONG_SORT: "SET_SONG_SORT",
    SET_CURRENT_PLAYLIST: "SET_CURRENT_PLAYLIST",
    SET_CURRENT_SONG: "SET_CURRENT_SONG",
    SET_EDIT_MODE: "SET_EDIT_MODE",
    SET_GUEST_MODE: "SET_GUEST_MODE"
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    PLAY_PLAYLIST: "PLAY_PLAYLIST",
    EDIT_PLAYLIST: "EDIT_PLAYLIST",
    SELECT_AVATAR: "SELECT_AVATAR",
    ADD_SONG_TO_PLAYLIST: "ADD_SONG_TO_PLAYLIST"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,

        playlistSearch: {
            name: '',
            userName: '',
            songTitle: '',
            songArtist: '',
            songYear: ''
        },

        songSearch: {
            title: '',
            artist: '',
            year: ''
        },

        playlistSort: 'listeners-hi-lo',
        songSort: 'listens-hi-lo',
        currentPlaylists:[],
        currentSongs: [],
        guestMode: false,
        editPlaylistData: null,
        currentPlaylist: null,
        currentPlaylistIndex: 0,
        isPlayling: false,
        avatarData: null,
        isGuest: false
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    
    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {

            case GlobalStoreActionType.SET_PLAYLIST_SEARCH_RESULTS: {
                return setStore({
                    ...store,
                    currentPlaylists: payload.playlists
                });
            }
            case GlobalStoreActionType.SET_SONG_SEARCH_RESULTS: {
                return setStore({
                    ...store,
                    currentSongs: payload.songs
                });
            }
            case GlobalStoreActionType.SET_PLAYLIST_SORT: {
                return setStore({
                    ...store,
                    playlistSort: payload.sortType
                });
            } 
            case GlobalStoreActionType.SET_SONG_SORT: {
                return setStore({
                    ...store,
                    songSort: payload.sortType
                });
            }
            case GlobalStoreActionType.SET_CURRENT_PLAYLIST: {
                return setStore({
                    ...store,
                    currentPlaylist: payload.playlist,
                    currentPlaylistIndex: 0,
                    isPlaying: true,
                    currentModal: CurrentModal.PLAY_PLAYLIST
                });
            }
            case GlobalStoreActionType.SET_CURRENT_SONG: {
                return setStore({
                    ...store,
                    currentPlaylistIndex: payload.index
                });
            }
            case GlobalStoreActionType.SET_EDIT_MODE: {
                return setStore({
                    ...store,
                    editPlaylistData: payload.data,
                    currentModal: CurrentModal.EDIT_PLAYLIST
                });
            }
            case GlobalStoreActionType.SET_SONG_TO_REMOVE: {
                return setStore({
                    ...store,
                    currentModal: CurrentModal.REMOVE_SONG,
                    songToRemove: payload.song
                });
            }
            case GlobalStoreActionType.SET_GUEST_MODE: {
                return setStore({
                    ...store,
                    isGuest: payload.isGuest
                });
            }
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            default:
                return store;
        }
    }

    store.searchPlaylists = async function (searchParams) {
        try {
            const response = await fetch('http://localhost:4000/store/playlists/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchParams),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                storeReducer({
                    type: GlobalStoreActionType.SET_PLAYLIST_SEARCH_RESULTS,
                    payload: { playlists: data.playlists }
                });
            }
        } catch (error) {
            console.error("Error searching for a playlist with that query", error);
        }
    }

    store.searchSongs = async function (searchParams) {
        try {
            const response = await fetch('http://localhost:4000/store/songs/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchParams),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                storeReducer({
                    type: GlobalStoreActionType.SET_SONG_SEARCH_RESULTS,
                    payload: { songs: data.songs }
                });
            }
        } catch (error) {
            console.error("Error searching for songs with that query", error);
        }
    }

    store.sortPlaylists = async function (sortType) {
        try {
            const [field, order] = sortType.split('-');
            const response = await fetch('http://localhost:4000/store/playlists/sort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ field, order }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                storeReducer({
                    type: GlobalStoreActionType.SET_PLAYLIST_SORT,
                    payload: { sortType }
                });
                storeReducer({
                    type: GlobalStoreActionType.SET_PLAYLIST_SEARCH_RESULTS,
                    payload: { playlists: data.playlists }
                });
            }
        } catch (error) {
            console.error("There was an error sorting the playlists:", error);
        }
    }

    store.sortSongs = async function (sortType) {
        try {
            const [field, order] = sortType.split('-');
            const response = await fetch('http://localhost:4000/store/songs/sort', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ field, order }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                storeReducer({
                    type: GlobalStoreActionType.SET_SONG_SORT,
                    payload: { sortType }
                });
                
                storeReducer({
                    type: GlobalStoreActionType.SET_SONG_SEARCH_RESULTS,
                    payload: { songs: data.songs }
                });
            }
        } catch (error) {
            console.error("There was an error sorting the songs: ", error);
        }
    }

    store.playPlaylist = function (playlist) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PLAYLIST,
            payload: { playlist }
        });
    }

    store.nextSong = function () {
        if (store.currentPlaylist) {
            const nextIndex = (store.currentPlaylistIndex + 1) % store.currentPlaylist.songs.length;
            
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SONG,
                payload: { index: nextIndex }
            });
        }
    }

    store.prevSong = function () {
        if (store.currentPlaylist) {
            const prevIndex = store.currentPlaylistIndex > 0 ? store.currentPlaylistIndex - 1 : store.currentPlaylist.songs.length - 1;

            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_SONG,
                payload: { index: prevIndex }
            });
        }
    }

    store.togglePlayPause = function () {
        setStore({
            ...store,
            isPlayling: !store.isPlayling
        });
    }

    store.closePlaylistModal = function () {
        setStore({
            ...store,
            currentModal: CurrentModal.NONE,
            currentPlaylist: null,
            currentPlaylistIndex: 0,
            isPlayling: false
        });
    }

    store.editPlaylist = function (playlist) {
        storeReducer({
            type: GlobalStoreActionType.SET_EDIT_MODE,
            payload: { data: playlist }
        });
    }

    store.closeEditModal = function() {
        setStore({
            ...store,
            currentModal: CurrentModal.NONE,
            editPlaylistData: null
        });
    }

    store.copyPlaylist = async function (playlistId) {
        try {
            const response = await fetch(`http://localhost:4000/store/playlist/${playlistId}/dup`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();

                store.loadIdNamePairs();
                return data.playlist;
            }
        } catch (error) {
            console.error("There was an error copying the playlist: ", error)
        }
    }

    store.addSongToCatalog = async function (songData) {
        try {
            const response = await fetch('http://localhost:4000/store/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(songData),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                return data.song;
            }
        } catch (error) {
            console.error("There was an error adding a song to the catalog: ", error);
        }
    }

    store.showAvatarModal = function () {
        setStore({
            ...store,
            currentModal: CurrentModal.SELECT_AVATAR
        });
    }

    store.showAddSongToPlaylistModal = function (song) {
        setStore({
            ...store,
            currentModal: CurrentModal.ADD_SONG_TO_PLAYLIST,
            currentSong: song
        });
    }

    store.showRemoveSongModal = function (songId, song) {
        setStore({
            ...store,
            currentModal: CurrentModal.REMOVE_SONG,
            songToRemove: song
        });
    }

    store.showEditSongModal = function (index, song) {
        setStore({
            ...store,
            currentModal: CurrentModal.EDIT_SONG,
            currentSongIndex: index,
            currentSong: song
        });
    }

    store.showSelectAvatarModal = function () {
        setStore({
            ...store,
            currentModal: CurrentModal.SELECT_AVATAR
        });
    }

    store.showAddSongToPlaylistModal = function (song) {
        setStore({
            ...store,
            currentModal: CurrentModal.ADD_SONG_TO_PLAYLIST,
            currentSong: song
        })
    }

    store.setGuestMode = function (isGuest) {
        storeReducer({
            type: GlobalStoreActionType.SET_GUEST_MODE,
            payload: { isGuest: isGuest }
        });
    }

    store.addEditPlaylistNameTransaction = function (playlistId, oldName, newName) {
        const transaction = new EditPlaylistName_Transaction(this, playlistId, oldName, newName);
        tps.addTransaction(transaction);
        tps.doTransaction();
    }

    store.addSongToPlaylistTransaction = function (playlistId, song, index) {
        const transaction = new AddSongToPlaylist_Transaction(this, playlistId, song, index);
        tps.addTransaction(transaction);
        tps.doTransaction();
    }

    store.addRemoveSongFromPlaylistTransaction = function (playlistId, song, index) {
        const transaction = new RemoveSongFromPlaylist_Transaction(this, playlistId, song, index);
        tps.addTransaction(transaction);
        tps.doTransaction();
    }

    store.addDuplicateSongTransaction = function (playlistId, song, index) {
        const transaction = new DuplicateSong_Transaction(this, playlistId, song, index);
        tps.addTransaction(transaction);
        tps.doTransaction();
    }

    store.addSongToPlaylist = async function (playlistId, song, index) {
        try { 
            const response = await fetch(`http://localhost:4000/store/playlist/${playlistId}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const playlist = data.playlist;

                playlist.songs.splice(index, 0, song);

                await fetch(`http://localhost:4000/store/playlist/${playlistId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ playlist }),
                    credentials: 'include'
                });
            }
        } catch (error) {
            console.error("There was an error adding the song to the playlist: ", error);
        }
    }

    store.removeSongFromPlaylist = async function (playlistId, index) {
        try {
            const response = await fetch(`http://localhost:4000/store/playlist/${playlistId}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const playlist = data.playlist;

                playlist.songs.splice(index, 1);

                await fetch(`http://localhost:4000/store/playlist/${playlistId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ playlist }),
                    credentials: 'include'
                });
            }
        } catch (error) {
            console.error("There was an error removing the song from the plalyist: ", error);
        }
    }

    store.setAddingToPlaylist = function (playlistId) {
        setStore({
            ...store,
            addingToPlaylistId: playlistId
        });
    }

    store.tryAcessingOtherAccountPlaylist = function(){
        let id = "635f203d2e072037af2e6284";
        async function asyncSetCurrentList(id) {
            let response = await storeRequestSender.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncSetCurrentList(id);
        history.push("/playlist/635f203d2e072037af2e6284");
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await storeRequestSender.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await storeRequestSender.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await storeRequestSender.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                store.setCurrentList(id);
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await storeRequestSender.createPlaylist(newListName, [], auth.user.email);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/playlist/" + newList._id);
        }
        else {
            console.log("FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        if (store.isGuest) {
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: []
            });
            return;
        }

        async function asyncLoadIdNamePairs() {
            const response = await storeRequestSender.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await storeRequestSender.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await storeRequestSender.deletePlaylistById(id);
            store.loadIdNamePairs();
            if (response.data.success) {
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
        
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.hideModals = () => {
        auth.errorMessage = null;
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isErrorModalOpen = () => {
        return store.currentModal === CurrentModal.ERROR;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await storeRequestSender.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
                const playlistId = playlist._id || playlist.id;
                history.push("/playlist/" + playlistId);
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", new Date().getFullYear(), "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.year = songData.year;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", new Date().getFullYear(), "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, year, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            year: year,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.processTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.processTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = (song, index) => {
        //let index = store.currentSongIndex;
        //let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.processTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            year: song.year,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.processTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await storeRequestSender.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToDo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    function KeyPress(event) {
        if (!store.modalOpen && event.ctrlKey){
            if(event.key === 'z'){
                store.undo();
            } 
            if(event.key === 'y'){
                store.redo();
            }
        }
    }
  
    document.onkeydown = (event) => KeyPress(event);

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };