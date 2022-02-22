import style from './style.module.scss';


import UserNav from '../../components/UserCabinet/UserNav'

import UserSettings from '../../components/UserCabinet/UserSettings'



function UserSettingsPage() {

  
  return (
    <>
      <div className={style.container}>
        <UserNav />
        <UserSettings />

      </div>
    </>
  );
}

export default UserSettingsPage;
