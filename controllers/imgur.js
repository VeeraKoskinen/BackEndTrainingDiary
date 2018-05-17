const imgur = require('imgur');
const imgurwrap = require('imgurwrap');

const fs = require('fs');
/* imgur.setAPIUrl('https://api.imgur.com/3/'); */


const sendImagesToImgur = (images) => {
    /* const albumId = process.env.Album_Id */
    const uploadType = 'Base64'
    imgurwrap.setUserAgent('Chrome/66.0.3359.139'); // Replace if needed with suitable UserAgent
    imgurwrap.setClientID(process.env.Client_Id); 
    imgurwrap.setApiHost('https://api.imgur.com');
    imgurwrap.setApiVersion(3);

    images.map(image => {
        console.log("kuvamapissa")
        
        imgurwrap.uploadImageBase64({
            image: image,
            title: 'Title',
            description: 'Description'
        }, function (err, res) {
            console.log('ERROR',err)
            console.log('sendImagesToImgur metodi imgur controllerissa')
            console.log(res);
        })
    })



}

module.exports = {
    sendImagesToImgur
}