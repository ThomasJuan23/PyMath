import React, {useState, useEffect} from 'react';
import { Table, Input, Select, DatePicker, Pagination, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { getQuestionsByPage, getUserList, getQuestions } from '../../api';
import storageUtils from '../../utils/storageUtils';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function HomePage() {
    const history = useHistory();
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [filters, setFilters] = useState({searchText: null, start: null, end: null });

    useEffect(() => {
        fetchQuestions();
    }, [filters, pagination]);
// fliter
    const handleSelectChange = (value) => {
        setFilters({ ...filters,  searchText: value });
        setPagination({ ...pagination, current: 1 });
    };

    const handleDateChange = (dates, dateStrings) => {
        setFilters({ ...filters, start: dateStrings[0], end: dateStrings[1] });
        setPagination({ ...pagination, current: 1 }); // Reset to first page
    };
// get question
    const fetchQuestions = async () => {
        const { searchText, start, end } = filters;
        const data = await getQuestionsByPage(pagination.current, storageUtils.getUser(), searchText, start, end);
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
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
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
            title: 'Create Teacher Email',
            dataIndex: 'email',
            key: 'email',
        },
    ];

    const handleRowClick = async(record) => {
        console.log('Navigate to details for:', record);
        storageUtils.saveQuestion(record.id);
        const result = await getQuestions(1,record.id,null,null,null,null,null,null,null);
        if(result.code===200){
            const level = result.data.records[0].level;
            console.log('Navigate to details for:', level);
            if(level==1)
            history.replace('/useradmin/dragexample')
            if(level==2)
            history.replace('/useradmin/drag')  // Implement navigation logic according to the level.
            if(level==3)
            history.replace('/useradmin/answerexample')
            if(level==4)
            history.replace('/useradmin/answer')
        }else{
            error.message(result.message);
        }
        
       
    };

    return (
        <div style={{ padding: 24, minHeight: 600 }}>
            <h1>Questions List</h1>

            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search by Question Type"
                    onSearch={handleSelectChange}
                    style={{ width: 200, marginRight: 16 }}
                />
                <RangePicker onChange={handleDateChange} style={{ marginRight: 16 }} />
            </div>

            <Table
                dataSource={questions}
                columns={columns}
                scroll={{ x: '100%', y: '100%' }}
                onRow={(record) => {
                    return {
                        onClick: () => handleRowClick(record), // Click row to navigate to details
                    };
                }}
            />
        </div>
    );
}
