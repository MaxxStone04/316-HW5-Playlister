const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const User = require('./models/user-model');
const Playlist = require('./models/playlist-model');
const Song = require('./models/song-model');

// Default password for all migrated users (should be changed by users)
const DEFAULT_PASSWORD = 'password123';

class DataMigrator {
    constructor() {
        this.userMap = new Map(); // email -> User document
        this.songMap = new Map(); // key -> Song document
        this.playlistCounts = new Map(); // songId -> count
        this.processedSongs = new Set(); // Track songs for stats
    }

    async connect() {
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/playlister', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }

    async clearDatabase() {
        try {
            await User.deleteMany({});
            await Playlist.deleteMany({});
            await Song.deleteMany({});
            console.log('Cleared existing database');
        } catch (error) {
            console.error('Error clearing database:', error);
            throw error;
        }
    }

    // Generate a unique key for a song
    getSongKey(song) {
        return `${song.title.toLowerCase()}|${song.artist.toLowerCase()}|${song.year}`;
    }

    // Validate and clean YouTube ID
    cleanYouTubeId(youtubeId) {
        if (!youtubeId) return 'dQw4w9WgXcQ'; // Default if missing
        
        // Extract ID from various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([A-Za-z0-9_-]{11})$/
        ];
        
        for (const pattern of patterns) {
            const match = youtubeId.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return youtubeId; // Return as-is if no pattern matches
    }

    // Process users from the old format
    async processUsers(usersData) {
        console.log('Processing users...');
        
        for (const userData of usersData) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ email: userData.email });
                if (existingUser) {
                    this.userMap.set(userData.email, existingUser);
                    continue;
                }

                // Create new user
                const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
                
                const newUser = new User({
                    userName: userData.name || userData.email.split('@')[0],
                    email: userData.email,
                    passwordHash: hashedPassword,
                    avatar: null, // No avatar in old data
                    playlists: []
                });

