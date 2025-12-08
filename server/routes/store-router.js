/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const StoreController = require('../controllers/store-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, StoreController.createPlaylist)
router.delete('/playlist/:id', auth.verify, StoreController.deletePlaylist)
router.get('/playlist/:id', auth.verify, StoreController.getPlaylistById)
router.get('/playlistpairs', auth.verify, StoreController.getPlaylistPairs)
router.get('/playlists', auth.verify, StoreController.getPlaylists)
router.put('/playlist/:id', auth.verify, StoreController.updatePlaylist)
router.post('/playlists/search', auth.verify, StoreController.searchPlaylists)
router.post('/songs/search', auth.verify, StoreController.searchSongs)
router.post('/playlists/sort', auth.verify, StoreController.sortPlaylists)
router.post('/songs/sort', auth.verify, StoreController.sortSongs)
router.post('playlist/:id/dup', auth.verify, StoreController.dupPlaylist)
router.post('/songs', auth.verify, StoreController.addSongToCatalog)
router.delete('/songs/:id', auth.verify, StoreController.removeSongFromCatalog)

module.exports = router