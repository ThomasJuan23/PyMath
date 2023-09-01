package com.example.pymath1.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pymath1.entity.History;
import com.example.pymath1.entity.Question;
import com.example.pymath1.entity.User;
import com.example.pymath1.result.Result;
import com.example.pymath1.service.HistoryService;
import com.example.pymath1.service.QuestionService;
import com.example.pymath1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("public/History")
public class HistoryController {
    @Autowired
    private HistoryService historyService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private UserService userService;

    @GetMapping("/getHistoryList")
    public Result getHistoryList(@RequestParam long current, @RequestParam String emailAddress, @RequestParam(required = false) String Type, @RequestParam(required = false) String start, @RequestParam(required = false) String end){
        Page<History> page = new Page<>(current,5);
        QueryWrapper<History> emailQuery = new QueryWrapper<>();
        emailQuery.eq("Email", emailAddress);
        if(start!=null && end!=null) {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd"); // 根据实际日期格式进行调整
            try {
                Date startDate = format.parse(start);
                Date endDate = format.parse(end);
                emailQuery.between("change_time", startDate, endDate);  // 使用BETWEEN进行时间范围查询
            } catch (ParseException e) {
                e.printStackTrace();// 可以选择返回一个错误响应，或者继续其他处理
            }
        }
        if(Type!=null){
            emailQuery.like("Type", Type);
        }
        Page<History> list = historyService.page(page,emailQuery);
        return Result.ok(list);
    }

    @GetMapping("/getQuestionsByPage")
    public Result getQuestionsByPage(
            @RequestParam long current,
            @RequestParam String email,
            @RequestParam(required = false) String questionType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        try {
            QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
            userQueryWrapper.eq("Email", email);
            userQueryWrapper.last("LIMIT 1");
            User user = userService.getOne(userQueryWrapper);
            LocalDate birthDate =user.getBirthday();
            LocalDate currentDate = LocalDate.now();
            Period agePeriod = Period.between(birthDate, currentDate);
            String ageGroup;
            if (agePeriod.getYears() < 14 || (agePeriod.getYears() == 14 && agePeriod.getMonths() < 6)) {
                ageGroup = "11-14";  // 14岁以下
            } else if (agePeriod.getYears() < 16 || (agePeriod.getYears() == 16 && agePeriod.getMonths() < 6)) {
                ageGroup = "14-16";  // 14到16岁
            } else {
                ageGroup = "16-18";  // 16到18岁
            }
            // Step 1: Get distinct types for the given age group and filters
            QueryWrapper<Question> typeQueryWrapper = new QueryWrapper<>();
            typeQueryWrapper.isNotNull("Answer")
                    .eq("age_Group", ageGroup);
            if (startDate != null && endDate != null) {
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                Date start = format.parse(startDate);
                Date end = format.parse(endDate);
                typeQueryWrapper.between("change_time", start, end);
            }
            if(questionType!=null){
            typeQueryWrapper.like("Type", questionType);}
            List<Question> typeQuestions = questionService.list(typeQueryWrapper);

            List<String> types = typeQuestions.stream()
                    .map(Question::getType)
                    .distinct()
                    .collect(Collectors.toList());

            // Step 2: Get questions for each type and assemble the final page
            List<Question> pageQuestions = new ArrayList<>();
            for (String type : types) {
                String questionId = getLastQuestion(email, type);
                Question question = getQuestion(questionId);
                if (question != null) {
                    boolean add = pageQuestions.add(question);
                }
            }

            // Pagination logic
            int startIndex = Math.toIntExact(current * 5 - 5);
            int endIndex = Math.min(startIndex + 5, pageQuestions.size());
            List<Question> paginatedQuestions = pageQuestions.subList(startIndex, endIndex);

            // Create a Page object using the default constructor
            Page<Question> page = new Page<>();
            page.setRecords(paginatedQuestions);
            page.setCurrent(current);
            page.setSize(5);
            page.setTotal(pageQuestions.size());

            return Result.ok(page);
        } catch (ParseException e) {
            e.printStackTrace();
            return Result.fail().message("An error occurred while processing the request.");
        }
    }




    private String getLastQuestion(String email, String type) {
        QueryWrapper<History> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("Type", type)
                .eq("Email", email)
                .orderByDesc("Change_Time")
                .last("LIMIT 1");

        History history = historyService.getOne(queryWrapper);

        if (history != null && !history.getQuestionId().isEmpty()) {
            return history.getQuestionId();
        }

        QueryWrapper<Question> questionQueryWrapper = new QueryWrapper<>();
        questionQueryWrapper.eq("Type", type)
                .eq("level", 1)
                .orderByDesc("Change_Time")
                .last("LIMIT 1")
                .isNotNull("Answer");

        Question question = questionService.getOne(questionQueryWrapper);

        return question != null ? question.getId() : null;
    }

    private Question getQuestion(String questionId) {
        return questionService.getById(questionId);
    }


    @PostMapping("/addHistory")
    public Result addHistory(@RequestParam String email, @RequestParam String Question_Id, @RequestParam(required = false) String Answer, @RequestParam String Feedback, @RequestParam String Type){
        History history = new History();
        history.setEmail(email);
        history.setQuestionId(Question_Id);
        history.setType(Type);
        if(Answer!=null)history.setAnswer(Answer);
        history.setFeedback(Feedback);
        if (historyService.save(history)) {
            return Result.ok().message("History added successful.");
        } else {
            return Result.fail().message("Failed to add history.");
        }
    }
}
