import React from 'react';
import { Table, Input, Select, DatePicker, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function HomePage() {
    const history = useHistory();
    const dataSource = [
        {
            key: '1',
            id: '1',
            questionContent: 'What is the Pythagorean theorem?',
            type: 'Geometry',
            createTime: '2023-08-01 10:30:45',
            changeTime: '2023-08-01 10:30:45',
            teacherName: 'John Doe'
        },
        // ... Add more sample data as needed
    ];

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
            dataIndex: 'questionContent',
            key: 'questionContent',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
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
    ];

    const handleRowClick = (record) => {
        console.log('Navigate to details for:', record);
        history.replace('/teacheradmin/detail')
        // Implement navigation logic to the details page here.
    };

    const handleDateChange = (dates, dateStrings) => {
      console.log('From:', dateStrings[0], ', to:', dateStrings[1]);
      // Implement your filtering logic based on the selected date range here.
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
                    style={{ width: 200, marginRight: 16 }}
                />

                <Select 
                    placeholder="Filter by Type" 
                    style={{ width: 150, marginRight: 16 }}
                >
                    <Option value="Geometry">Geometry</Option>
                    <Option value="Algebra">Algebra</Option>
                    <Option value="Sets">Sets</Option>
                </Select>

                    <RangePicker onChange={handleDateChange} style={{ marginRight: 16 }} />
            </div>
            
            <Table 
                dataSource={dataSource} 
                columns={columns} 
                onRow={(record) => {
                    return {
                        onClick: () => handleRowClick(record), // Click row to navigate to details
                    };
                }}
            />
        </div>
    );
}
