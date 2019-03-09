"use strict";
var Song         = require('../../models/Song'),
    s3Controller = require('../external/AmazonS3Controller');


var _this =this;

/**
 * Function to create new song object, and save it to db
 * @param reqData ,data having song details
 * @param callBack ,call this function on completion
 */
exports.createSongMetaData = function(reqData, callBack) {
    // make model of new song
    var song = new Song({
        name:    reqData.name,
        length:  reqData.length,
        artists: reqData.artists,
        genre:   reqData.genre,
        path:    reqData.path,
    });
    
    Song.findOne({
        name: reqData.name
    }, function(err, duplicateSong) {
        if (err) {
            console.log("[ERROR][SongController][createSongMetaData] Add New Song: " + duplicateSong.name + " error:");
            console.error(err);
            return callBack({
                status: -100,
                msg: "Cannot query database"
            });
        }
        else if (duplicateSong) {
            console.log("[ERROR][SongController][createSongMetaData] Add New Song: " + duplicateSong.name + "  Song Already Exists!");
            return callBack({
                status: -1101,
                msg: "Song Already Exists",
                song_id: duplicateSong._id
            });
        } else {
            song.save(function(err) {
                if (err) {
                    // ooops some unknown error
                    console.log("[ERROR][SongController][createSongMetaData][song save] Add New Song with name: " + song.name + " error:");
                    console.error(err);
                    return callBack({
                        status: -1000,
                        msg: err
                    });
                }
                else {
                    // success
                    console.log("[INFO][SongController][createSongMetaData][song save] Add New Song with name: " + song.name + " completed successfully");
                    return callBack({
                        status: 100,
                        song_id: song._id,
                        msg: "New song has been added"
                    });
                }
            });
        }
    });
};


exports.addSong = function(req, res) {
    var errors;
    // validate request params
    req.checkBody('name', 'song name is not valid').notEmpty();
    req.checkBody('length', 'song length is not valid').notEmpty();
    req.checkBody('genre', 'song genre is not valid').notEmpty();
    req.checkBody('artists', 'artists are not valid').notEmpty();
    req.checkBody('songfile', 'song file is not valid').notEmpty();

    console.log('[INFO][Song][addSong] song addition request received.' + req.body.name);

    // execute validations
    errors = req.validationErrors();

    // check if there are some validation errors
    if (errors) {
        console.log('[Error][Song][addSong] validation error for song request Error:');
        console.log(JSON.stringify(errors));
        return res.status(400).json({
            success: false,
            msg: errors,
            create_details: null
        });
    }
    s3Controller.uploadSong(req.body, function (uploadStatus) {
        if (uploadStatus.success == false) {
            res.json(uploadStatus);
        } else {
            //call local function to create song meta data
            req.body.path  = uploadStatus.path;
            _this.createSongMetaData(req.body, function(data) {
                // 100 means new song added successfully
                if (100 === data.status) {
                    console.log('[INFO][Song][addSong] song object created for song name:' + req.body.name + ' id:' + data.song_id);
                    res.json({
                        success: true,
                        'song_creation_status': data,
                        msg: 'Song added successfully..'
                    });
                } else {
                    // song creation failed, may be song already exist.
                    console.log('[ERROR][Song][addSong] unable to add new song:' + data);
                    res.json({
                        success: false,
                        'song_creation_status': data,
                        msg: 'unable to add new song'
                    });
                }
            });
        }
    });
};


exports.GetSongList = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    Song.find({}, 'name', {lean: true}, function(err, songlist) {
        if (err) {
            console.log("[ERROR][SongController][GetSongList] Get Songs  error:");
            console.error(err);
            res.json({
                success: false,
                msg: "Unable to get songs."
            });
        }
        else {
            console.log("[INFO][SongController][GetSongList] Successfully got all songs Song");
            res.json({
                success: true,
                songs: songlist
            });
        }
    });
};


exports.GetSong = function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    Song.findOne({name: req.query.name}, function(err, songlist) {
        if (err) {
            console.log("[ERROR][SongController][GetSongList] Get Songs  error:");
            console.error(err);
            res.json({
                success: false,
                msg: "Unable to get songs."
            });
        }
        else {
            console.log("[INFO][SongController][GetSongList] Successfully got all songs Song");
            res.json({
                success: true,
                songs: songlist
            });
        }
    });
};