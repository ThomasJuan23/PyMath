import React, { useState } from 'react';
import { Table, Input, Select, Button } from 'antd';

const { Search } = Input;
const { Option } = Select;

export default function UserManagerPage() {
    const [editingKey, setEditingKey] = useState('');
    const [editingData, setEditingData] = useState({});
    const isEditing = (record) => record.key === editingKey;

    const dataSource = [
        {
            key: '1',
            id: '1',
            email: 'example@example.com',
            type: 'student',
            birthday: '2005-05-25',
            ageGroup: '15-18',
            userName: 'exampleUser',
            realName: 'John Doe',
            safeQuestion: 'What is your pet’s name?',
            safeAnswer: 'Max',
            institution: 'XYZ University',
            schoolId: '12345'
        },
        // ... Add more sample data as needed
    ];

    const handleDelete = (key) => {
        // 删除逻辑
        const newDataSource = dataSource.filter(item => item.key !== key);
        // Note: You will need to convert dataSource into a state to handle deletion.
        // setDataSource(newDataSource);
    };

    const handleEdit = (key) => {
        const currentRowData = dataSource.find((item) => item.key === key);
        setEditingData(currentRowData);
        setEditingKey(key);
    };

    const handleSave = (key) => {
        // Merge editingData changes into dataSource
        // Might require API call or other methods
    
        // Exit edit mode
        setEditingKey('');
        setEditingData({});
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Birthday',
            dataIndex: 'birthday',
            key: 'birthday',
        },
        {
            title: 'Age Group',
            dataIndex: 'ageGroup',
            key: 'ageGroup',
        },
        {
            title: 'Username',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Real Name',
            dataIndex: 'realName',
            key: 'realName',
        },
        {
            title: 'Safe Question',
            dataIndex: 'safeQuestion',
            key: 'safeQuestion',
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
        },
        {
            title: 'School ID',
            dataIndex: 'schoolId',
            key: 'schoolId',
        },
    ];

    const actionColumn = {
        title: 'Action',
        dataIndex: 'action',
        render: (_, record) => {
            const editable = isEditing(record);
            return editable ? (
                <span>
                    <Button onClick={() => handleSave(record.key)}>
                        Save
                    </Button>
                </span>
            ) : (
                <span>
                    <Button style={{ marginRight: 8 }} onClick={() => handleEdit(record.key)}>
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(record.key)}>
                        Delete
                    </Button>
                </span>
            );
        },
    };

    const columnsWithAction = [...columns, actionColumn];

    const handleTypeChange = (value) => {
        console.log("User type:", value);
        // Implement filtering logic based on user type.
    }

    return (
        <div style={{ padding: 24, minHeight: 600 }}>
            <h1>User Management</h1>

            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search by ID, Email, Username"
                    style={{ width: 250, marginRight: 16 }}
                />

                <Select
                    placeholder="Filter by Type"
                    style={{ width: 150, marginRight: 16 }}
                    onChange={handleTypeChange}
                >
                    <Option value="student">Student</Option>
                    <Option value="teacher">Teacher</Option>
                </Select>
            </div>

            <Table
                dataSource={dataSource}
                columns={columnsWithAction}
            />
        </div>
    );
}
