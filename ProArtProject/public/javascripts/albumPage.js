const tokenCheckInfo = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const tokens = {accessToken: accessToken};
    
    const { data } = await axios.post('/albums/myAlbums', tokens);

    if (data.status === 'not user') {
        window.location.href = '/';
        return;
    };
};

const url = window.location.href.split('/');
const albumId = url[5];
const albumName = url[4];

document.querySelector('.titleAlbum').innerHTML = albumName;

const imagesFromAlbums = async () => {
    const accessToken = localStorage.getItem('accessToken');

    const dataSend = {
        accessToken: accessToken,
        id: albumId
    }
    const { data } = await axios.post('/albums/imagesInfo', dataSend);

    imagesCards(data);
    return(data);
};
imagesFromAlbums()

document.querySelector('.backMenuBtn').addEventListener('click', (ev) => {
    ev.preventDefault();
    history.back();
});

document.querySelector('.addImgBtn').addEventListener('click', (ev) => {
    ev.preventDefault();

    document.querySelector('.albumImagesConteiner').classList.add('hidden');
    document.querySelector('.addImageBlock').classList.remove('hidden');
});

document.querySelector('.backAlbBtn').addEventListener('click', (ev) => {
    ev.preventDefault();

    document.querySelector('.albumImagesConteiner').classList.remove('hidden');
    document.querySelector('.addImageBlock').classList.add('hidden');
});

const imagesCards = async (data) => {
    // const {imagesData} = await imagesFromAlbums();

    document.querySelector('.descrption').innerHTML = `<b>Description:</b> ${data.imagesData.description}`;

    const checkBoxImgElem = document.querySelector('.checkBoxImg');

    const cards = data.imagesData.images.reduce( (acc, item) => {
        acc = `${acc}
        <div class="imageBlock">
            <label class="checkInp" >
                <input type="checkbox" name="check" value="${item._id}"/>
                <span></span>
            </label>
            <img src="${item.imageSrc}" alt="${albumName}" class="impCheck" >
        </div>`;
        return acc;
    }, '');

    checkBoxImgElem.innerHTML = cards;
};

const addImagesForm = document.forms.addImagesForm
addImagesForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    formData.append('id', albumId);
    const { data } = await axios.post('/albums/addImagesToAlbum', formData);

    if (data.status === 'invalid data') {
        document.querySelector('.addImage').classList.add('hidden');
        document.querySelector('.warnUploadImgMsg').classList.remove('hidden');
    }
    else if (data.imagesPush.status === 'dublicate image name') {
        document.querySelector('.addImage').classList.add('hidden');
        document.querySelector('.warnMsg').classList.remove('hidden');
    }
    else {
        window.location.href = `/albums/${albumName}/${albumId}`
    };

});

const checkedImagesForm = document.forms.checkedImagesForm;
checkedImagesForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const inputElem = formData.getAll('check');

    const dataSend = { inputElem, albumId}
    const { data } = await axios.post('/albums/imgArr', dataSend);
    console.log(data);

    if (data.status === 'ok') {
        window.location.href = `/albums/${albumName}/${albumId}`
    };
});
