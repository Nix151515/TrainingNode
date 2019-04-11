// https://valor-software.com/ng2-file-upload/
let multer = require('multer');
let fs = require('fs');
let upload = multer({dest : './files'});

getFiles = function (req, res) {
    console.log("Downloading files");
    res.status(200).send("Get files");
}

setFiles = function (req, res) {
    console.log("Uploading files");
    upload(req, res, function (err) {
        if (err) {
          return res.status(400).send(err.toString());
        }
        res.status(200).send('File is uploaded');
      });
    res.status(200).send("set files");

}

module.exports = {getFiles, setFiles};