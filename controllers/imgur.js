const imgur = require('imgur');
imgur.setAPIUrl('https://api.imgur.com/3/');

const sendImagesToImgur = async (images) => {
    const albumId = process.env.Album_Id
    const uploadType = 'Base64'
    imgur.setClientId(process.env.Client_Id)
    console.log(imgur.getClientId())

    /* imgur.setCredentials(process.env.email, process.env.password, process.env.Client_Id) */
    
    try {
        console.log(process.env.Client_Id)
        const uploaded = await imgur.uploadImages(images, uploadType, albumId)
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    sendImagesToImgur
}