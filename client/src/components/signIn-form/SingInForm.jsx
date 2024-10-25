import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { loginAccount } from '../../store/accountSlice.js';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInValidation } from '../../validation/auth.js';

import { Form, Input, Button, Checkbox, Card } from 'antd';

export const SignInForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signInValidation),
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isLogged } = useSelector((state) => state.account);
  
  const onSubmit = (data) => {
    dispatch(loginAccount(data));
  };
  
  useEffect(() => {
    if (isLogged) return navigate('/');
  });
  
  return (
    <Card title="Login" style={{ maxWidth: 400, margin: '0 auto' }}>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your email"
              />
            )}
          />
        </Form.Item>
        
        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Enter your password"
              />
            )}
          />
        </Form.Item>
        
        <Form.Item>
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}>
                Remember me
              </Checkbox>
            )}
          />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
