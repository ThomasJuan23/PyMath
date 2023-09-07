import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Modal, Button, Pagination, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { getUserList, changeInfoAdminend, deleteUser } from '../../api';
import storageUtils from '../../utils/storageUtils';
const { Search } = Input;
const { Option } = Select;

export default function UserManagerPage() {
    const [editingKey, setEditingKey] = useState('');
    const [editingData, setEditingData] = useState({});
    const isEditing = (record) => record.id === editingKey;
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [filters, setFilters] = useState({
        searchText: null,
        selectedType: 'All',
        email: null,
        id: null,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [password, setPassword] = useState("");


    const showModal = (record, operation) => {
        setCurrentRecord({ ...record, operation });
        setIsModalVisible(true);
    };


    const handleCancel = () => {
        setIsModalVisible(false);
    };


// delete the user
    const handleDelete = async (key) => {
        const result = await deleteUser(key.email, storageUtils.getUser(), password);
        if (result.code === 200) {
            const newQuestions = questions.filter(item => item.id !== key.id);
            message.success("delete successfully");
            setQuestions(newQuestions);
        }
        else {
            message.error(result.message);
        }
        setPassword("");
    };
//   edit thh user, and change the edit state
    const handleEdit = (key) => {
        console.log("Enter handle Edit......" + key)
        const currentRowData = questions.find((item) => item.id === key);
        setEditingData(currentRowData);
        setEditingKey(key);
    };

    const handleSave = async (record) => { 
        const newData = [...questions];
        const index = newData.findIndex(item => record.id === item.id);
        const item = newData[index];
        const updatedItem = { ...item, ...editingData };
        newData.splice(index, 1, updatedItem);

        const result = await changeInfoAdminend(record.email, record.safeQuestion, record.safeAnswer, storageUtils.getUser(), password);
        if (result.code == 200) {
            message.success("save edition successfully!");
            setQuestions(newData);
            setEditingKey('');
            setEditingData({});
        } else {
            message.error(result.message);
        }
        setPassword("");
    };

    useEffect(() => {
        fetchQuestions();
    }, [filters, pagination]);
   //get user
    const fetchQuestions = async () => {
    
        const { searchText, selectedType, email, id } = filters;
        const apiType = selectedType === 'All' ? null : selectedType;
        const data = await getUserList(pagination.current, apiType, searchText, email, id);
       
        if (data.code === 200) {
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



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: "13%",
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: "13%"
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: "5%"
        },
        {
            title: 'Birthday',
            dataIndex: 'birthday',
            key: 'birthday',
            width: "7%"
        },
        {
            title: 'Age Group',
            dataIndex: 'ageGroup',
            key: 'ageGroup',
            width: "5%"
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
            width: "5%"
        },
        {
            title: 'Real Name',
            dataIndex: 'realName',
            key: 'realName',
            width: "5%"
        },
        {
            title: 'Safe Question',
            dataIndex: 'safeQuestion',
            key: 'safeQuestion',
            width: "10%",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Input
                            value={editingData.safeQuestion}
                            onChange={(e) =>
                                setEditingData({
                                    ...editingData,
                                    safeQuestion: e.target.value,
                                })
                            }
                        />
                    );
                }
                return text;
            },
        },
        {
            title: 'Safe Answer',
            dataIndex: 'safeAnswer',
            key: 'safeAnswer',
            width: "10%",
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Input
                            value={editingData.safeAnswer}
                            onChange={(e) =>
                                setEditingData({
                                    ...editingData,
                                    safeAnswer: e.target.value,
                                })
                            }
                        />
                    );
                }
                return text;
            },
        },
        {
            title: 'Institution',
            dataIndex: 'institution',
            key: 'institution',
            width: "10%",
        },
        {
            title: 'School ID',
            dataIndex: 'schoolId',
            key: 'schoolId',
            width:"7",
        },
    ];

    const handleOk = async () => {
        setIsModalVisible(false);  //handle save or  delte, both need to check the password
        if (currentRecord.operation === 'save') {
            await handleSave(currentRecord);
        } else if (currentRecord.operation === 'delete') {
            await handleDelete(currentRecord);
        }
    };    

    const actionColumn = {
        title: 'Action',
        dataIndex: 'action',
        width: "10%",
        render: (_, record) => {
            const editable = isEditing(record);
            return editable ? (
                <span>
                    <Button onClick={() => showModal(record, 'save')}>
                        Save
                    </Button>
                </span>
            ) : (
                <span>
                    <Button style={{ marginRight: 8 }} onClick={() => handleEdit(record.id)}>
                        Edit
                    </Button>
                    <Button onClick={() => showModal(record, 'delete')}>
                        Delete
                    </Button>
                </span>
            );
        },
    };

    const columnsWithAction = [...columns, actionColumn];
  //handle fliter
    const handlePageChange = (page) => {
        setPagination({ ...pagination, current: page });
    };

    const handleTypeChange = (value) => {
        setFilters({ ...filters, selectedType: value });
        setPagination({ ...pagination, current: 1 });
    }

    const handleSearch = (value) => {
        setFilters({ ...filters, searchText: value });
        setPagination({ ...pagination, current: 1 });
    };

    const handleIdSearch = (value) => {
        setFilters({ ...filters, id: value });
        setPagination({ ...pagination, current: 1 });
    }

    const handleEmailSearch = (value) => {
        setFilters({ ...filters, email: value });
        setPagination({ ...pagination, current: 1 });
    }

    return (
        <div style={{ padding: 24, minHeight: 600}}>
            <h1>User Management</h1>

            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search by Username"
                    onSearch={handleSearch}
                    style={{ width: 250, marginRight: 16 }}
                />
                <Search
                    placeholder="Search by Email"
                    onSearch={handleEmailSearch}
                    style={{ width: 250, marginRight: 16 }}
                />
                <Search
                    placeholder="Search by Id"
                    onSearch={handleIdSearch}
                    style={{ width: 250, marginRight: 16 }}
                />
                <Select
                    placeholder="Filter by Type"
                    style={{ width: 150, marginRight: 16 }}
                    onChange={handleTypeChange}
                >
                    <Option value="All">ALL</Option>
                    <Option value="student">Student</Option>
                    <Option value="teacher">Teacher</Option>
                </Select>
            </div>

            <Table
                scroll={{ x: '130%', y: '100%' }}  //table auto-sizing
                dataSource={questions}
                columns={columnsWithAction}
                pagination={false}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePageChange}
                />
            </div>
            <Modal
                title="Please input your admin password"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input.Password placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </Modal>

        </div>
    );
}
