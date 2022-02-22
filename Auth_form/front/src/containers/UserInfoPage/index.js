import style from './style.module.scss';

// import { useState, useEffect } from 'react';
// import axios from 'axios'

import UserNav from '../../components/UserCabinet/UserNav'
import UserInfo from '../../components/UserCabinet/UserInfo'




function UserInfoPage() {

  
  return (
    <>
      <div className={style.container}>
        <UserNav />
        <UserInfo />

      </div>
  
      
      
    </>
  );
}

export default UserInfoPage;
