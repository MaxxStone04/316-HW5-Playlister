// server/models/song-model.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const songSchema = new Schema(
    {
        title: { type: String, required: true },
        artist: { type: String, required: true },
        year: { type: Number, required: true },
        youTubeId: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        listens: { type: Number, default: 0 },
        playlistCount: { type: Number, default: 0 }
    },
    { timestamps: true },
)

songSchema.index({ title: 1, artist: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Song', songSchema)