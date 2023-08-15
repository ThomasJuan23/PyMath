package com.example.pymath1.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import javax.crypto.BadPaddingException;
import java.util.Date;

@Data
public class Message {
    @TableId(type= IdType.ASSIGN_ID)
    private String  Id;
    private String Sender;
    private String Receiver;
    private String Content;
    private String Type;
    private String ThreadId;
    private String QuestionId;
    @TableField(fill= FieldFill.INSERT)
    private Date CreateTime;
    @TableField(fill=FieldFill.INSERT_UPDATE)
    private Date ChangeTime;
    @Version
    @TableField(fill=FieldFill.INSERT)
    private Integer Edition;
    @TableLogic
    private Boolean Availability;
}
