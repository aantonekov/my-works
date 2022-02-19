require('../bin/runners/db/db');
const moment = require('moment');

const userModel = require('../models/userModel');
const albumModel = require('../models/albumModel');

const createAlbum = async (data, fileName) => {

    const dateAlbum = moment().format('YYYY-MM-DD');

    let imageArr = [];
    fileName.forEach( (item) => {
        const userSrc = `/images/galleryImages/${item}`;
        const imageProfile = {
            name: item,
            imageSrc: userSrc,
            price: data.price
        };
        imageArr.push(imageProfile);
    });

    const profile = {
        name: data.name,
        date: dateAlbum,
        description: data.description,
        images: imageArr
    };

    const albumNew = await albumModel.create(profile);

    await userModel.findOneAndUpdate(
        { _id: data.userId },
        { $push: { albums: albumNew.id }}
    );

    return albumNew;
};

const findAlbumInfo = async () => {
    const albumInfo = await albumModel.find({});
    let albumsData = [];
    albumInfo.forEach( (elem) => {
        const album = {
            id: elem._id,
            name: elem.name,
            date: elem.date
        };
        albumsData.push(album);
    })
    return albumsData;
};

const deleteAlbum = async (data) => {

    let status = ''
    data.forEach( async (id) => {
        const albumsData = await albumModel.deleteOne({ _id: id });
        status = 'album was removed';
    });

    return {status: 'album was removed'}
}

const imagesFromAlbums = async (id) => {
    const albumInfo = await albumModel.findOne({ _id: id});
    const data = {
        description: albumInfo.description,
        images: albumInfo.images
    };

    return data;
};

const imagesPushToAlbum = async (id, fileName) => {

    const albumInfo = await albumModel.findOne({ _id: id});

    let result = false;
    albumInfo.images.forEach( (elem) => {
        fileName.forEach( (item) => {
            if (elem.name === item) {
                console.log(elem.name === item)
                result = true;
            }
        });
    });

    if(result === true) {
        return { status: 'dublicate image name' };
    }
    else {
        let imageArr = [];
        fileName.forEach( (item) => {
            const userSrc = `/images/galleryImages/${item}`;
            const imageProfile = {
                name: item,
                imageSrc: userSrc,
            };
            imageArr.push(imageProfile);
        });

        await albumModel.findOneAndUpdate(
            { '_id': id },
            { $push: { images: { $each: imageArr } }}
        );

        return {status: 'ok'};
    };
};

const getImgArrToDelete = async (inputElem, albumId) => {

    inputElem.forEach( async (elem) => {

        await albumModel.findOneAndUpdate(
            { _id: albumId },
            { $pull: { images: { _id: elem } } },
            { new: true }
        )
        .catch(err => console.log(err));
    });

    return { status: 'ok' };
};


module.exports = {
    createAlbum,
    findAlbumInfo,
    deleteAlbum,
    imagesFromAlbums,
    imagesPushToAlbum,
    getImgArrToDelete
};
