package com.example.pymath1.service;
import cn.hutool.core.util.IdUtil;
import org.springframework.stereotype.Service;

@Service
public class IdGeneratorService {
    //get a unique id by snow algorithm
    public String generateUniqueId() {
        return IdUtil.getSnowflake(1, 1).nextIdStr();
    }
}