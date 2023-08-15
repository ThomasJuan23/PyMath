package com.example.pymath1.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pymath1.entity.History;
import com.example.pymath1.entity.User;
import com.example.pymath1.result.Result;
import com.example.pymath1.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/History")
public class HistoryController {
    @Autowired
    private HistoryService historyService;


    @GetMapping("/findAll")
    public Result findAllUser(@RequestParam long current, @RequestParam String emailAddress){
        Page<History> page = new Page<>(current,10);
        QueryWrapper<History> emailQuery = new QueryWrapper<>();
        emailQuery.eq("Email", emailAddress);
        Page<History> list = historyService.page(page,emailQuery);
        return Result.ok(list);
    }

    @PostMapping("/addHistory")
    public Result addHistory(@RequestParam String email, @RequestParam String Question_Id, @RequestParam(required = false) String Answer, @RequestParam String Feedback){
        History history = new History();
        history.setEmail(email);
        history.setQuestionId(Question_Id);
        if(Answer!=null)history.setAnswer(Answer);
        history.setFeedback(Feedback);
        if (historyService.save(history)) {
            return Result.ok().message("History added successful.");
        } else {
            return Result.fail().message("Failed to add history.");
        }
    }
}
