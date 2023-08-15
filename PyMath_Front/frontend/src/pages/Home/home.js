import React, { useEffect, useRef } from 'react';
import { Upload, Button, Form, Input, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactLive2d from 'react-live2d';
import { Link } from 'react-router-dom';



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
      <Link to="/teacheradmin">Teacher End</Link>
      <Link to="/admin">Admin End</Link>
      <Link to="/useradmin">User End</Link>
    </div>
  );
}
