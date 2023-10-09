import React, { useEffect, useRef } from 'react';
import { Upload, Button, Form, Input, Select } from 'antd';
import { Link } from 'react-router-dom';



const { Option } = Select;

//For testing purposes, a mock login routing page.

export default function Home() {

  const handleUpload = (info) => {
    console.log(info.file);

  }


  const handleFormSubmit = (values) => {
    console.log(values);
 
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
