import style from './style.module.scss';

import axios from 'axios';


function UserInfo() {

    // const info = async (data) => {
    //     const result = await axios.post('/getProfile', data);
    //     console.log('result:',result);
    // }

    

    return(
        <>         
            <h1>UserInfo</h1>
            <form name='userInfo'>
                <h3>User Information</h3>
                <div>
                    {/* {info()} */}
               
                </div>
            </form>

            
        </>
    )
}

export default UserInfo;