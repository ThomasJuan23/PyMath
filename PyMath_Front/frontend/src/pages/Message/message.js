import React, { useState, useEffect } from 'react';
import { Avatar, List, Card, Button, Collapse, Pagination } from 'antd';
import { getMessageByReceiver } from '../../api'; // Import the API function for getting messages
import storageUtils from '../../utils/storageUtils';

const { Panel } = Collapse;

const Message = ({ history }) => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  // get the mesages by reciever
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMessageByReceiver(currentPage, storageUtils.getUser());
        if (result.code === 200) {
          setMessages(result.data.records);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Card>
      <List
        itemLayout="horizontal"
        dataSource={messages}
        pagination={{
          defaultPageSize: pageSize,
          showQuickJumper: true,
        }}
        renderItem={(item, index) => (
          <List.Item
            extra={
              <Button
                type='primary'
                onClick={() => {
                  storageUtils.saveMessage(item.id);
                  if (item.type === 'question') {
                    storageUtils.saveQuestion(item.questionId);
                    history.replace('/admin/addanswer');  //jump to different page according to the message type
                  } else {
                    storageUtils.saveThread(item.threadId);
                    history.replace('/admin/chat');
                  }
                }}
              >
                Update
              </Button>
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={"https://robohash.org/" + item.id + "?set=set4"} />}  //get the avatars from the antd library
              title={`${item.sender} - ${item.type === 'question' ? 'New Question' : 'Message'} (${item.type})`}
              description={  //collapse information
                <Collapse bordered={false} ghost={true}>
                  <p style={{ paddingLeft: 0 }}>Sender: {item.sender}</p>
                  <p style={{ paddingLeft: 0 }}>Message Id: {item.id}</p>
                  <p style={{ paddingLeft: 0 }}>Thread Id: {item.threadId}</p>
                  <p style={{ paddingLeft: 0 }}>Create Time: {item.createTime}</p>
                  <p style={{ paddingLeft: 0 }}>Change Time: {item.changeTime}</p>

                  <Panel header={"Type: " + item.type} key="2">
                    {item.type === 'question' ? (
                      <p style={{ paddingLeft: 24 }}>
                        Dear Admin, A new Question ${item.questionId} is created, please add answer
                      </p>
                    ) : (
                      <>
                        <p style={{ paddingLeft: 24 }}>Dear {item.receiver}:</p>
                        <p style={{ paddingLeft: 24 }}>{item.content}</p>
                      </>
                    )}
                  </Panel>
                </Collapse>
              }
            />
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={messages.length}
        onChange={handlePageChange}
        showQuickJumper
      />
    </Card>
  );
};

export default Message;
