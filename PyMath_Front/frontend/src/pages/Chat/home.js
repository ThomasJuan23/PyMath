import React, { useState, useRef, useEffect } from 'react';
import { List, Input, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import storageUtils from '../../utils/storageUtils';
import { getMessageByThread, replyMessage } from '../../api/index';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef(null);
    const currentUser = storageUtils.getUser();
    const pageSize = 5;
    const [currentPage, setCurrentPage] = useState(0); // Track the current page

    useEffect(() => { //get the newest message
        async function fetchLastPage() {
            try {
                const initialResult = await getMessageByThread(1, storageUtils.getThread());
                if (initialResult.code === 200) {
                    const total = initialResult.data.total;
                    const lastPage = Math.ceil(total / pageSize);
                    setCurrentPage(lastPage);

                    const result = await getMessageByThread(lastPage, storageUtils.getThread());
                    if (result.code === 200) {
                        setMessages(result.data.records);

                        if (chatContainerRef.current) {
                            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                    }
                } else {
                    message.error(initialResult.message);
                }
            } catch (error) {
                console.error('An error occurred:', error);
                message.error('An error occurred while fetching messages');
            }
        }

        fetchLastPage();
      // set the socket
        const socket = new SockJS('http://localhost:3030/websocket-endpoint');
        const stompClient = Stomp.over(socket);
        stompClient.reconnect_delay = 5000;  // Add this line for reconnection delay
   //prepare for receive the socket broadcast
        stompClient.connect({}, () => {
            console.log(currentUser);
            stompClient.subscribe(`/topic/replies`, (message) => {
                const newMessage = JSON.parse(message.body);
                console.log(newMessage);
                if(newMessage.threadId === storageUtils.getThread() ){
                setMessages((prevMessages) => [...prevMessages, newMessage]);

                setTimeout(() => {
                    if (chatContainerRef.current) {
                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                    }
                }, 0);
            }
            });
            
        }, error => {
            console.log('STOMP:', error);
            setTimeout(() => {
                stompClient.connect({}, () => {
                    // re-connect
                    stompClient.subscribe(`/topic/replies`, (message) => {
                        const newMessage = JSON.parse(message.body);
                        console.log(newMessage);
                        if(newMessage.threadId === storageUtils.getThread() ){
                        setMessages((prevMessages) => [...prevMessages, newMessage]);
        
                        setTimeout(() => {
                            if (chatContainerRef.current) {
                                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                            }
                        }, 0);
                    }
                    });
                }, (error) => {
                    console.log("STOMP: Reconnect failed:", error);
                });
            }, stompClient.reconnect_delay);
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    // Listen for messages array change and handle loading more content
    useEffect(() => {
        const isScrollable = chatContainerRef.current ? chatContainerRef.current.scrollHeight > chatContainerRef.current.clientHeight : false;
        if (!isScrollable && currentPage > 1) {
            handleLoadMore();
        }
    }, [messages]);


    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            //judge the receiver
            let receiver = '';
            if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                receiver = lastMessage.sender === currentUser ? lastMessage.receiver : lastMessage.sender;
            }
    
            try {
                const result = await replyMessage(currentUser, receiver, newMessage, storageUtils.getThread());
                if (result.code === 200) {
                    setMessages([...messages, { sender: currentUser, receiver: receiver, content: newMessage, createTime: result.data }]);
                    setNewMessage('');

                    setTimeout(() => {
                        if (chatContainerRef.current) {
                            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                    }, 0);
                } else {
                    message.error(result.message);
                }
            } catch (error) {
                console.error('An error occurred:', error);
                message.error('An error occurred while sending message');
            }
        }
        else{
            message.error("Please input something")
        }
    };

    const handleLoadMore = async () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);

        // not null check
        if (chatContainerRef.current) {
            const oldScrollHeight = chatContainerRef.current.scrollHeight;

            const result = await getMessageByThread(prevPage, storageUtils.getThread());
            if (result.code === 200 && result.data.records.length > 0) {
                setMessages(prevState => [...result.data.records, ...prevState]);

                // update the dom
                setTimeout(() => {
                    if (chatContainerRef.current) {
                        // not null check
                        const newScrollHeight = chatContainerRef.current.scrollHeight;
                        const scrollDifference = newScrollHeight - oldScrollHeight;

                        //new scroll position
                        chatContainerRef.current.scrollTop = scrollDifference;
                    }
                }, 100);
            }
            else{
                message.error(result.message);
            }
        }
    };


    const handleScroll = async (e) => {
        const scrollTop = e.target.scrollTop;
        if (scrollTop === 0 && currentPage > 1) {
            handleLoadMore();
        }
    };

    return (
        <div style={{ width: '500px', margin: '50px auto' }}>

            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                style={{ height: '400px', overflow: 'auto', marginBottom: '20px' }}
            >
                <List

                    dataSource={messages}
                    renderItem={message => (
                        // sender is on the right, receiver is on the left
                        <List.Item style={{ display: 'flex', justifyContent: message.sender === currentUser ? 'flex-end' : 'flex-start' }}>  
                            <div style={{ maxWidth: '70%', overflowWrap: 'break-word', borderRadius: '15px', padding: '10px', background:  '#f7f7f7' }}>
                                <strong>{message.sender}</strong> - {message.createTime}
                                <p>{message.content}</p>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
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
