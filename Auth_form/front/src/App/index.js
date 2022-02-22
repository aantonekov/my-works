import style from './style.module.scss';

import { Routes, Route } from "react-router-dom";

//containers
import LoginPage from '../containers/LoginPage';
import RegisterUserPage from '../containers/RegisterUserPage';
import UserInfoPages from '../containers/UserInfoPage';
import UserMeetPage from '../containers//UserMeetPage';
import UserSettingsPage from '../containers//UserSettingsPage';


//components
import Header from '../components/Header';



function App() {
  return (
    <>
      <Header />
      <Routes>
          <Route path="/" element={<LoginPage />} /> 
          <Route path="/registerUser" element={<RegisterUserPage />} /> 
          <Route path="/UserCab/userInfo" element={<UserInfoPages/>} /> 
          <Route path="/UserCab/userMeet" element={<UserMeetPage />} /> 
          <Route path="/UserCab/userSettings" element={<UserSettingsPage />} /> 
      </Routes>
    </>      
  );
}

export default App;
