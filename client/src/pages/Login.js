import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';

// Set the base URL for the backend API
const API_BASE_URL = "https://fintrack-backend-6n2p.onrender.com";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Call the login API endpoint
      const { data } = await axios.post(`${API_BASE_URL}/users/login`, values);
      message.success("Login successfully");
      // Store the user data in localStorage, omitting the password for security
      localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      // Provide better error handling with descriptive messages
      if (err.response && err.response.data) {
        message.error(err.response.data.message);
      } else {
        message.error("Something went wrong. Please try again.");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    // Check if the user is already logged in
    if (typeof window !== 'undefined' && localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {loading && <Spinner />}
      <Form
        layout="vertical"
        className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8"
        onFinish={onFinish}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full bg-blue-500 hover:bg-blue-700">
            Log in
          </Button>
        </Form.Item>
        <div className="text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register Here
            </Link>
          </p>
        </div>
      </Form>
      <div className="mt-8">
        <p className="text-center text-xl font-bold">Demo user</p>
        <p className="text-center">Email: demo@demo.com</p>
        <p className="text-center">Password: 123456789</p>
      </div>
    </div>
  );
};

export default Login;