package com.example.pymath1.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pymath1.entity.Message;
import com.example.pymath1.mapper.MessageMapper;
import com.example.pymath1.service.MessageService;
import org.springframework.stereotype.Service;


@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message> implements MessageService {


}
