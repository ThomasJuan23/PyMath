import React, { useState, useEffect } from 'react';
import { Table, Input, Select, DatePicker, Button, Pagination, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { getDistinctTypes, getQuestions, editQuestion, deleteQuestion } from '../../api';
import storageUtils from '../../utils/storageUtils';
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function HomePage() {
    const history = useHistory();
    const [editingKey, setEditingKey] = useState('');
    const [editingData, setEditingData] = useState({});
    const isEditing = (record) => record.id === editingKey;
    const [distinctTypes, setDistinctTypes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [filters, setFilters] = useState({
        searchText: null,
        selectedType: 'All',
        start: null,
        end: null,
        hasAnswer: null,
        ageGroup: null // add this line
    });

    const handleSelectAgeGroup = (value) => {
        setFilters({ ...filters, ageGroup: value });
        setPagination({ ...pagination, current: 1 });
    };


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
        const { searchText, selectedType, start, end, hasAnswer, ageGroup } = filters;
        const apiType = selectedType === 'All' ? null : selectedType;
        const data = await getQuestions(pagination.current, null, searchText, apiType, ageGroup, hasAnswer, null, start, end);
        if (data.code === 200) {
            if (data.data.records) {
                // 添加 hasAnswer 字段
                const updatedRecords = data.data.records.map(record => ({
                    ...record,
                    hasAnswer: record.answer !== null && record.answer !== ''
                }));
                setQuestions(updatedRecords);
            }
            if (data.data.total !== pagination.total) {
                setPagination(prev => ({ ...prev, total: data.data.total }));
            }
        }
        else {
            message.error(data.message);
        }
    };
    

    const handleAddAnswer = (record) => {
        storageUtils.saveQuestion(record.id);
        history.push('/admin/addanswer');
    };

    const handleEditAnswer = (record) => {
        storageUtils.saveQuestion(record.id);
        history.push('/admin/editanswer');
    };

    const handlePageChange = (page) => {
        setPagination({ ...pagination, current: page });
    };

    const handleSelectChange = (value) => {
        setFilters({ ...filters, selectedType: value });
        setPagination({ ...pagination, current: 1 });
    };

    const handleSearch = (value) => {
        setFilters({ ...filters, searchText: value });
        setPagination({ ...pagination, current: 1 });
    };

    const handleDateChange = (dates, dateStrings) => {
        setFilters({ ...filters, start: dateStrings[0], end: dateStrings[1] });
        setPagination({ ...pagination, current: 1 }); // Reset to first page
    };

    const handleSelectHasAnswer = (value) => {
        setFilters({ ...filters, hasAnswer: value });
        setPagination({ ...pagination, current: 1 });
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
            title: 'Age Group',
            dataIndex: 'ageGroup',
            key: 'ageGroup',
            render: (text, record) => isEditing(record) ? (
                <Select value={editingData.ageGroup}
                    onChange={value => setEditingData({ ...editingData, ageGroup: value })}>
                    <Select.Option value="11-14">11-14 (key Stage 3)</Select.Option>
                    <Select.Option value="14-16">14-16 (key Stage 4)</Select.Option>
                    <Select.Option value="16-18">16-18 (key Stage 4+)</Select.Option>
                </Select>
            ) : text
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
        title: 'Add/Edit Answer',
        key: 'addOrEditAnswer',
        render: (_, record) => (
            record.hasAnswer ?
                <Button onClick={() => handleEditAnswer(record)}>Edit Answer</Button> :
                <Button onClick={() => handleAddAnswer(record)}>Add Answer</Button>
        ),
    };

    const columnsWithActions = [...columns, actionColumn, addAnswerColumn];

    return (
        <div style={{ padding: 24, minHeight: 600, position: 'relative' }}>
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
                <Select placeholder="Has Answer?"
                    onChange={handleSelectHasAnswer}
                    style={{ width: 150, marginRight: 16 }}>
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                </Select>
                <Select
                    placeholder="Filter by Age Group"
                    onChange={handleSelectAgeGroup}
                    style={{ width: 200, marginRight: 16 }}
                >
                    <Select.Option value="11-14">11-14 (key Stage 3)</Select.Option>
                    <Select.Option value="14-16">14-16 (key Stage 4)</Select.Option>
                    <Select.Option value="16-18">16-18 (key Stage 4+)</Select.Option>
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