                await newUser.save();
                this.userMap.set(userData.email, newUser);
                console.log(`Created user: ${userData.email}`);
            } catch (error) {
                console.error(`Error processing user ${userData.email}:`, error.message);
            }
        }
    }

    // Extract all unique songs from playlists
    async extractSongs(playlistsData) {
        console.log('Extracting unique songs...');
        
        for (const playlist of playlistsData) {
            for (const songData of playlist.songs) {
                const key = this.getSongKey(songData);
                
                if (!this.songMap.has(key)) {
                    try {
                        // Clean the song data
                        const cleanedSong = {
                            title: songData.title || 'Unknown Title',
                            artist: songData.artist || 'Unknown Artist',
                            year: parseInt(songData.year) || 2000,
                            youTubeId: this.cleanYouTubeId(songData.youTubeId),
                            ownerEmail: playlist.ownerEmail,
                            listens: Math.floor(Math.random() * 10000), // Random initial listens
                            playlistCount: 0 // Will be updated later
                        };

                        // Check for duplicate song
                        const existingSong = await Song.findOne({
                            title: cleanedSong.title,
                            artist: cleanedSong.artist,
                            year: cleanedSong.year
                        });

                        if (existingSong) {
                            this.songMap.set(key, existingSong);
                        } else {
                            const newSong = new Song(cleanedSong);
                            await newSong.save();
                            this.songMap.set(key, newSong);
                            console.log(`Created song: ${cleanedSong.title} by ${cleanedSong.artist}`);
                        }
                    } catch (error) {
                        console.error(`Error processing song ${songData.title}:`, error.message);
                    }
                }
            }
        }
    }

    // Update playlist counts for songs
    async updateSongPlaylistCounts(playlistsData) {
        console.log('Updating song playlist counts...');
        
        // Reset counts
        for (const song of this.songMap.values()) {
            song.playlistCount = 0;
            await song.save();
        }

        // Count occurrences
        for (const playlist of playlistsData) {
            const songKeysInPlaylist = new Set();
            
            for (const songData of playlist.songs) {
                const key = this.getSongKey(songData);
                songKeysInPlaylist.add(key);
            }

            // Update counts for unique songs in this playlist
            for (const key of songKeysInPlaylist) {
                const song = this.songMap.get(key);
                if (song) {
                    song.playlistCount += 1;
                    await song.save();
                }
            }
        }
    }

    // Process playlists
    async processPlaylists(playlistsData) {
        console.log('Processing playlists...');
        
        for (const playlistData of playlistsData) {
            try {
                // Check if user exists, create if not
                let user = this.userMap.get(playlistData.ownerEmail);
                if (!user) {
                    console.log(`Creating missing user: ${playlistData.ownerEmail}`);
                    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
                    
                    user = new User({
                        userName: playlistData.ownerEmail.split('@')[0],
                        email: playlistData.ownerEmail,
                        passwordHash: hashedPassword,
                        avatar: null,
                        playlists: []
                    });
                    
                    await user.save();
                    this.userMap.set(playlistData.ownerEmail, user);
                }

                // Create playlist with embedded songs
                const playlistSongs = playlistData.songs.map(songData => {
                    const key = this.getSongKey(songData);
                    const song = this.songMap.get(key);
                    
                    return {
                        title: songData.title || 'Unknown Title',
                        artist: songData.artist || 'Unknown Artist',
                        year: parseInt(songData.year) || 2000,
                        youTubeId: this.cleanYouTubeId(songData.youTubeId)
                    };
                });

                // Clean playlist name
                const playlistName = playlistData.name || `Playlist ${Date.now()}`;
                
                const newPlaylist = new Playlist({
                    name: playlistName,
                    ownerEmail: playlistData.ownerEmail,
                    songs: playlistSongs,
                    listeners: Math.floor(Math.random() * 500) // Random initial listeners
                });

                await newPlaylist.save();

                // Update user's playlists array
                user.playlists.push(newPlaylist._id);
                await user.save();

                console.log(`Created playlist: ${playlistName} (${playlistSongs.length} songs)`);
            } catch (error) {
                console.error(`Error processing playlist ${playlistData.name}:`, error.message);
            }
        }
    }

    // Generate statistics report
    async generateReport() {
        console.log('\n=== Migration Report ===');
        
        const userCount = await User.countDocuments();
        const playlistCount = await Playlist.countDocuments();
        const songCount = await Song.countDocuments();
        
        console.log(`Users: ${userCount}`);
        console.log(`Playlists: ${playlistCount}`);
        console.log(`Unique Songs: ${songCount}`);

        // Get top songs by playlist count
        const topSongs = await Song.find().sort({ playlistCount: -1 }).limit(5);
        console.log('\nTop 5 Songs (by playlist count):');
        topSongs.forEach((song, index) => {
            console.log(`${index + 1}. ${song.title} by ${song.artist} - in ${song.playlistCount} playlists`);
        });

        // Get top playlists by song count
        const playlists = await Playlist.find();
        const playlistsBySongCount = playlists
            .map(p => ({ name: p.name, count: p.songs.length }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        
        console.log('\nTop 5 Playlists (by song count):');
        playlistsBySongCount.forEach((playlist, index) => {
            console.log(`${index + 1}. ${playlist.name} - ${playlist.count} songs`);
        });
    }

    // Main migration function
    async migrate(filePath) {
        try {
            console.log('Starting data migration...');
            
            // Read and parse JSON file
            const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
            
            // Clear existing data
            await this.clearDatabase();
            
            // Process data
            if (data.users) {
                await this.processUsers(data.users);
            }
            
            if (data.playlists) {
                await this.extractSongs(data.playlists);
                await this.updateSongPlaylistCounts(data.playlists);
                await this.processPlaylists(data.playlists);
            }
            
            // Generate report
            await this.generateReport();
            
            console.log('\n✅ Data migration completed successfully!');
            
        } catch (error) {
            console.error('Migration failed:', error);
            throw error;
        }
    }
}

// Run the migration
async function main() {
    const migrator = new DataMigrator();
    
    try {
        await migrator.connect();
        
        // Path to your PlaylisterData.json file
        const dataFilePath = path.join(__dirname, 'PlaylisterData.json');
        
        // Check if file exists
        try {
            await fs.access(dataFilePath);
        } catch {
            console.error(`File not found: ${dataFilePath}`);
            console.log('Please place PlaylisterData.json in the server directory');
            process.exit(1);
        }
        
        await migrator.migrate(dataFilePath);
        
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await migrator.disconnect();
    }
}

// Run if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = DataMigrator;