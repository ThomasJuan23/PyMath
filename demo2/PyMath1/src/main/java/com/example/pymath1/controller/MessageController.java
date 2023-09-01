package com.example.pymath1.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pymath1.entity.Message;
import com.example.pymath1.entity.User;
import com.example.pymath1.service.IdGeneratorService;
import com.example.pymath1.service.MessageService;
import com.example.pymath1.service.UserService;
import com.example.pymath1.result.Result;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/public/Message")
public class MessageController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private IdGeneratorService idGeneratorService;

    @PostMapping("/submitQuestion")
    public Result submitQuestion(
            @RequestParam String senderEmail,
            @RequestParam String receiverEmail,
            @RequestParam String questionId) {

        QueryWrapper<User> senderWrapper = new QueryWrapper<>();
        senderWrapper.eq("Email", senderEmail);
        User sender = userService.getOne(senderWrapper);

        QueryWrapper<User> receiverWrapper = new QueryWrapper<>();
        receiverWrapper.eq("Email", receiverEmail);
        User receiver = userService.getOne(receiverWrapper);

        if (sender == null || receiver == null) {
            return Result.fail().message("Invalid sender or receiver email.");
        }

        if (!"teacher".equals(sender.getType()) || !"admin".equals(receiver.getType())) {
            return Result.fail().message("Sender should be a teacher and receiver should be an admin.");
        }

        QueryWrapper<Message> threadWrapper = new QueryWrapper<>();
        threadWrapper.eq("Sender", senderEmail)
                .eq("Receiver", receiverEmail)
                .eq("Type", "question")
                .orderByDesc("Thread_Id")
                .last("LIMIT 1");

        Message lastMessage = messageService.getOne(threadWrapper);
        String nextThreadId;
        if (lastMessage == null) {
            nextThreadId = "1";
        } else {
            nextThreadId = String.valueOf(Integer.parseInt(lastMessage.getThreadId()) + 1);
        }

        Message message = new Message();
        message.setSender(senderEmail);
        message.setReceiver(receiverEmail);
        message.setContent("new_question");
        message.setType("question");
        message.setQuestionId(questionId);
        message.setThreadId(nextThreadId);

        messageService.saveOrUpdate(message);

        return Result.ok().message("Question submitted successfully!");
    }

    @PostMapping("/createMessage")
    public Result createMessage(@RequestParam String senderEmail,
                                @RequestParam String content) {

        QueryWrapper<User> senderWrapper = new QueryWrapper<>();
        senderWrapper.eq("Email", senderEmail);
        User sender = userService.getOne(senderWrapper);
        QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
        userQueryWrapper.eq("Type","admin");
        List<User> adminList = userService.list(userQueryWrapper);
        if(adminList.isEmpty()){
            return Result.fail().message("No admin found to assign the question");
        }
        User randomAdmin = adminList.get(new Random().nextInt(adminList.size()));
        String receiverEmail = randomAdmin.getEmail();
        QueryWrapper<User> receiverWrapper = new QueryWrapper<>();
        receiverWrapper.eq("Email", receiverEmail);
        User receiver = userService.getOne(receiverWrapper);

        // Check if sender exists
        if (sender == null) {
            return Result.fail().message("Sender does not exist");
        }

        // Check if receiver's type is admin
        if (receiver == null || !"admin".equalsIgnoreCase(receiver.getType())) {
            return Result.fail().message("Receiver is not an admin");
        }

        Message message = new Message();
        message.setSender(senderEmail);
        message.setReceiver(receiverEmail);
        message.setContent(content);
        message.setType("new message");

        // Handle the threadId logic

        String threadId = idGeneratorService.generateUniqueId();
        message.setThreadId(threadId);

        messageService.save(message);

        return Result.ok(threadId).message("Message successfully created");
    }

    @PostMapping("/replyMessage")
    public Result replyMessage(
            @RequestParam String sender,
            @RequestParam String receiver,
            @RequestParam String content,
            @RequestParam String threadId
    ) {
        // Check if the users exist
        LambdaQueryWrapper<User> senderQuery = new LambdaQueryWrapper<>();
        senderQuery.eq(User::getEmail, sender);
        User senderUser = userService.getOne(senderQuery);

        LambdaQueryWrapper<User> receiverQuery = new LambdaQueryWrapper<>();
        receiverQuery.eq(User::getEmail, receiver);
        User receiverUser = userService.getOne(receiverQuery);

        if (senderUser == null || receiverUser == null) {
            return Result.fail().message("Sender or Receiver email not found.");
        }

        // Create a new message
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setType("reply message");
        message.setThreadId(threadId);

        boolean isSaved = messageService.save(message);
        QueryWrapper<Message> messageQueryWrapper = new QueryWrapper<>();
        messageQueryWrapper.eq("Sender", sender)
                .eq("Receiver",receiver)
                .eq("Content",content)
                .eq("Type","reply message")
                .eq("Thread_Id",threadId)
                .orderByDesc("Create_Time")
                .last("LIMIT 1");
        Message message1 = messageService.getOne(messageQueryWrapper);
        if (isSaved) {
            System.out.println(receiver);
            simpMessagingTemplate.convertAndSend("/topic/replies", message1);
            return Result.ok(message1.getCreateTime()).message("Message replied successfully.");
        } else {
            return Result.fail().message("Failed to reply the message.");
        }
    }

    @Data
    public class PagedResponse<T> {
        private long total;
        private long size;
        private long current;
        private List<OrderItem> orders; // 根据您的需求定义Order
        private boolean hitCount;
        private boolean searchCount;
        private long pages;
        private List<T> records;

        // Getter 和 Setter 省略
    }

    @GetMapping("/getMessageByReceiver")
    public Result<PagedResponse<Message>> getMessageByReceiver(@RequestParam long current, @RequestParam String email) {
        // 首先，得到每个thread_Id的最新的change_Time
        Page<Map<String, Object>> page = new Page<>(current,5);
        Page<Map<String, Object>> latestChanges = messageService.pageMaps(page,new QueryWrapper<Message>()
                .select("thread_Id", "MAX(change_Time) as latestChangeTime")
                .eq("receiver", email)
                .groupBy("thread_Id")
                .orderByDesc("latestChangeTime"));

        List<Map<String, Object>> changesList = latestChanges.getRecords();

        // 然后，利用上面得到的信息，查询具体的消息
        List<Message> messages = new ArrayList<>();
        for (Map<String, Object> change : changesList) {
            Message message = messageService.getOne(new QueryWrapper<Message>()
                    .eq("thread_Id", change.get("thread_Id"))
                    .eq("change_Time", change.get("latestChangeTime"))
                    .eq("receiver", email));
            if (message != null) {
                messages.add(message);
            }
        }

        PagedResponse<Message> response = new PagedResponse<>();
        response.setTotal(latestChanges.getTotal());
        response.setSize(latestChanges.getSize());
        response.setCurrent(latestChanges.getCurrent());
        response.setOrders(latestChanges.getOrders());
        response.setHitCount(latestChanges.isHitCount());
        response.setSearchCount(latestChanges.isSearchCount());
        response.setPages(latestChanges.getPages());
        response.setRecords(messages);

        return Result.ok(response);
    }


    @GetMapping("/getMessageByThread")
    public Result getMessagesByThreadId(@RequestParam long current, @RequestParam String threadId) {
        Page<Message> page = new Page<>(current,5);
        QueryWrapper<Message> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("thread_Id", threadId);
        queryWrapper.orderByAsc("Create_Time");
        Page<Message> messages = messageService.page(page,queryWrapper);

        if (messages == null) {
            return Result.fail().message("No messages found for the given threadId");
        }
        return Result.ok(messages);
    }

    @DeleteMapping("/DeleteByQuestion")
    public Result deleteMessagesByQuestionId(@RequestParam String questionId) {
        QueryWrapper<Message> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("Question_Id", questionId);

        boolean isDeleted = messageService.remove(queryWrapper);

        if (!isDeleted) {
            return Result.fail().message("Failed to delete messages for the given questionId");
        }
        return Result.ok().message("Messages deleted successfully");
    }

    @DeleteMapping("/DeleteById")
    public Result deleteMessageById(@RequestParam String id) {
        QueryWrapper<Message> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("Id", id);

        boolean isDeleted = messageService.remove(queryWrapper);

        if (!isDeleted) {
            return Result.fail().message("Failed to delete the message for the given id");
        }
        return Result.ok().message("Message deleted successfully");
    }

    @DeleteMapping("/DeleteByThreadId")
    public Result deleteMessagesByThreadId(@RequestParam String threadId) {
        QueryWrapper<Message> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("Thread_Id", threadId); // 注意是ThareadId，因为在你提供的Message类中是这样命名的

        boolean isDeleted = messageService.remove(queryWrapper);

        if (!isDeleted) {
            return Result.fail().message("Failed to delete messages for the given threadId");
        }
        return Result.ok().message("Messages deleted successfully");
    }

}
