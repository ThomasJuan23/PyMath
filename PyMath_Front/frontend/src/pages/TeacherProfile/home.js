import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Select, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { getUserList, changeInfoUserend } from '../../api';
import storageUtils from '../../utils/storageUtils';

export default function TeacherProfileEdit() {
    const history = useHistory();
    const [form] = Form.useForm();
    const [info, setInfo] = useState({});

    useEffect(() => {
        (async () => {
            const result = await getUserList(1, null, null, storageUtils.getUser(), null);
            if (result.code === 200) {
                console.log(result.data.records[0]);
                setInfo(result.data.records[0]);
                form.setFieldsValue(result.data.records[0]);
            } else {
                message.error(result.message);
            }
        })();
    }, [form]);

    const handleFinish = async(values) => {
        console.log('Saving changes:', values);
        const data = await changeInfoUserend(storageUtils.getUser(), values.userName, values.birthday, values.ageGroup, values.institution, values.realName, values.schoolId);
        if(data.code === 200){
            message.success("Modify Successfully!");
            const result = await getUserList(1, null, null, storageUtils.getUser(), null);
             if (result.code === 200) {
            console.log(result.data.records[0]);
            setInfo(result.data.records[0]);
            form.setFieldsValue(result.data.records[0]);
        }
        }
        else{
            message.error(data.message);
        }
    };

    const handleClear = () => {
        form.resetFields();
    };

    return (
        <div style={{ padding: 24, maxWidth: 800, margin: '50px auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px' }}>Edit Teacher Profile</h1>
            <Form
                form={form}
                layout="vertical"
                initialValues={info}
                onFinish={handleFinish}
            >
                <Form.Item 
                    label="Username" 
                    name="userName" 
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="Real Name" 
                    name="realName" 
                    rules={[{ required: true, message: 'Please input your real name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="Birthday" 
                    name="birthday" 
                    rules={[
                        { required: true, message: 'Please input your birthday!' },
                        { pattern: /\d{4}-\d{2}-\d{2}/, message: 'The date format must be yyyy-mm-dd!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="Age Group" 
                    name="ageGroup" 
                    rules={[{ required: true, message: 'Please select your age group!' }]}
                >
                    <Select>
                        <Select.Option value="11-14">11-14 (key Stage 3)</Select.Option>
                        <Select.Option value="14-16">14-16 (key Stage 4)</Select.Option>
                        <Select.Option value="16-18">16-18 (key Stage 4+)</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item 
                    label="Institution" 
                    name="institution" 
                    rules={[{ required: true, message: 'Please input your institution!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item 
                    label="School ID" 
                    name="schoolId" 
                    rules={[{ required: true, message: 'Please input your School ID!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Link to="/reset">Reset Password </Link> 
                    <p>(Save Changes Before you go to the reset password page)</p>
                    <p>If you want to reset your safe answer, please connect to the admin</p>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                    <Button style={{ marginLeft: '10px' }} onClick={handleClear}>
                        Clear
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
