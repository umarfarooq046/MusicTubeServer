var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({
    name    : {type: String, unique: false, required: true},
    length  : {type: String, unique: false, required: true},
    artists : [{type: String, unique: false, required: true}],
    genre   : {type: String, unique: false, required: true},
    path    : {type: String, unique: false, required: false},
});

console.info("[MusicTubeModels.Song] Song model created...");

module.exports = mongoose.model('Song', SongSchema);