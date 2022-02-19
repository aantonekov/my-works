const birthdayElem = document.querySelector('.birthday');
const createPwdUserElem = document.querySelector('.createPwdUser');
const pwdUserRepeatElem = document.querySelector('.pwdUserRepeat');

const checkingAgeElem = document.querySelector('.checkingAge');
const checkingPwdElem = document.querySelector('.checkingPwd');

const loginAgainElem = document.querySelector('.loginAgain');
const singNewUserElem = document.querySelector('.singNewUser');
const singUserElem = document.querySelector('.singUser');

const loginForm = document.forms.loginForm;
loginForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const { data } = await axios.post('/auth/loginWindow', formData);
    console.log(data);

    if (data.status === 'invalid data') {
        document.querySelector('.loginWindow').classList.add('hidden');
        document.querySelector('.messageDeclare').classList.remove('hidden');
        return;
    }
    else if (data.loginUser.status === "client not declare" ) {
        document.querySelector('.loginWindow').classList.add('hidden');
        document.querySelector('.messageDeclare').classList.remove('hidden');
    }
    else if (data.loginUser.status ==='Failed checking passwords') {
        document.querySelector('.loginWindow').classList.add('hidden');
        document.querySelector('.messageDeclare').classList.remove('hidden');
        return;
    }

    
    localStorage.setItem('accessToken', data.loginUser.payload.accessToken);
    localStorage.setItem('refreshToken', data.loginUser.payload.refreshToken);

    window.location.href = '/albums/myAlbums';
});

singNewUserElem.addEventListener('click', (ev) => {
    ev.preventDefault();

    document.querySelector('.signWindow').classList.remove('hidden');
    document.querySelector('.messageDeclare').classList.add('hidden');
    document.querySelector('.loginWindow').classList.add('hidden');
});

singUserElem.addEventListener('click', (ev) => {
    ev.preventDefault();

    document.querySelector('.signWindow').classList.remove('hidden');
    document.querySelector('.messageDeclare').classList.add('hidden');
    document.querySelector('.loginWindow').classList.add('hidden');
});


loginAgainElem.addEventListener('click', (ev) => {
    ev.preventDefault();

    document.querySelector('.loginWindow').classList.remove('hidden');
    document.querySelector('.messageDeclare').classList.add('hidden');
});


const signForm = document.forms.signForm;
signForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);

    const birthday = formData.get('birthday');
    const birthYear = new Date(birthday).getFullYear();
    const nowYear = new Date().getFullYear();
    const age = nowYear - birthYear;

    if( age < 18) {
        birthdayElem.classList.add('mistake');
        checkingAgeElem.classList.remove('hidden');
        return;
    }
    else if ( age > 18 ) {
        birthdayElem.classList.remove('mistake');
        checkingAgeElem.classList.add('hidden');
    };

    const pwdUser = formData.get('pwdUser');
    const pwdRepeat = formData.get('pwdRepeat');

    if ( pwdUser !== pwdRepeat ) {
        createPwdUserElem.classList.add('mistake');
        pwdUserRepeatElem.classList.add('mistake');
        checkingPwdElem.classList.remove('hidden');
        return;
    }
    else if ( pwdUser === pwdRepeat ) {
        createPwdUserElem.classList.remove('mistake');
        pwdUserRepeatElem.classList.remove('mistake');
        checkingPwdElem.classList.add('hidden');
    };

    formData.append('age', age);

    const { data } = await axios.post('/auth/signWindow', formData);
    
    window.location.href = '/';

})