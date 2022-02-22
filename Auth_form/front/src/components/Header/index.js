import style from './style.module.scss';


import {NavLink } from 'react-router-dom';



function Header() {


    return(
        <>
            <header className={style.containerHeader}> 

                <div className={style.containerBtn}>
                    <NavLink className={style.navBtn} to='/UserCab/userInfo'>Личный кабинет</NavLink><br/>
                </div>

                <div className={style.containerBtn}>
                    <NavLink className={style.navBtn} to='/'>Войти</NavLink><br/>
                </div>
               
               
            </header>
        </>
    )
}

export default Header;