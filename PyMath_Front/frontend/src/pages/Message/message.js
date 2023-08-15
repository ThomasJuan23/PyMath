import React, { Component } from 'react'
import { Avatar, List, Card, Button, Collapse } from 'antd';
import memoryUtils from '../../utils/memoryUtils';

const { Panel } = Collapse;

// 样本数据
const sampleMessages = [
  {
    _id: "1",
    sender: "John Doe",
    service: { name: "Service 1" },
    status: "further details requested",
    receiver: "User A",
    content: "Your order has been completed."
  },
  {
    _id: "2",
    sender: "Jane Smith",
    service: { name: "Service 2" },
    status: "In Progress",
    receiver: "User B",
    content: "Your order is in progress."
  }
  // ...其他样本数据项
];

export default class Message extends Component {

    state = {
        messages: sampleMessages
    }

    disabled(request) {
        if (request.status === 'further details requested') {
            return false
        } else {
            return true
        }
    }

    render() {
        const { messages } = this.state;

        return (
            <Card>
                <List
                    itemLayout="horizontal"
                    dataSource={messages}
                    pagination={{
                        defaultPageSize: 5,
                        showQuickJumper: true,
                    }}
                    renderItem={(item, index) => (
                        <List.Item
                            extra={<Button
                                disabled={this.disabled(item)}
                                type='primary'
                                onClick={() => {
                                    memoryUtils.request = item;
                                    this.props.history.push('/admin/chat/' + item._id);
                                }}
                            >
                                Update
                            </Button>}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={"https://robohash.org/" + item._id + "?set=set4"} />}
                                title={item.sender}
                                description=
                                {
                                    <Collapse
                                        bordered={false}
                                        ghost={true}
                                    >
                                        <p style={{ paddingLeft: 0, }}>
                                            {item.service.name}
                                        </p>
                                        <p style={{ paddingLeft: 0, }}>
                                            Order number : {item._id}
                                        </p>
                                        <p style={{ paddingLeft: 0, }}>
                                            Hi, your service status has been updated.
                                        </p>

                                        <Panel
                                            header={"Current Status :" + item.status}
                                            key="2"
                                        >
                                            <p style={{ paddingLeft: 24, }}>
                                               Dear  {item.receiver} :
                                            </p>
                                            <p style={{ paddingLeft: 24, }}>
                                                {item.content}
                                            </p>
                                        </Panel>
                                    </Collapse>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        )
    }
}
