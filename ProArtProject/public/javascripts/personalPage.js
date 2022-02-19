const tokenInfo = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const { data } = await axios.post('/userInfo', {accessToken: accessToken});

    document.querySelector('.photographerName').innerHTML = data.profile.login;
    
    const userImage = `<img src="${data.profile.userPhoto}" alt="${data.profile.login}">`
    document.querySelector('.photographerAvatar').innerHTML = userImage;

};
tokenInfo();

const logoutProfileBtn = document.querySelector('.logoutProfile');
logoutProfileBtn.addEventListener('click', async (ev) => {
    ev.preventDefault();

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    window.location.href = '/'
})
