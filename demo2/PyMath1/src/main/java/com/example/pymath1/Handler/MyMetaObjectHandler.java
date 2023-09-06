package com.example.pymath1.Handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) { //Auto-fill during data insertion
        this.setFieldValByName("CreateTime",new Date(),metaObject);
        this.setFieldValByName("ChangeTime",new Date(), metaObject);
        this.setFieldValByName("Edition",1,metaObject);
    }

    @Override  ////Auto-fill during data updating
    public void updateFill(MetaObject metaObject) {
        this.setFieldValByName("ChangeTime",new Date(), metaObject);
    }
}
