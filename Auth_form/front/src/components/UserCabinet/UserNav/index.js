import style from './style.module.scss';


import { Routes, Route , Link, NavLink } from 'react-router-dom';

function UserNav() {


    return(
        <>
            
            <div className={style.container}>
                    
                <NavLink className={style.navBtn} to='/UserCab/userInfo'>
                    <h3>Личная информация</h3>
                </NavLink>   

                
                <NavLink className={style.navBtn} to='/UserCab/userMeet'>                 
                    <h3>Запланирование встречи</h3>         
                </NavLink>
                    
        
                
                <NavLink className={style.navBtn} to='/UserCab/userSettings'>
                    <h3>Настройки</h3>  
                </NavLink>
                    
        

            </div>
        </>
    )
}

export default UserNav;