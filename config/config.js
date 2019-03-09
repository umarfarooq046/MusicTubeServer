module.exports = {
    port: 3002,
    mongodbConfig: {
        driver: 'mongodb',
        host: 'localhost',
        port: '27017',
        dbName: 'MusicTube',
        adminDB: 'adminConfig'
    },
    s3                    : {
        "accessKeyId"       : "-------------",
        "secretAccessKey"   : "--------------------",
        "region"            : "us-east-1",
        "bucket"            : "test-us-east1-bucket",
        songFolder          : 'songs',
        extension           : '.mp3',
        cloudfront_url      : "http://test.cloudfront.net/"
    }
}