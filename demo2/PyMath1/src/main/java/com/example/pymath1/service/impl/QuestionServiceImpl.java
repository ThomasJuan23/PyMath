package com.example.pymath1.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pymath1.entity.Question;
import com.example.pymath1.mapper.QuestionMapper;
import com.example.pymath1.service.QuestionService;
import org.springframework.stereotype.Service;

@Service
public class QuestionServiceImpl extends ServiceImpl<QuestionMapper, Question> implements QuestionService {
}
