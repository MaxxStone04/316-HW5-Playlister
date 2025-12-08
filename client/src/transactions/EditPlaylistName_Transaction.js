import { jsTPS_Transaction } from "jstps"

export default class EditPlaylistName_Transaction extends jsTPS_Transaction {
    constructor(initStore, playlistId, oldName, newName) {
        super();
        this.store = initStore;
        this.playlistId = playlistId;
        this.oldName = oldName;
        this.newName = newName;
    }

    executeDo() {
        this.store.changeListName(this.playlistId, this.newName);
    }
    
    executeUndo() {
        this.store.changeListName(this.playlistId, this.oldName);
    }
}