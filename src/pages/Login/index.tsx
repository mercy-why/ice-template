import styles from './index.module.less';
import { Form, Input, Button, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRequest, useHistory, config } from 'ice';
import API from './services';
import { generateUUID } from '@/utils';
interface values {
  account: string;
  password: string;
}
interface response {
  token: string;
  code: number;
}
function Login() {
  const [form] = Form.useForm();
  const [verifyCode, changeCode] = useState('');
  const [icode, changeIcode] = useState('');
  const history = useHistory();
  const loginFn = (values: values) => {
    API.login({ ...values }).then((res: response) => {
      if (res) {
        localStorage.setItem('token', res.token);
        history.push('/');
        return Promise.resolve(res);
      } else {
        return Promise.reject(res);
      }
    });
  };
  const { loading, request } = useRequest(loginFn);
  const reload = () => {
    const code = generateUUID();
    const url = `${config.baseUrl}/validCode/getImg?icode=${code}`;
    changeCode(url);
    changeIcode(code);
  };
  const checkVCode = async (rule, value) => {
    if (!value) {
      return Promise.reject(new Error('请输入验证码'));
    } else if (!/^[A-Za-z0-9]{3,4}$/.test(value)) {
      return Promise.reject(new Error('请输入正确的验证码'));
    } else {
      return Promise.resolve();
    }
  };
  return (
    <div className={styles['login-x']}>
      <div className={styles['login-content']}>
        <div className={styles['login-form']}>
          <div className={styles['title']}>管理平台</div>
          <Form form={form} className={styles['form-box']} onFinish={request} validateTrigger="onBlur">
            <div className={styles['sub-title']}>账号密码登录</div>
            <Form.Item name="account" rules={[{ required: true, message: '请输入账号' }]}>
              <Input autoComplete="username" prefix={<UserOutlined />} placeholder="请输入账号" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input
                prefix={<LockOutlined />}
                type="password"
                autoComplete="current-password"
                placeholder="请输入密码"
              />
            </Form.Item>
            {/* <Form.Item>
              <Space className={styles['code-x']}>
                <Form.Item name="verifyCode" noStyle rules={[{ validator: checkVCode }]}>
                  <Input placeholder="请输入验证码" />
                </Form.Item>
                <img className={styles['verify-x']} onClick={reload} src={verifyCode} />
              </Space>
            </Form.Item> */}
            <Button type="primary" loading={loading} block htmlType="submit" className={styles['sub-x']}>
              {!loading ? '登录' : '登录中...'}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
