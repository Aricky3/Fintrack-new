import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import Spinner from '../components/Spinner';

// Set the base URL for the backend API
const API_BASE_URL = "https://fintrack-backend-6n2p.onrender.com";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // Use the full API URL for registration
      await axios.post(`${API_BASE_URL}/users/register`, values);
      message.success("Registration successful");
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setLoading(false);
      // Handle errors with more detailed feedback
      if (err.response && err.response.data) {
        message.error(err.response.data.message);
      } else {
        message.error("Something went wrong. Please try again.");
      }
      console.error(err);
    }
  };

  // Redirect logged-in users to the home page
  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading && <Spinner />}
      <Form
        layout="vertical"
        className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8"
        onFinish={onFinish}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input />
        </Form.Item>
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
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Register
          </Button>
        </Form.Item>
        <div className="text-center">
          <p>
            Already Registered?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Click Here to Login
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Register;