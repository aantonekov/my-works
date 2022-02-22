import update from 'immutability-helper'
import {USER_LOAD_IN_PROGRESS, USER_LOAD_FAIL, USER_ADD} from '../actions/type';

const initialState = {
    status: '',
    user:{  }
}


const reducer  =  (state = initialState, action) => {
    
    // console.log('1) initial state:',state);
    // console.log('2) action:', action);
    // console.log('3) action payload:', action.payload );


    switch(action.type){

        case USER_LOAD_IN_PROGRESS:
            {
                return update(state, {status: {$set: action.payload} });
            }
        case USER_LOAD_FAIL: 
            {
                return update(state, {status: {$set: action.payload} });
            }
        case USER_ADD: 
            {
                return update(state, {status: {$set: 'ok'}, user: {$set: action.payload}})
            }
        default: return state;
    }    
}


export default reducer;