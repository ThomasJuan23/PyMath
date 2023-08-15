import React, { useState } from 'react';
import { List, Input, Button, Avatar } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, user: 'Alice', content: 'Hi there!' },
        { id: 2, user: 'Bob', content: 'Hello!' },
        // ...您可以添加更多的默认聊天记录
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            const nextId = messages.length + 1;
            const currentUser = "User"; // 这里可以换成当前用户的名字
            setMessages([...messages, { id: nextId, user: currentUser, content: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <div style={{ width: '500px', margin: '50px auto' }}>
            <List
                style={{ height: '400px', overflow: 'auto', marginBottom: '20px' }}
                dataSource={messages}
                renderItem={message => (
                    <List.Item style={{ display: 'flex', justifyContent: message.user === 'User' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '70%', overflowWrap: 'break-word', borderRadius: '15px', padding: '10px', background: message.user === 'User' ? '#1890ff' : '#f7f7f7' }}>
                            <strong>{message.user}</strong>
                            <p>{message.content}</p>
                        </div>
                    </List.Item>
                )}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Input 
                    placeholder="Type your message..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)}
                    onPressEnter={handleSendMessage}
                    style={{ width: '85%', marginRight: '10px' }}
                />
                <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}></Button>
            </div>
        </div>
    );
}

export default ChatInterface;
