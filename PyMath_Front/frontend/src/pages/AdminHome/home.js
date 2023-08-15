import React, { useState } from 'react';
import { Table, Input, Select, DatePicker, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function HomePage() {
    const history = useHistory();
    const [editingKey, setEditingKey] = useState('');
    const [editingData, setEditingData] = useState({});
    const isEditing = (record) => record.key === editingKey;
    const [dataSource, setDataSource] = useState([
        {
            key: '1',
            id: '1',
            questionContent: 'What is the Pythagorean theorem?',
            type: 'Geometry',
            createTime: '2023-08-01 10:30:45',
            changeTime: '2023-08-01 10:30:45',
            teacherName: 'John Doe',
            hasAnswer: true
        },
    ]);

    const handleDelete = (key) => {
        const newDataSource = dataSource.filter(item => item.key !== key);
        setDataSource(newDataSource);
    };

    const handleEdit = (key) => {
        const currentRowData = dataSource.find((item) => item.key === key);
        setEditingData(currentRowData);
        setEditingKey(key);
    };

    const handleSave = (key) => {
        const newData = [...dataSource];
        const index = newData.findIndex(item => key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...editingData });
        setDataSource(newData);
        setEditingKey('');
        setEditingData({});
    };

    const handleAddAnswer = (record) => {
        history.push('/admin/addanswer');
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Question Content',
            dataIndex: 'questionContent',
            key: 'questionContent',
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Input
                            value={editingData.questionContent}
                            onChange={(e) => 
                                setEditingData({
                                    ...editingData,
                                    questionContent: e.target.value,
                                })
                            }
                        />
                    );
                }
                return text;
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text, record) => {
                if (isEditing(record)) {
                    return (
                        <Select
                            value={editingData.type}
                            onChange={(value) => 
                                setEditingData({
                                    ...editingData,
                                    type: value,
                                })
                            }
                        >
                            <Option value="Geometry">Geometry</Option>
                            <Option value="Algebra">Algebra</Option>
                            <Option value="Sets">Sets</Option>
                        </Select>
                    );
                }
                return text;
            },
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
            title: 'Create Teacher Name',
            dataIndex: 'teacherName',
            key: 'teacherName',
        },
        {
            title: 'Answer',
            dataIndex: 'hasAnswer',
            key: 'hasAnswer',
            render: (hasAnswer) => (hasAnswer ? 'Yes' : 'No'),
        },
    ];

    const actionColumn = {
        title: 'Action',
        dataIndex: 'action',
        render: (_, record) => {
            const editable = isEditing(record);
            return editable ? (
                <span>
                    <Button onClick={() => handleSave(record.key)}>Save</Button>
                </span>
            ) : (
                <span>
                    <Button style={{ marginRight: 8 }} onClick={() => handleEdit(record.key)}>Edit</Button>
                    <Button onClick={() => handleDelete(record.key)}>Delete</Button>
                </span>
            );
        },
    };

    const addAnswerColumn = {
        title: 'Add Answer',
        key: 'addAnswer',
        render: (_, record) => (
            <Button onClick={() => handleAddAnswer(record)}>Add Answer</Button>
        ),
    };

    const columnsWithActions = [...columns, actionColumn, addAnswerColumn];

    return (
        <div style={{ padding: 24, minHeight: 600 }}>
            <h1>Questions List</h1>
            <div style={{ marginBottom: 16 }}>
                <Search placeholder="Search by Question Content" style={{ width: 200, marginRight: 16 }} />
                <Select placeholder="Filter by Type" style={{ width: 150, marginRight: 16 }}>
                    <Option value="Geometry">Geometry</Option>
                    <Option value="Algebra">Algebra</Option>
                    <Option value="Sets">Sets</Option>
                </Select>
                <Select placeholder="Has Answer?" style={{ width: 150, marginRight: 16 }}>
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                </Select>
                <RangePicker style={{ marginRight: 16 }} />
            </div>
            <Table
                dataSource={dataSource}
                columns={columnsWithActions}
                onRow={(record) => ({
                    onClick: () => {
                        if (!isEditing(record)) {
                            handleAddAnswer(record);
                        }
                    },
                })}
            />
        </div>
    );
}
