const tokenCheckInfo = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const tokens = {accessToken: accessToken};
    
    const { data } = await axios.post('/albums/myAlbums', tokens);

    if (data.status === 'not user') {
        window.location.href = '/';
        return;
    };
};
tokenCheckInfo();

document.querySelector('.createAlbBtn').addEventListener('click', (ev) => {
    ev.preventDefault();

    document.querySelector('.currentAlbums').classList.add('hidden');
    document.querySelector('.createAlbBlock').classList.remove('hidden');
});

document.querySelector('.backMenuBtn').addEventListener('click', (ev) => {
    ev.preventDefault();

    document.querySelector('.currentAlbums').classList.remove('hidden');
    document.querySelector('.createAlbBlock').classList.add('hidden');

});

const dataInfo = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const tokens = {accessToken: accessToken, refreshToken: refreshToken}

    const { data } = await axios.post('./albumsInfo', tokens);
    
    if (data.status === 'not user') {
        window.location.href = '/';
        return;
    }

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    albumView(data);

    return data;
};
dataInfo();

const albumView = async (data) => {
    // const { albums, userProfile } = await dataInfo();

    data.albums.forEach( (elem) => {

        const albumYear = new Date(elem.date).getFullYear();
        const albumMonth = new Date(elem.date).getMonth();
        const albumDate = new Date(elem.date).getDate();

        const album = `${albumYear}-${albumMonth}-${albumDate}`;
    
        const html = `
            <div><label>
                <input type="checkbox" name="albumName" value="${elem.id}"/>
                <span>
                    <a href="/gallery/photoalbum/${data.userProfile.login}/${elem.name}/${elem.id}" class="linkUser">
                        <i class="material-icons center">insert_link</i>
                    </a>
                </span>
                <span>
                    <a href="/albums/${elem.name}/${elem.id}" class="linkAlbum">${elem.name}</a>
                </span>
                <span class="albumDate">${album}</span>
            </label></div>`;
    
        const albumListElem = document.querySelector('.albumList');
        albumListElem.insertAdjacentHTML('beforeend', html);
    });
};

const createAlbumForm = document.forms.createAlbumForm;
createAlbumForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const accessToken = localStorage.getItem('accessToken');
    const formData = new FormData(ev.target);

    formData.append('accessToken', accessToken);

    const { data } = await axios.post('/albums/createAlbum', formData);
    console.log(data);

    if (data.status === 'ok') {
        window.location.href = '/albums/myAlbums';
    }
});

const albumListForm = document.forms.albumListForm;
albumListForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    const albumName = formData.getAll('albumName');

    const { data } = await axios.post('/albums/albumDelete', albumName);
    console.log('albumDel: ', data);

    if(data.status.status === 'album was removed') {
        window.location.href = '/albums/myAlbums';
    };

});
