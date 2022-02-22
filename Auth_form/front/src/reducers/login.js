import update from 'immutability-helper'
import {LOGIN_LOAD_IN_PROGRESS, LOGIN_LOAD_FAIL, LOGIN_OK} from '../actions/type';

const initialState = {
    status: '',
    loginResult:{  }
}

const reducer  =  (state = initialState, action) => {

    switch(action.type){
        case LOGIN_LOAD_IN_PROGRESS:
            {
                return update(state, {status: {$set: action.payload} });
            }
        case LOGIN_LOAD_FAIL: 
            {
                return update(state, {status: {$set: action.payload} });
            }
        case LOGIN_OK: 
            {
                return update(state, {status: {$set: 'ok'}, loginResult: {$set: action.payload}})
            }
        default: return state;
    }
}

export default reducer;