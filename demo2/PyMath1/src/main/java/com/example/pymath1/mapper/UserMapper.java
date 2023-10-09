package com.example.pymath1.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pymath1.entity.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMapper extends BaseMapper<User> {
}
