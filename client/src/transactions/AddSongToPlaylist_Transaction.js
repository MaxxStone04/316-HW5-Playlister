import { jsTPS_Transaction } from "jstps"

export default class AddSongToPlaylist_Transaction extends jsTPS_Transaction {
    constructor(initStore, playlistId, song, index) {
        super();
        this.store = initStore;
        this.playlistId = playlistId;
        this.song = song;
        this.index = index;
    }

    executeDo() {
        this.store.addSongToPlaylist(this.playlistId, this.song, this.index);
    }
    
    executeUndo() {
        this.store.removeSongFromPlaylist(this.playlistId, this.index);
    }
}