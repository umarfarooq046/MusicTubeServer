
module.exports = function (server) {
    var io = require('socket.io')(server);
    var current_socket_connections = [];
    var curren_playing_songs = [];
    
    io.on('connection', (socket) =>{
        current_socket_connections.push(socket);
        console.log('a user is connected: ' + socket.id);
    });
    
    io.on('playing_new_song', (songname) =>{
        curren_playing_songs.push(songname);
        for (var i=0;i<current_socket_connections.length;i++) {                                                      current_socket_connections[i].broadcast.emit('current_playing_songs', curren_playing_songs);
        }
    });
    
    io.on('end_song', (songname) =>{
        for( var i = 0; i < curren_playing_songs.length; i++){ 
            if ( curren_playing_songs[i] === songname) {
                curren_playing_songs.splice(i, 1); 
            }
        }
        for (var i=0;i<current_socket_connections.length;i++) {                                                      current_socket_connections[i].broadcast.emit('current_playing_songs', curren_playing_songs);
        }
    });
    
    io.on('disconnect', (socket) =>{
        for( var i = 0; i < current_socket_connections.length; i++){ 
            if ( current_socket_connections[i] === socket) {
                current_socket_connections.splice(i, 1); 
            }
        }
        console.log('a user is disconnected')
    });
};

