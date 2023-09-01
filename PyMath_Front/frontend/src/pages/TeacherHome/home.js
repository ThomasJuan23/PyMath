import React, { useEffect, useState } from 'react';
import { Table, Input, Select, DatePicker, Button, Pagination, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { getDistinctTypes, getQuestions, deleteQuestion,editQuestion } from '../../api';
import storageUtils from '../../utils/storageUtils';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function HomePage() {
  const history = useHistory();
  const [distinctTypes, setDistinctTypes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [filters, setFilters] = useState({ searchText: null, selectedType: 'All', start: null, end: null });
  const [editingKey, setEditingKey] = useState('');
  const [editingData, setEditingData] = useState({});
  const isEditing = (record) => record.id === editingKey;

  useEffect(() => {
    (async () => {
      const types = await getDistinctTypes();
      if (types.code == 200)
        setDistinctTypes(['All', ...types.data]);
      else {
        message.error(types.message);
      }
    })();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [filters, pagination]);

  const fetchQuestions = async () => {
    const { searchText, selectedType, start, end } = filters;
    const apiType = selectedType === 'All' ? null : selectedType;
    const data = await getQuestions(pagination.current, null, searchText, apiType, null, null, storageUtils.getUser(), start, end);
    if (data.code == 200) {
      if (data.data.records) {
        setQuestions(data.data.records);
      }
      if (data.data.total !== pagination.total) {
        setPagination(prev => ({ ...prev, total: data.data.total }));
      }
    }
    else {
      message.error(data.message);
    }
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, current: page });
  };

  const handleSearch = value => {
    setFilters({ ...filters, searchText: value });
    setPagination({ ...pagination, current: 1 }); // Reset to first page
  };

  const handleSelectChange = value => {
    setFilters({ ...filters, selectedType: value });
    setPagination({ ...pagination, current: 1 }); // Reset to first page
  };

  const handleDateChange = (dates, dateStrings) => {
    setFilters({ ...filters, start: dateStrings[0], end: dateStrings[1] });
    setPagination({ ...pagination, current: 1 }); // Reset to first page
  };

  const handleAddClick = () => {
    history.push('/teacheradmin/upload');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Question Content',
      dataIndex: 'question',
      key: 'question',
      render: (text, record) => isEditing(record) ? (
        <Input value={editingData.question}
          onChange={e => setEditingData({ ...editingData, question: e.target.value })} />
      ) : text
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => isEditing(record) ? (
        <Select value={editingData.type}
          onChange={value => setEditingData({ ...editingData, type: value })}>
          {distinctTypes.map((type, index) => (
            <Option key={index} value={type}>{type}</Option>
          ))}
        </Select>
      ) : text
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (text, record) => isEditing(record) ? (
        <Input value={editingData.level}
          onChange={e => setEditingData({ ...editingData, level: e.target.value })} />
      ) : text
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: 'Change Time',
      dataIndex: 'changeTime',
      key: 'changeTime',
    },
    {
      title: 'Create Teacher Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  const actionColumn = {
    title: 'Action',
    dataIndex: 'action',
    render: (_, record) => {
      const editable = isEditing(record);
      return editable ? (
        <span>
          <Button onClick={() => handleSave(record)}>Save</Button>
        </span>
      ) : (
        <span>
          <Button style={{ marginRight: 8 }} onClick={() => handleEdit(record.id)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </span>
      );
    },
  };

  const handleDelete = async (key) => {
    const result = await deleteQuestion(storageUtils.getUser(), key);
    if (result.code === 200) {
      const newQuestions = questions.filter(item => item.id !== key);
      message.success("delete successfully");
      setQuestions(newQuestions);
    }
    else {
      message.error(result.message);
    }
  };


  const handleEdit = (key) => {
    console.log("Enter handle Edit......" + key)
    const currentRowData = questions.find((item) => item.id === key);
    setEditingData(currentRowData);
    setEditingKey(key);
  };

  const handleSave = async (record) => { // 使用 async 以便内部使用 await
    const newData = [...questions];
    const index = newData.findIndex(item => record.id === item.id);
    const item = newData[index];
    const updatedItem = { ...item, ...editingData };
    newData.splice(index, 1, updatedItem);

    const result = await editQuestion(storageUtils.getUser(), updatedItem.id, updatedItem.question, updatedItem.type, updatedItem.ageGroup, updatedItem.level); // 使用 await 和更新后的字段
    if (result.code == 200) {
      message.success("save edition successfully!");
      setQuestions(newData);
      setEditingKey('');
      setEditingData({});
    } else {
      message.error(result.message);
    }
  };

  const addAnswerColumn = {
    title: 'View Detail',
    key: 'detail',
    render: (_, record) => (
      <Button onClick={() => handleDetailClick(record)}>View Detail</Button>
    ),
  };

  const columnsWithActions = [...columns, actionColumn, addAnswerColumn];

  const handleDetailClick = (record) => {
    console.log('Navigate to details for:', record);
    storageUtils.saveQuestion(record.id)
    history.replace('/teacheradmin/detail');
  };

  return (
    <div style={{ padding: 24, minHeight: 600, position: 'relative' }}>
      <Button
        onClick={handleAddClick}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: 'lightblue',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
        }}
      >
        Add
      </Button>
      <h1>Questions List</h1>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by Question Content"
          onSearch={handleSearch}
          style={{ width: 200, marginRight: 16 }}
        />
        <Select
          placeholder="Filter by Type"
          onChange={handleSelectChange}
          style={{ width: 150, marginRight: 16 }}
        >
          {distinctTypes.map((type, index) => (
            <Option key={index} value={type}>{type}</Option>
          ))}
        </Select>
        <RangePicker onChange={handleDateChange} style={{ marginRight: 16 }} />
      </div>
      <Table
        dataSource={questions}
        columns={columnsWithActions}
        pagination={false}
        scroll={{ x: '100%', y: '100%' }}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
