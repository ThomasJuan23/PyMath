package com.example.pymath1.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class User {
    @TableId(type=IdType.ASSIGN_ID)
    private String  Id;
    private String Email;
    private String Password;
    private LocalDate Birthday;
    private String AgeGroup;
    private String UserName;
    private String RealName;
    private String SafeQuestion;
    private String SafeAnswer;
    private String Institution;
    private String SchoolId;
    @TableField(fill= FieldFill.INSERT)
    private Date CreateTime;
    @TableField(fill=FieldFill.INSERT_UPDATE)
    private Date ChangeTime;
    @TableLogic
    private Integer Availability;
    @Version
    @TableField(fill=FieldFill.INSERT)
    private Integer Edition;
    private String Type;
}
