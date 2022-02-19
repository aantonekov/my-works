const urlAlbum = window.location.href.split('/');
const albumName = urlAlbum[6];
const albumId = urlAlbum[7];
const photograph = urlAlbum[5];

const albumInfoForUser = async () => {
    const { data } = await axios.post('/gallery/photoalbum/info', {albumId,  photograph});
    return data.albumData;
};

const userBlock = async () => {
    const { userProfile, docAlbum } = await albumInfoForUser();

    const htmlUser = `
        <div class="avatarPhotograph">
            <img src="${userProfile.userPhoto}" alt="${photograph}">
        </div>
        <div class="namePhotograph">
            <div><p>${userProfile.firstName}</p></div>
            <div><p>${userProfile.secondName}</p></div>
        </div>
        <div class="emailPhotograph">
            <p>${userProfile.email}</p>
        </div>`;

    document.querySelector('.photographInfo').innerHTML = htmlUser;

};

const photosBlock = async () => {
    const { docAlbum } = await albumInfoForUser();

    const albumYear = new Date(docAlbum.date).getFullYear();
    const albumMonth = new Date(docAlbum.date).getMonth();
    const albumDate = new Date(docAlbum.date).getDate();
    const albumFullDate = `${albumYear}-${albumMonth}-${albumDate}`;

    const htmlGeneral = `
        <div class="albumName"><p>${docAlbum.name}</p></div>
        <div class="albumDate"><p>${albumFullDate}</p></div>
        <div class="albumDescription"><p>${docAlbum.description}</p></div>
        <div class="pricePhoto">Price: <b><span>${docAlbum.images[0].price}</span></b> UAH</div>`;
    document.querySelector('.generalInfo').innerHTML = htmlGeneral;

    const cards = docAlbum.images.reduce( (acc, item) => {
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

    document.querySelector('.photosBlock').innerHTML = cards;

};

const run = () => {
    userBlock();
    photosBlock();
};
run();

document.querySelector('.reviewOrderBtn').addEventListener('click', (ev) => {
    document.querySelector('.orderConteiner').classList.remove('hidden');
});

document.querySelector('.closeBtn').addEventListener('click', (ev) => {
    document.querySelector('.orderConteiner').classList.add('hidden');
});

const photoChoosenForm = document.forms.photoChoosenForm;
photoChoosenForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const checkInp = formData.getAll('check');
    renderReviewOrder(checkInp);

    const confirmOrderBtn = document.querySelector('.confirmOrderBtn');
    confirmOrderBtn.addEventListener('click', async (ev) => {
        ev.preventDefault();

        document.querySelector('.orderConteiner').classList.add('hidden');
        document.querySelector('.albumPhotos').classList.add('hidden');
        document.querySelector('.orderConfirmToPay').classList.remove('hidden');

        const { docAlbum } = await albumInfoForUser();
        const orderInfo = {
            photoId: checkInp,
            photoPrice: docAlbum.images[0].price,
            photoCount: checkInp.length
        };

        const { data } = await axios.post('/gallery/photoalbum/orderInfo', orderInfo);
        
        const orderId = data.orderDoc.orderId;
        renderOrder(data);

        const orderToPayForm = document.forms.orderToPayForm;
        orderToPayForm.addEventListener('submit', async (ev) => {
            ev.preventDefault();

            const formData = new FormData(ev.target);
            formData.append('orderId', orderId);

            const { data } = await axios.post('/gallery/photoalbum/userOrderInfo', formData);
            console.log('userInfo: ', data);

            if (data.reason === 'Ok') {
                window.location = `${data.url}`;
            }

        });
    });
});

const renderReviewOrder = async (data) => {

    const { docAlbum } = await albumInfoForUser();

    const countOrderPhoto = data.length;
    const htmlTesumeOrder = `
        <div class="countOrder">Count: <span>${countOrderPhoto}</span> photos</div>
        <div class="amountOrder">Total: <span>${docAlbum.images[0].price * countOrderPhoto}</span> UAH</div>`;

    document.querySelector('.resumeOrder').innerHTML = htmlTesumeOrder;

    let images = '';
    data.forEach( (id) => {
        docAlbum.images.forEach( (elem) => {
            if(elem._id === id) {
                const htmlImgOrder = `<div class="itemImg"><img src="${elem.imageSrc}" value="${elem._id}" class="inpCheck" ></div>`;
                images = `${images}${htmlImgOrder}`;
            };
        });
    });

    document.querySelector('.photoImgOrder').innerHTML = images;
};

const renderOrder = async (data) => {
    const { docAlbum } = await albumInfoForUser();

    const htmlOrderNumber = `Order # <span>${data.orderDoc.orderId}</span>`;
    document.querySelector('.numberlOrder').innerHTML = htmlOrderNumber;

    let images = '';
    data.orderDoc.products.photoId.forEach( (id) => {
        docAlbum.images.forEach( (elem) => {
            if(elem._id === id) {
                const htmlImgOrder = `<div class="chossingPhoto"><img src="${elem.imageSrc}" value="${elem._id}"></div>`;
                images = `${images}${htmlImgOrder}`;
            };
        });
    });
    document.querySelector('.photoOrder').innerHTML = images;

    const htmlTotalSum = `
        <div>COUNT <span>${data.orderDoc.products.photoId.length}</span></div>
        <div>AMOUNT <span>${data.orderDoc.amount.sum}</span> UAH</div>`;
    document.querySelector('.totalOrder').innerHTML = htmlTotalSum;
};

