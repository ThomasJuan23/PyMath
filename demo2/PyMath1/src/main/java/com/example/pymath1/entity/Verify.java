package com.example.pymath1.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

@Data
public class Verify {
    @TableId(type= IdType.ASSIGN_ID)
    private String  id;
    private String  email;
    private String  code;
    @TableField(fill= FieldFill.INSERT)
    private Date CreateTime;
    @TableField(fill=FieldFill.INSERT_UPDATE)
    private Date ChangeTime;
    @TableLogic
    private Integer Availability;
}
