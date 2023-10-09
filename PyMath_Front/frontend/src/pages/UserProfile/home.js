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
  //get the student information
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
  //change the genral user information
    const handleFinish = async(values) => {
        console.log('Saving changes:', values);
        const data = await changeInfoUserend(storageUtils.getUser(),values.userName,values.birthday,null,null,null,null);
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
// back to the origin value
    const handleClear = () => {
        form.resetFields();
    };

    return (
        <div style={{ padding: 24, maxWidth: 800, margin: '50px auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px' }}>Edit Student Profile</h1>
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
                    label="Birthday" 
                    name="birthday"   //date format
                    rules={[
                        { required: true, message: 'Please input your birthday!' },
                        { pattern: /\d{4}-\d{2}-\d{2}/, message: 'The date format must be yyyy-mm-dd!' }
                    ]}
                >
                    <Input />
                </Form.Item>
    {/* tell user how to reset password and safe question */}
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
