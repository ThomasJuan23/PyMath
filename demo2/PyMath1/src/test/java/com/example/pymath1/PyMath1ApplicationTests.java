package com.example.pymath1;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pymath1.entity.History;
import com.example.pymath1.entity.Message;
import com.example.pymath1.entity.Question;
import com.example.pymath1.entity.User;
import com.example.pymath1.mapper.HistoryMapper;
import com.example.pymath1.mapper.MessageMapper;
import com.example.pymath1.mapper.QuestionMapper;
import com.example.pymath1.mapper.UserMapper;
import lombok.val;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@SpringBootTest
class PyMath1ApplicationTests {
//    @Test
//    public void decode(){
//        String a = "VHJhY2ViYWNrIChtb3N0IHJlY2VudCBjYWxsIGxhc3QpOgogIEZpbGUgInNj\n" +
//                "cmlwdC5weSIsIGxpbmUgMSwgaW4gPG1vZHVsZT4KICAgIGRhc2QKTmFtZUVy\n" +
//                "cm9yOiBuYW1lICdkYXNkJyBpcyBub3QgZGVmaW5lZAo=\n";
//        a = a.trim();
//        String error = new String(Base64.getUrlDecoder().decode(a), StandardCharsets.UTF_8);
//        System.out.println("Decoded Error: " + error);
//    }
//    @Autowired
//    private UserMapper userMapper;
//    @Autowired
//    private HistoryMapper historyMapper;
//    @Autowired
//    private MessageMapper messageMapper;
//    @Autowired
//    private QuestionMapper questionMapper;
//
//    @Test
//    public void findAll() {
//        List<User> users = userMapper.selectList(null);
//        System.out.println("User Table is *****"+users);
//        List<History> histories = historyMapper.selectList(null);
//        System.out.println("History Table is *****"+histories);
//        List<Message> messages = messageMapper.selectList(null);
//        System.out.println("Message Table is *****"+messages);
//        List<Question> questions = questionMapper.selectList(null);
//        System.out.println("History Table is *****"+questions);
//    }
//
//    @Test
//    public void add(){
//        User user = new User();
//        user.setEmail("31429ads4dca3162@qq.com");
//        user.setType("Admadsin");
//        user.setPassword("SAyouNAla123");
//        int insert = userMapper.insert(user);
//        System.out.println("八八八"+insert);
//        Message message = new Message();
//        message.setSender("Admin2");
//        message.setReceiver("User");
//        int insert2 = messageMapper.insert(message);
//        System.out.println("S阿斯顿"+insert2);
//    }
//
//    @Test
//    public void logicDelete(){
//        userMapper.deleteById(1690456080002887681L);
//    }
//
//    @Test
//    public void PageTester(){
//        Page<User> page = new Page<>();
//        Page<User> userPage = userMapper.selectPage(page, null);
//        long pages = userPage.getPages();
//        long current = userPage.getCurrent();
//        List<User> records = userPage.getRecords();
//        long total = userPage.getTotal();
//        boolean b = userPage.hasNext();
//        boolean b1 = userPage.hasPrevious();
//
//        System.out.println(pages);
//        System.out.println(current);
//        System.out.println(records);
//        System.out.println(total);
//        System.out.println(b);
//        System.out.println(b1 );
//
//
//    }

}
