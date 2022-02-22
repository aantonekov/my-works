import style from './style.module.scss';
import Modal from '../../components/Modal'
import arrow from './img/arrow.png'

import * as userAction from '../../actions/registrations';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Input,
  Button,
} from 'antd';
import 'antd/dist/antd.css';

// import { useState, useEffect } from 'react';
import axios from 'axios'

import {NavLink, Navigate } from 'react-router-dom';
import { useState } from 'react';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};


function RegisterUserPage() {
  
  const [modalActive, setModalActive] = useState(true)

  const dispatch = useDispatch();
  
  const user = useSelector(state => state.userStore.user )
  // console.log('4) user:', user);


  const onFinish = async (values) => {

    console.log('Received values of form: ', values);
    // const { data } = await axios.post('/apiRegisterUser', values)

    try {
      await userAction.regUser(dispatch, values)
      

    } catch(err){
      console.log('error:',err);
    }
      
  };

 

 
  
  return (
    <>
      <div className={style.container}>
        

      <div className={style.formContainer}>
        
        <div className ={style.containerHeader}>
            <NavLink className={style.navBtn} to='/'>
              <img className={style.arrowBtn} src={arrow}/>  
            </NavLink><br/>           

            <h1 className={style.forHeader}> Регистрация</h1>
        </div>

        <div className={style.forItems}>
          <Form
              {...formItemLayout}
              // form={form}
              name="register"
              onFinish={onFinish}
              initialValues={{
                residence: ['zhejiang', 'hangzhou', 'xihu'],
                prefix: '86',
              }}
              scrollToFirstError
            >


            <Form.Item
              name="userLogin"
              label="E-mail"
              rules={[
                {
                  type: 'email',
                  message: 'Введен неверный E-mail!',
                },
                {
                  required: true,
                  message: 'Пожалуйста введите ваш E-mail!',
                },
              ]}
            >
              <Input />

            </Form.Item>

            
            <Form.Item
              name="userName"
              label="Имя"
              rules={[{ required: true, message: "Введите свое имя!", whitespace: true }]}
            >
              <Input />
            </Form.Item>   

            <Form.Item
              name="pwd"
              label="Пароль"
              rules={[
                {
                  required: true,
                  message: 'Введите ваш пароль!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            
            

            <Form.Item {...tailFormItemLayout}>
          
              <Button type="primary" htmlType="submit"  > 
              
                  Зарегистрироватся
              </Button>
            </Form.Item>

          </Form>
        </div>  

      </div>
      { user.status === 'ok' ? <Navigate to = "/UserCab/userInfo"/> : user.status === 'dublicate_name' ? 

      <Modal active={ modalActive } setActive={setModalActive} >
          <div className="resStatus">
            <p> Пользователь с таким E-mail уже зарегистрирован!</p>
          </div>
      </Modal>: null }
      

      </div>
    </>
  );
}

export default RegisterUserPage;
