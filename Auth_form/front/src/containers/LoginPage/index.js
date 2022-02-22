import style from './style.module.scss';
import Modal from '../../components/Modal'
import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';
import { useDispatch, useSelector } from 'react-redux';
import {  NavLink, Navigate } from 'react-router-dom';
import axios from 'axios'
import { useState, useEffect } from 'react';
import * as loginAction from '../../actions/loginAction'

function LoginPage() {

  const [modalActive, setModalActive] = useState(true)

  const dispatch = useDispatch();
  const loginResult = useSelector(state => state.loginStore.loginResult)

  const onFinish = async (values) => {
    console.log('Success:', values);

    try {
      await loginAction.regUser(dispatch, values)
      

    } catch(err){
      console.log('error:',err);
    }
  
  }

 

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
   
  };

  return (
    <div className={style.container}>
        <div className={style.containerForm}>
          <h1 className={style.forHeader} >Авторизация</h1>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="E-mail"
              name="userLogin"
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста ведите ваш E-mail!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            

            <Form.Item
              label="Пароль"
              name="pwd"
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста ведите ваш пароль!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
              <div className='resStatus'></div>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Войти
              </Button>

              <NavLink className={style.regBtn} to='/registerUser'>Зарегистрироватся</NavLink>
            </Form.Item>

           
          </Form>

          {console.log('login status: ', loginResult.status)}


          {loginResult.status === undefined ? null: loginResult.status === 'ok' ? <Navigate to = "/UserCab/userInfo"/> : loginResult.status === "Invalid username or password" || "client not declare" ? 
          <Modal active={ modalActive } setActive={setModalActive} >
            <div className="resStatus">
              <p> Неправельный логин или пароль</p>
            </div>
           </Modal>: null }

        </div>
      </div>
  );
}

export default LoginPage;
