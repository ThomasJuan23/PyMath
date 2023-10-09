package com.example.pymath1.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

@Data
public class History {
    @TableId(type= IdType.ASSIGN_ID)
    private String  Id;
    private String QuestionId;
    private String Answer;
    private String Feedback;
    private String Email;
    private String Type;
    @TableField(fill= FieldFill.INSERT)
    private Date CreateTime;
    @TableField(fill=FieldFill.INSERT_UPDATE)
    private Date ChangeTime;
    @TableLogic
    private Boolean Availability;
    @Version
    @TableField(fill=FieldFill.INSERT)
    private Integer Edition;
}
