import React, { useEffect, useRef } from 'react';
import { Upload, Button, Form, Input, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const { Option } = Select;



export default function Home() {

  const handleUpload = (info) => {
    console.log(info.file);
    // 在这里处理上传文件的逻辑
  }


  const handleFormSubmit = (values) => {
    console.log(values);
    // 在这里处理表单提交的逻辑
  }

  return (
    <div className="site-layout-background" style={{
      padding: 24,
      minHeight: 600,
      fontSize: '30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>PyMath</h1>
      <Form onFinish={handleFormSubmit} style={{ width: '400px' }}>
        <Form.Item name="question" label="Question">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="category" label="Type">
          <Select style={{ width: '100%' }}>
            <Option value="category1">Sets</Option>
            <Option value="category2">Algebra</Option>
            <Option value="category3">Geometry</Option>
          </Select>
        </Form.Item>
        <Form.Item name="ageGroup" label="Age Group">
          <Select style={{ width: '100%' }}>
            <Option value="ageGroup1">11-13</Option>
            <Option value="ageGroup2">13-15</Option>
            <Option value="ageGroup3">15-18</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Upload
            accept=".pdf,.doc,.docx"
            beforeUpload={() => false}
            onChange={handleUpload}
            style={{ display: 'inline-block', marginRight: '10px' }}
          >
            <Button icon={<UploadOutlined />}>Upload File</Button>
          </Upload>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
