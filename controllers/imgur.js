const imgurwrap = require('imgurwrap');
const util = require('util');

const upload = util.promisify(imgurwrap.uploadImageBase64);

const sendImagesToImgur = (images) => {
    imgurwrap.setClientID(process.env.Client_Id);
    const responses = images.map(async image => {
        const response = await upload({ image, title: 'Title', description: 'Description' })
        return response.data;
    })
    return Promise.all(responses)
}

const deleteImageFromImgur = (imageId, cb) => {
    imgurwrap.setClientID(process.env.Client_Id);
    return new Promise((resolve, reject) => {
        imgurwrap.deleteImage(imageId, (err, value) => {
            if (err) {
                reject(err)
            } else {
                resolve(value)
            }            
        });
    })
}
 


module.exports = {
    sendImagesToImgur,
    deleteImageFromImgur
}