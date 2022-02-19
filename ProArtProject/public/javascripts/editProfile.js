const tokenCheckInfo = async () => {
    const accessToken = localStorage.getItem('accessToken');
        const tokens = {accessToken: accessToken};
    const { data } = await axios.post('/profile', tokens);

    if (data.status === 'not user') {
        window.location.href = '/';
        return;
    }
};

const tokenUserInfo = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const tokens = {accessToken: accessToken, refreshToken: refreshToken}

    const { data } = await axios.post('/profile/currentProfile', tokens);

    if (data.status === 'not user') {
        window.location.href = '/';
        return;
    }

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data;
};

const card = async () => {
    const userInfo = await tokenUserInfo();

    const currentInfoElem = document.querySelector('.currentInformation');
    const currentInfo = `
        <h3 class="currentInfo">Current profile</h3>
        <div class="currentFirstName"><p>${userInfo.profile.firstName}</p></div>
        <div class="currentSecondName"><p>${userInfo.profile.secondName}</p></div>
        <div class="currentBirthday"><p>${userInfo.profile.birthday}</p></div>
        <div class="currentEmail"><p>${userInfo.profile.email}</p></div>
        <div class="currentPhone"><p>${userInfo.profile.phone}</p></div>`;

    currentInfoElem.innerHTML = currentInfo;
};

const run = () => {
    tokenCheckInfo();
    card();
};
run();

document.querySelector('.profileInfo').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.querySelector('.editPhotogrpherProfile').classList.remove('hidden');
});

document.querySelector('.upMenu').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.querySelector('.editPhotogrpherProfile').classList.add('hidden');
});

document.querySelector('.pwdInfo').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.querySelector('.editPassword').classList.remove('hidden');
});

document.querySelector('.upMenuPass').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.querySelector('.editPassword').classList.add('hidden');
});

const editProfileForm = document.forms.editProfileForm;
editProfileForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const userInfo = await tokenUserInfo();
    const userId = userInfo.profile.id;

    const formData = new FormData(ev.target);

    const birthday = formData.get('birthday');
    const birthYear = new Date(birthday).getFullYear();
    const nowYear = new Date().getFullYear();
    const age = nowYear - birthYear;
    
    formData.append('age', age);
    formData.append('userId', userId);

    const { data } = await axios.post('/profile/editProf', formData);

    if (data.status === 'ok') {
        document.querySelector('.editPhotogrpherProfile').classList.add('hidden');
        document.querySelector('.message').classList.remove('hidden');
    };

});

const editPasswordForm = document.forms.editPasswordForm;
editPasswordForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const userInfo = await tokenUserInfo();
    const userId = userInfo.profile.id;

    const formData = new FormData(ev.target);

    const pwdUser = formData.get('pwdUser');
    const pwdRepeat = formData.get('pwdRepeat');

    if ( pwdUser !== pwdRepeat ) {
        document.querySelector('.newPassword').classList.add('mistake');
        document.querySelector('.repeatPassword').classList.add('mistake');
        document.querySelector('.checkingPwd').classList.remove('hidden');
        return;
    }
    else if ( pwdUser === pwdRepeat ) {
        document.querySelector('.newPassword').classList.remove('mistake');
        document.querySelector('.repeatPassword').classList.remove('mistake');
        document.querySelector('.checkingPwd').classList.add('hidden');
    };
    
    formData.append('userId', userId);
    const { data } = await axios.post('/profile/editPass', formData);

    if(data.userChangePwd.status === 'success') {
        document.querySelector('.editProfilePass').classList.add('hidden');
        document.querySelector('.successPwd').classList.remove('hidden');
    }

});
