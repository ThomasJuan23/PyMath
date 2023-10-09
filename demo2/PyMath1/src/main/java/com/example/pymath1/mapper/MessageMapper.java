package com.example.pymath1.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pymath1.entity.Message;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageMapper extends BaseMapper<Message> {
}
