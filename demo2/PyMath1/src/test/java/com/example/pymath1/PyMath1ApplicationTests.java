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
//    public void test(){
//        int[] burstTime = {4,3,2,2,2,6};
//        int n = 1, m =1;
//        while(n<4){
//            while(m<7){
//                System.out.println("最小可能的最大负载时间：" + n + m + findMinimumMaxLoad(burstTime, n, m));
//                m++;
//            }
//            m=1;
//            n++;
//        }
//    }
    private static int calculateLoadTime(int[] burstTime, int start, int end) {
        int totalLoadTime = 0;
        for (int i = start; i <= end; i++) {
            totalLoadTime += burstTime[i];
        }
        return totalLoadTime;
    }

    private static int findMinimumMaxLoad(int[] burstTime, int n, int m) {
        int[][] dp = new int[n + 1][m + 1]; // dp[i][j]表示将前j个任务分配到i个服务器的最优负载时间

        // 初始化dp数组
        for (int i = 1; i <= n; i++) {
            dp[i][1] = burstTime[0];
        }

        for (int j = 1; j <= m; j++) {
            dp[1][j] = calculateLoadTime(burstTime, 0, j - 1);
        }

        // 填充dp数组
        for (int i = 2; i <= n; i++) {
            for (int j = 2; j <= m; j++) {
                int minMaxLoad = Integer.MAX_VALUE;

                for (int k = 1; k <= j; k++) {
                    int currentMaxLoad = Math.max(dp[i - 1][k], calculateLoadTime(burstTime, k, j - 1));
                    minMaxLoad = Math.min(minMaxLoad, currentMaxLoad);
                }

                dp[i][j] = minMaxLoad;
            }
        }

        return dp[n][m];
    }


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
