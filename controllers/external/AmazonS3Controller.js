
var AWS            = require('aws-sdk'),
    config         = require('../../config/config');

//set properties
AWS.config.accessKeyId     = config.s3.accessKeyId;
AWS.config.secretAccessKey = config.s3.secretAccessKey;
AWS.config.region          = config.s3.region;
AWS.config.logger          = process.stdout;

// get S3 manager
var s3              = new AWS.S3({params: {Bucket: config.s3.bucket}});

/**
 *  Upload song to s3
 * @param reqData should contain name or for updating key..
 * @param callBack
 * @returns {*}
 */
exports.uploadSong = function (reqData, callBack) {
    var fileName = reqData.name,
        data     = new Buffer(reqData.songfile, 'base64'),
        params;
        key = fileName + config.s3.extension;
    params = {
        Key : config.s3.songFolder + '/' + key,
        Body: data
    };
    s3.upload(params, function (error, respObj) {
        if (error) {
            logger.error("[s3][uploadSong] Error uploading data: ", error);
            callBack({success: false, msg: 'Unable to upload song.'});
        } else {
            callBack({success: true, path: config.s3.cloudfront_url + config.s3.songFolder + '/' + key});
        }
    });
};