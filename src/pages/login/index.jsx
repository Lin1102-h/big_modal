import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { userAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { useDispatch } from 'react-redux'
import { setUserInfo } from '../../store/userInfo'
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { confirmPassword,...data } = values
      const response = await userAPI[isRegister ? 'register' : 'login'](data);
      debugger
      if (response.code === 200) {
        if (isRegister) {
          message.success('注册成功，请登录');
          setIsRegister(false);
          form.resetFields();
        } else {
          localStorage.setItem('token',response.data.token)
          localStorage.setItem('userId',response.data.user.id)
          dispatch(setUserInfo({ userId: response.data.user.id, token: response.data.token }))
          message.success('登录成功');
          navigate('/ai/chat');
        }
      }
    } catch (error) {
      message.error(isRegister ? '注册失败，请重试' : '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    form.resetFields();
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <h1>AI 助手</h1>
          <p>欢迎使用 AI 智能助手</p>
        </div>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
              isRegister && {
                min: 6,
                message: '密码长度至少6位',
              },
            ].filter(Boolean)}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          {isRegister && (
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: '请确认密码',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                {isRegister ? '注册' : '登录'}
              </Button>
              <Button
                type="link"
                onClick={toggleMode}
                block
              >
                {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
