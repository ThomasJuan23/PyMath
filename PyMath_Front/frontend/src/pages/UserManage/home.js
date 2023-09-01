import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Modal, Button, Pagination, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { getUserList, changeInfoAdminend, deleteUser } from '../../api';
import storageUtils from '../../utils/storageUtils';
const { Search } = Input;
const { Option } = Select;

export default function UserManagerPage() {
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

    const fetchQuestions = async () => {
        console.log("step1")
        const { searchText, selectedType, email, id } = filters;
        const apiType = selectedType === 'All' ? null : selectedType;
        const data = await getUserList(pagination.current, apiType, searchText, email, id);
        console.log("step2")
        if (data.code === 200) {
            if (data.data.records) {
                console.log("step3" + data.data.records)
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

    // const [columns, setColumns] = useState(baseColumns);


    // useEffect(() => {
    //     // 添加一个事件监听器来跟踪窗口大小
    //     const updateColumns = () => {
    //       // 获取窗口宽度
    //       const width = window.innerWidth;
      
    //       // 根据窗口宽度动态调整列宽
    //       if (width < 500) {
    //         setColumns(baseColumns.map(col => ({
    //           ...col,
    //           width: col.width ? col.width * 0.5 : undefined
    //         })));
    //       } else if (width < 1000) {
    //         setColumns(baseColumns.map(col => ({
    //           ...col,
    //           width: col.width ? col.width * 0.75 : undefined
    //         })));
    //       } else {
    //         setColumns(baseColumns);
    //       }
    //     };
      
    //     // 初始更新
    //     updateColumns();
      
    //     // 监听resize事件
    //     window.addEventListener('resize', updateColumns);
      
    //     // 清除事件监听器
    //     return () => {
    //       window.removeEventListener('resize', updateColumns);
    //     };
    //   }, []);

    const handleOk = async () => {
        setIsModalVisible(false);
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
                scroll={{ x: '130%', y: '100%' }}
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
