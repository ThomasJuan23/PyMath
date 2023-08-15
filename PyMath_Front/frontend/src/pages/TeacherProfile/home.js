import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Select, Button, message } from 'antd';

export default function TeacherProfileEdit() {
    const history = useHistory();

    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const initialValues = {
        username: 'teacher123',
        realname: 'Jane Smith',
        birthday: '1985-04-15',
        ageGroup: '25-35 years',
        institution: 'XYZ University',
        schoolId: 'ABC001',
        safeQuestion: 'What was your first pet\'s name?',
    };

    const actualSafeAnswer = 'Buddy';


    const handleCheckAnswer = (value) => {
        if (value === actualSafeAnswer) {
            setShowPasswordFields(true);
        } else {
            message.error("Incorrect answer to the security question!");
        }
    };

    const handleFinish = (values) => {
        if (values.newPassword && values.newPassword.length < 6) {
            message.error("New password should be at least 6 characters long.");
            return;
        }

        if (values.newPassword && values.newPasswordAgain !== values.newPassword) {
            message.error("Passwords do not match.");
            return;
        }

        console.log('Saving changes:', values);
        history.goBack();
    };

    return (
        <div style={{ padding: 24, maxWidth: 800, margin: '50px auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px' }}>Edit Teacher Profile</h1>
            <Form
                layout="vertical"
                initialValues={initialValues}
                onFinish={handleFinish}
            >
                <Form.Item label="Username" name="username">
                    <Input />
                </Form.Item>

                <Form.Item label="Real Name" name="realname">
                    <Input />
                </Form.Item>

                <Form.Item label="Birthday" name="birthday">
                    <Input type="date" />
                </Form.Item>

                <Form.Item label="Age Group" name="ageGroup">
                    <Select>
                        <Select.Option value="20-30 years">20-30 years</Select.Option>
                        <Select.Option value="30-40 years">30-40 years</Select.Option>
                        <Select.Option value="40-50 years">40-50 years</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Institution" name="institution">
                    <Input />
                </Form.Item>

                <Form.Item label="School ID" name="schoolId">
                    <Input />
                </Form.Item>

                <Form.Item label="Safe Question" name="safeQuestion">
                    <Input readOnly />
                </Form.Item>

                <Form.Item
                    name="safeAnswer"
                    label="Safe Answer"
                    rules={[
                        {
                            required: true,
                            message: 'Please provide the answer!',
                        },
                        {
                            validator(_, value) {
                                return new Promise((resolve, reject) => {
                                    if (!value) {
                                        return reject(new Error('Please provide the answer!'));
                                    }
                                    if (value === actualSafeAnswer) {
                                        setShowPasswordFields(true);
                                        return resolve();
                                    } else {
                                        return reject(new Error('Incorrect answer to the security question!'));
                                    }
                                });
                            },
                        },
                    ]}
                >
                    <Input />
                </Form.Item>



                {showPasswordFields && (
                    <>
                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your new password!',
                                },
                                {
                                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                                    message: 'Password must be 6 characters, and contain at least 1 letter and 1 number.',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Enter new password" />
                        </Form.Item>

                        <Form.Item
                            label="New Password, Again"
                            name="newPasswordAgain"
                            dependencies={['newPassword']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your new password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match.'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Enter new password again" />
                        </Form.Item>
                    </>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                    <Button style={{ marginLeft: '10px' }} onClick={() => history.goBack()}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
