import {USER_LOAD_IN_PROGRESS, USER_LOAD_FAIL, USER_ADD} from './type';
import axios from 'axios';

const actionUserLoad =  (data) => {
    const action = {
        type: USER_LOAD_IN_PROGRESS, payload: 'Loading...'
    };
    return action;
}

const actionUserAdd = async (data) => {
    
    const result = await axios.post(`/apiAuthRouter/registerUser`, data);
    
    if(result.status !== 200) {
        const action = {type: USER_LOAD_FAIL, payload: 'Load Fail =('};
        return action;
    }

    const action = {type: USER_ADD, payload: result.data }

    return action;
}

const regUser = async (dispatch, data) => {
    dispatch( actionUserLoad());
    dispatch(await actionUserAdd(data));
}

export { regUser };