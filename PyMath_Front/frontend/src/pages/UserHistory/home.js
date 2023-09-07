import React, {useState, useEffect} from 'react';
import { Table, Input, Select, DatePicker, Pagination, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { getHistoryList, getQuestions } from '../../api';
import storageUtils from '../../utils/storageUtils';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function HomePage() {
    const history = useHistory();
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [filters, setFilters] = useState({searchText: null, start: null, end: null });
   //get the answer history
    useEffect(() => {
        fetchQuestions();
    }, [filters, pagination]);
   //handle fliter
    const handleSelectChange = (value) => {
        setFilters({ ...filters,  searchText: value });
        setPagination({ ...pagination, current: 1 });
    };

    const handleDateChange = (dates, dateStrings) => {
        setFilters({ ...filters, start: dateStrings[0], end: dateStrings[1] });
        setPagination({ ...pagination, current: 1 }); // Reset to first page
    };

    const fetchQuestions = async () => {
        const { searchText, start, end } = filters;
        const data = await getHistoryList(pagination.current, storageUtils.getUser(), searchText, start, end);
        console.log(storageUtils.getUser())
        console.log(pagination.current)
        
        if (data.code === 200) {
          if (data.data.records) {
            const updatedQuestions = await Promise.all(
              data.data.records.map(async (record) => {
                const questionId = record.questionId;
                const questionResponse = await getQuestions(1, questionId, null,null,null,null,null,null,null);
                const question = questionResponse.data.records[0].question;  //combine the hisotry object and question content
                return {
                  ...record,
                  question: question
                };
              })
            );
            setQuestions(updatedQuestions);
          }
      
          if (data.data.total !== pagination.total) {
            setPagination(prev => ({ ...prev, total: data.data.total }));
          }
        } else {
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
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'Feedback',
            dataIndex: 'feedback',
            key: 'feedback',
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
    ];
    return (
        <div style={{ padding: 24, minHeight: 600 }}>
            <h1>Questions List</h1>
{/* fliter */}
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
            />
        </div>
    );
}
