package com.example.pymath1.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

@Data
public class Question {
    @TableId(type= IdType.ASSIGN_ID)
    private String  Id;
    private String Question;
    private String Answer;
    private String level;
    private String AnswerExplain;
    private String Type;
    private String AgeGroup;
    @TableField(fill= FieldFill.INSERT)
    private Date CreateTime;
    @TableField(fill=FieldFill.INSERT_UPDATE)
    private Date ChangeTime;
    @TableLogic
    private Boolean Availability;
    @Version
    @TableField(fill=FieldFill.INSERT)
    private Integer Edition;
    private String Email;

}
