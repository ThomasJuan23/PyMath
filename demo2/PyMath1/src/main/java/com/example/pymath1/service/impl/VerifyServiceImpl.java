package com.example.pymath1.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pymath1.entity.User;
import com.example.pymath1.entity.Verify;
import com.example.pymath1.mapper.UserMapper;
import com.example.pymath1.mapper.VerifyMapper;
import com.example.pymath1.service.VerifyService;
import org.springframework.stereotype.Service;

@Service
public class VerifyServiceImpl extends ServiceImpl<VerifyMapper, Verify> implements VerifyService {
}
