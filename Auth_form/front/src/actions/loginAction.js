import {LOGIN_LOAD_IN_PROGRESS, LOGIN_LOAD_FAIL,LOGIN_LOAD_FAIL_PASS_USER,  LOGIN_OK} from './type';
import axios from 'axios';


const actionLoginLoad = (data) => {
    const action = {
        type: LOGIN_LOAD_IN_PROGRESS, payload: 'Loading...'
    };
    return action
}

const actionLoginOk = async (data) => {
    const result = await axios.post('/apiAuthRouter/login',data);

    if(result.status !== 200){
        const action = {type:LOGIN_LOAD_FAIL, payload: 'Login Fail'};
        return action
    }

    const action = {type:LOGIN_OK, payload:result.data };
    return action;
}

const regUser = async (dispatch, data) => {
    dispatch( actionLoginLoad());
    dispatch(await actionLoginOk(data));
}

export { regUser };