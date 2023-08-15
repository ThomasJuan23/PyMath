package com.example.pymath1.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pymath1.entity.History;
import com.example.pymath1.mapper.HistoryMapper;
import com.example.pymath1.service.HistoryService;
import org.springframework.stereotype.Service;

@Service
public class HistoryServiceImpl extends ServiceImpl<HistoryMapper, History> implements HistoryService {
}
