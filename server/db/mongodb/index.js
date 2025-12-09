const DatabaseManager = require('../index');
const mongoose = require('mongoose');
const User = require('../../models/user-model');
const Playlist = require('../../models/playlist-model');
const Song = require('../../models/song-model');

class MongoDBManager extends DatabaseManager {
    constructor() {
        super();
        this.isConnected = false;
        this.isInitialized = false;
    }

    async ensureInitialized() {
        if (!this.isInitialized) {
            await this.connect();
        }
    }

    async connect() {
        if (this.isConnected) {
            return;
        }

        const mongoConnect = process.env.MONGO_CONNECT || 'mongodb://127.0.0.1:27017/playlister';

        try {
            await mongoose.connect(mongoConnect, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            this.isConnected = true;
            this.isInitialized = true;
            console.log('MongoDB connected!');
        } catch (error) {
            console.log('MongoDB connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        if (!this.isConnected) {
            return;
        }

        await mongoose.disconnect();
        this.isConnected = false;
        this.isInitialized = false;
        console.log('MongoDB disconnected');
    }

    async clearDatabase() {
        try {
            await User.deleteMany({});
            await Playlist.deleteMany({});
            await Song.deleteMany({});
            console.log('MongoDB database cleared');
        } catch(error) {
            console.error('Error clearing MongoDB Database:', error);
            throw error;
        }
    }

    async resetDatabase(testData) {
        try {
            await this.clearDatabase();

            for (let userData of testData.users) {
                await this.createUser(userData);
            }

            for (let playlistData of testData.playlists) {
                await this.createPlaylist(playlistData);
            }

            console.log('MongoDB Database successfully reset with data');
        } catch (error) {
            console.error('Error resetting MongoDB Database:', error);
            throw error;
        }
    }

    async createUser(userData) {
        await this.ensureInitialized();
        const user = new User(userData);
        return await user.save();
    }

    async getUserById(id) {
        await this.ensureInitialized();
        return await User.findById(id);
    }

    async getUserByEmail(email) {
        await this.ensureInitialized();
        return await User.findOne({ email });
    }

    async getUsersByPartialName(userName) {
        await this.ensureInitialized();
        return await User.find({
            $or: [
                { firstName: { $regex: userName, $options: 'i' } },
                { lastName: { $regex: userName, options: 'i' } },
                { userName: { $regex: userName, $options: 'i' } } 
            ]
        });
    }

    async getPlaylistsByQuery(query) {
        await this.ensureInitialized();
        return await Playlist.find(query);
    }

    async getAllPlaylists() {
        await this.ensureInitialized();
        return await Playlist.find({});
    }

    async getSongsByQuery(query) {
        await this.ensureInitialized();
        return await Song.find(query); 
    }

    async getSongByDetails(title, artist, year) {
        await this.ensureInitialized();
        return await Song.findOne({ title, artist, year });
    }

    async createSong(songData) {
        await this.ensureInitialized();
        const song = new Song(songData);
        return await song.save();
    }

    async getSongById(id) {
        await this.ensureInitialized();
        return await Song.findById(id);
    }

    async getAllSongs() {
        await this.ensureInitialized();
        return await Song.find({});
    }

    async updateSong(id, updateData) {
        await this.ensureInitialized();
        return await Song.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteSong(id) {
        await this.ensureInitialized();
        return await Song.findByIdAndDelete(id);
    }

    async removeSongFromAllPlaylists(songId) {
        await this.ensureInitialized();
        
        // Find all playlists containing this song
        const playlists = await Playlist.find({ 'songs._id': songId });
        
        // Update each playlist to remove the song
        for (let playlist of playlists) {
            // Filter out the song
            playlist.songs = playlist.songs.filter(song => {
                // Handle both string and ObjectId comparisons
                const songIdStr = songId.toString ? songId.toString() : songId;
                const songIdInPlaylist = song._id ? song._id.toString() : song;
                return songIdInPlaylist !== songIdStr;
            });
            await playlist.save();
            
            // Decrement playlistCount on the song
            const song = await Song.findById(songId);
            if (song) {
                song.playlistCount = Math.max(0, (song.playlistCount || 0) - 1);
                await song.save();
            }
        }
        
        return playlists.length;
    }

    async incrementSongPlaylistCount(songId) {
        await this.ensureInitialized();
        return await Song.findByIdAndUpdate(
            songId,
            { $inc: { playlistCount: 1 } },
            { new: true }
        );
    }

    async incrementSongListens(songId) {
        await this.ensureInitialized();
        return await Song.findByIdAndUpdate(
            songId,
            { $inc: { listens: 1 } },
            { new: true }
        );
    }

    async getSongsByOwnerEmail(ownerEmail) {
        await this.ensureInitialized();
        return await Song.find({ ownerEmail });
    }

    async searchSongs(query) {
        await this.ensureInitialized();
        return await Song.find(query);
    }

    async updateUser(id, updateData) {
        await this.ensureInitialized();
        return await User.findByIdAndUpdate(id, updateData, {new : true });
    }

    async deleteUser(id) {
        await this.ensureInitialized();
        return await User.findByIdAndDelete(id);
    }

    /*
    * Playlist methods 
    */
    async createPlaylist(playlistData) {
        await this.ensureInitialized();
        const playlist = new Playlist(playlistData);
        return await playlist.save();
    }

    async getPlaylistById(id) {
        await this.ensureInitialized();
        return await Playlist.findById(id);
    }

    async getPlaylistsByOwnerEmail(ownerEmail) {
        await this.ensureInitialized();
        return await Playlist.find({ ownerEmail });
    }

    async updatePlaylist(id, updateData) {
        await this.ensureInitialized();
        return await Playlist.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deletePlaylist(id) {
        await this.ensureInitialized();
        return await Playlist.findByIdAndDelete(id);
    }

    async getUserPlaylists(userId) {
        await this.ensureInitialized();
        const user = await User.findById(userId).populate('playlists');
        return user ? user.playlists : [];
    }

    async getPlaylistPairsByOwnerEmail(ownerEmail) {
        await this.ensureInitialized();
        const playlists = await Playlist.find({ ownerEmail });
        return playlists.map(playlist => ({
            _id: playlist._id,
            name: playlist.name,
            listenerCount: playlist.listenerCount
        }));
    }

    async getAllPublicPlaylists() {
        await this.ensureInitialized();
        return await Playlist.find({});
    }
}

module.exports = MongoDBManager;