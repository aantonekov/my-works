import style from './style.module.scss';

// import { useState, useEffect } from 'react';
// import axios from 'axios'
import { Routes, Route } from "react-router-dom";


import UserNav from '../../components/UserCabinet/UserNav'

import UserMeet from '../../components/UserCabinet/UserMeet'




function UserMeetPage() {

  
  return (
    <>
      <div className={style.container}>
        <UserNav />
        <UserMeet />

      </div>
  
      
     
    </>
  );
}

export default UserMeetPage;
