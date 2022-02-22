import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import  storage  from 'redux-persist/lib/storage';
import userReducer from './user';
import loginReducer from './login';

export default function createReducer(injectReducers = {}) {
    const rootReducer =  combineReducers ({
        userStore: userReducer,
        loginStore: loginReducer,



        //здесь дописывать новые редюсеры

        ...injectReducers
    }) 
    const persistConfig = {key: 'root', storage}
    const presistedReducer = persistReducer(persistConfig, rootReducer) //поключения локал стору  к редаксу 
    return presistedReducer;
 
}