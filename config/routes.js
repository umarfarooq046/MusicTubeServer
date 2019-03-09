var SongController = require('../controllers/internal/SongController');
module.exports = function (app) {
    app.post('/musictube/song/add', SongController.addSong);
    app.get('/musictube/song/get', SongController.GetSongList);
    app.get('/musictube/songdetail/get', SongController.GetSong);
};