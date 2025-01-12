import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message, Table, DatePicker } from 'antd';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import Spinner from '../components/Spinner';
import moment from 'moment';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Analytics from '../components/Analytics';
const { RangePicker } = DatePicker;

// Define the backend API base URL
const API_BASE_URL = "https://fintrack-backend-6n2p.onrender.com";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined
            style={{ fontSize: '20px', color: '#08c' }}
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-3"
            style={{ fontSize: '20px', color: '#990000' }}
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/transactions/get-transaction`, {
        userid: user._id,
        frequency,
        selectedDate,
        type,
      });
      setLoading(false);
      setAllTransactions(res.data);
    } catch (error) {
      console.error(error);
      message.error("Couldn't get transaction");
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if (editable) {
        await axios.post(`${API_BASE_URL}/transactions/edit-transaction`, {
          payload: {
            ...values,
            userid: user._id,
          },
          transactionsId: editable._id,
        });
        message.success('Transaction updated successfully');
      } else {
        await axios.post(`${API_BASE_URL}/transactions/add-transaction`, {
          ...values,
          userid: user._id,
        });
        message.success('Transaction added successfully');
      }
      form.resetFields();
      setEditable(null);
      setShowModal(false);
      setLoading(false);
      getAllTransactions();
    } catch (error) {
      console.error(error);
      message.error('Failed to add transaction');
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/transactions/delete-transaction`, {
        transactionsId: record._id,
      });
      message.success('Transaction deleted successfully');
      setLoading(false);
      getAllTransactions();
    } catch (error) {
      console.error(error);
      message.error('Unable to delete transaction');
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  const [selectedOption, setSelectedOption] = useState('income');
  const [incomeCategories] = useState(['Salary', 'Bonus', 'Investments', 'Freelancing', 'Side Business', 'Reimbursements']);
  const [expenseCategories] = useState([
    'Transportation',
    'Dining/Restaurants',
    'Entertainment',
    'Shopping',
    'Travel/Vacation',
    'Health/Medical',
    'Education',
    'Bills/Utilities',
    'Insurance',
    'Home/Real Estate',
    'Personal Care',
    'Gifts/Donations',
    'Debt/Loans',
    'Taxes',
    'Subscriptions/Memberships',
  ]);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const renderCategoryOptions = () => {
    const categories = selectedOption === 'income' ? incomeCategories : expenseCategories;

    return categories.map((category) => (
      <Select.Option key={category} value={category}>
        {category}
      </Select.Option>
    ));
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div>
        <div className="flex m-5 justify-between">
          {/* Frequency Selector */}
          <div className="flex flex-col">
            <h6>Select Frequency:</h6>
            <Select value={frequency} onChange={(values) => setFrequency(values)}>
              <Select.Option value="7">Last one week</Select.Option>
              <Select.Option value="30">Last one month</Select.Option>
              <Select.Option value="365">Last one year</Select.Option>
              <Select.Option value="Custom">Custom</Select.Option>
            </Select>
            {frequency === 'Custom' && (
              <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
            )}
          </div>

          {/* Type Selector */}
          <div className="flex flex-col">
            <h6>Select Type:</h6>
            <Select value={type} onChange={(values) => setType(values)} style={{ width: 120 }}>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
              <Select.Option value="all">All</Select.Option>
            </Select>
          </div>

          {/* View Data */}
          <div className="flex gap-4 text-2xl">
            <UnorderedListOutlined onClick={() => setViewData('table')} />
            <AreaChartOutlined onClick={() => setViewData('analytics')} />
          </div>

          {/* Add Transaction Button */}
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md"
            onClick={() => {
              setEditable(null);
              setShowModal(true);
            }}
          >
            Add Transaction
          </button>
        </div>

        {/* Modal */}
        <Modal
          title={editable ? 'Edit Transaction' : 'Add Transaction'}
          open={showModal}
          onCancel={() => setShowModal(false)}
          footer={false}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={editable ? editable : null}
          >
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the title' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter the amount' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please enter the type' }]}>
              <Select defaultValue="income" onChange={handleOptionChange}>
                <Select.Option value="income">Income</Select.Option>
                <Select.Option value="expense">Expense</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please enter the category' }]}
            >
              <Select defaultValue={incomeCategories[0]}>{renderCategoryOptions()}</Select>
            </Form.Item>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please enter the date' }]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter the description' }]}
            >
              <Input type="text" />
            </Form.Item>
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md" type="submit">
                Save
              </button>
            </div>
          </Form>
        </

Modal>

        {/* Table or Analytics View */}
        <div className="content">
          {viewData === 'table' ? (
            <Table columns={columns} dataSource={allTransactions} />
          ) : (
            <Analytics allTransactions={allTransactions} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;