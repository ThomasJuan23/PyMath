package com.example.pymath1.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pymath1.entity.Question;
import com.example.pymath1.entity.User;
import com.example.pymath1.result.Result;
import com.example.pymath1.service.CodeExecutionService;
import com.example.pymath1.service.QuestionService;
import com.example.pymath1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/public/Question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CodeExecutionService codeExecutionService; // 注入CodeExecutionService

    @PutMapping("/verifyAnswer")
    public Result verifyAnswer(@RequestParam String code, @RequestParam String questionID) {
        // 1. 通过questionID获取答案
        Question question = getQuestion(questionID);
        if (question == null) {
            return Result.fail().message("Question not found.");
        }

        String answerCode = question.getAnswer();
        if (answerCode == null || answerCode.trim().isEmpty()) {
            return Result.fail().message("No answer found for the given question.");
        }

        try {
            // 2. 执行用户提供的代码
            String userOutput = codeExecutionService.executeCode(code);

            // 3. 执行数据库中的答案代码
            String answerOutput = codeExecutionService.executeCode(answerCode);

            // 4. 比较两个输出
            if (userOutput.equals(answerOutput)) {
                return Result.ok(userOutput).message("Execution is correct!");
            } else {
                return Result.fail(userOutput).message("Execution is incorrect.");
            }

        } catch (Exception e) {
            return Result.fail().message("An error occurred during code execution: " + e.getMessage());
        }
    }

    @PostMapping("/provideAnswer")
    public Result provideAnswer(
            @RequestParam String questionID,
            @RequestParam String answer,
            @RequestParam String adminEmail,
            @RequestParam String adminPass,
            @RequestParam(required = false) String answerExplain) {

        // 检查管理员凭据
        QueryWrapper<User> adminQuery = new QueryWrapper<>();
        adminQuery.eq("Email", adminEmail);
        User adminUser = userService.getOne(adminQuery);
        if (adminUser == null || !passwordEncoder.matches(adminPass, adminUser.getPassword()) || !"admin".equalsIgnoreCase(adminUser.getType())) {
            return getMessage();
        }

        // 获取问题实体
        Question questionToUpdate = getQuestion(questionID);
        if (questionToUpdate == null) {
            return Result.fail().message("Question not found.");
        }

        // 更新问题的答案
        questionToUpdate.setAnswer(answer);

        // 如果提供了答案解释，则更新
        if (answerExplain != null && !answerExplain.trim().isEmpty()) {
            questionToUpdate.setAnswerExplain(answerExplain);
        }

        // 保存更新
        if (questionService.updateById(questionToUpdate)) {
            return Result.ok().message("Answer provided successfully.");
        } else {
            return Result.fail().message("Failed to provide answer.");
        }
    }


    @PostMapping("/addQuestion")
    public Result addQuestion(
            @RequestParam String question,
            @RequestParam String level,
            @RequestParam String type,
            @RequestParam String ageGroup,
            @RequestParam String email) {

        // 检查必要的参数是否为空
        if (question == null || level == null || type == null || ageGroup == null || email == null) {
            return Result.fail().message("All fields are required.");
        }

        // 校验email格式
        if (!isValidEmail(email)) {
            return Result.fail().message("Invalid email format.");
        }

        // 检查email是否存在于User数据库中且type为teacher
        QueryWrapper<User> userQuery = new QueryWrapper<>();
        userQuery.eq("Email", email);
        User user = userService.getOne(userQuery);

        if (user == null) {
            return Result.fail().message("The provided email does not exist.");
        }

        if (!"teacher".equalsIgnoreCase(user.getType())) {
            return Result.fail().message("Only teachers can add questions.");
        }

        // 创建一个新的Question对象并设置其属性
        Question newQuestion = new Question();
        newQuestion.setQuestion(question);
        newQuestion.setLevel(level);
        newQuestion.setType(type);
        newQuestion.setAgeGroup(ageGroup);
        newQuestion.setEmail(email);

        // 使用MyBatis-Plus的服务来保存问题
        if (questionService.save(newQuestion)) {
            return Result.ok().message("Question added successfully.");
        } else {
            return Result.fail().message("Failed to add question.");
        }
    }

    // Email格式验证的辅助方法
    private boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$";
        return email != null && email.matches(regex);
    }


    @PutMapping("/editAnswer")
    public Result editAnswer(
            @RequestParam String questionID,
            @RequestParam(required = false) String answer,
            @RequestParam String adminEmail,
            @RequestParam String adminPass,
            @RequestParam(required = false) String answerExplain) {

        // 检查管理员凭据
        QueryWrapper<User> adminQuery = new QueryWrapper<>();
        adminQuery.eq("Email", adminEmail);
        User adminUser = userService.getOne(adminQuery);
        if (getAdminUser(adminUser) == null || !passwordEncoder.matches(adminPass, adminUser.getPassword()) || !"admin".equalsIgnoreCase(adminUser.getType())) {
            return getMessage();
        }

        // 获取问题实体
        Question questionToUpdate = getQuestion(questionID);
        if (questionToUpdate == null) {
            return Result.fail().message("Question not found.");
        }

        // 如果提供了新答案，则更新
        if (answer != null && !answer.trim().isEmpty()) {
            questionToUpdate.setAnswer(answer);
        }

        // 如果提供了答案解释，则更新
        if (answerExplain != null && !answerExplain.trim().isEmpty()) {
            questionToUpdate.setAnswerExplain(answerExplain);
        }

        // 保存更新
        if (questionService.updateById(questionToUpdate)) {
            return Result.ok().message("Answer edited successfully.");
        } else {
            return Result.fail().message("Failed to edit answer.");
        }
    }

    @DeleteMapping("/deleteQuestion")
    public Result deleteQuestion(@RequestParam String email, @RequestParam String questionId) {

        // 根据邮箱获取User
        QueryWrapper<User> userQuery = new QueryWrapper<>();
        userQuery.eq("Email", email);
        User user = userService.getOne(userQuery);

        if (user == null) {
            return Result.fail().message("Invalid email.");
        }

        // 根据questionId获取Question
        QueryWrapper<Question> questionQuery = new QueryWrapper<>();
        questionQuery.eq("Id", questionId);
        Question question = questionService.getOne(questionQuery);

        if (question == null) {
            return Result.fail().message("Question not found.");
        }

        // 检查权限
        if (email.equals(question.getEmail()) || "admin".equalsIgnoreCase(user.getType())) {
            // 允许删除操作
            if (questionService.removeById(questionId)) {
                return Result.ok().message("Question deleted successfully.");
            } else {
                return Result.fail().message("Failed to delete question.");
            }
        } else {
            return Result.fail().message("Permission denied.");
        }
    }

    @GetMapping("/getUserQuestionList")
    public Result getUserQuestionList(@RequestParam long current, @RequestParam(required = false) String type, @RequestParam String ageGroup) {
        Page<Question> page = new Page<>(current,10);
        QueryWrapper<Question> questionQuery = new QueryWrapper<>();
        questionQuery.eq("level", "1");  // 查询 level = 1 的问题
        if (type != null && !type.isEmpty()) {
            questionQuery.eq("Type", type);  // 如果type有值，根据type过滤
        }
        questionQuery.eq("Age_Group", ageGroup);  // 根据ageGroup过滤

        Page<Question> questions = questionService.page(page,questionQuery);

        if (questions != null) {
            return Result.ok(questions);
        } else {
            return Result.fail().message("No questions found.");
        }
    }

    @GetMapping("/getDistinctTypes")
    public Result getDistinctTypes() {
        List<Question> questions = questionService.list();

        if (questions != null && !questions.isEmpty()) {
            // 使用Java 8的流从问题列表中提取独特的"type"值
            List<String> uniqueTypes = questions.stream()
                    .map(Question::getType)
                    .distinct()
                    .collect(Collectors.toList());

            return Result.ok(uniqueTypes);
        } else {
            return Result.fail().message("No types found.");
        }
    }

    @GetMapping("/getQuestions")
    public Result getQuestions(
            @RequestParam long current,
            @RequestParam(required = false) String questionID,
            @RequestParam(required = false) String questionContent,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) Boolean hasAnswer,
            @RequestParam(required = false) String email) {

        // 使用QueryWrapper构建查询条件
        QueryWrapper<Question> questionQuery = new QueryWrapper<>();

        if (questionID != null && !questionID.trim().isEmpty()) {
            questionQuery.like("Id", questionID);
        }

        if (questionContent != null && !questionContent.trim().isEmpty()) {
            questionQuery.like("Question", questionContent);  // 使用LIKE进行模糊匹配
        }

        if (type != null && !type.trim().isEmpty()) {
            questionQuery.eq("Type", type);
        }

        if (ageGroup != null && !ageGroup.trim().isEmpty()) {
            questionQuery.eq("Age_Group", ageGroup);
        }

        if (hasAnswer != null) {
            if (hasAnswer) {
                questionQuery.isNotNull("Answer");
            } else {
                questionQuery.isNull("Answer");
            }
        }

        if (email != null && !email.trim().isEmpty()) {
            questionQuery.eq("Email", email);
        }

        Page<Question> page = new Page<>(current,10);

        Page<Question> questions = questionService.page(page,questionQuery);

        if (questions != null) {
            return Result.ok(questions);
        } else {
            return Result.fail().message("No questions found.");
        }
    }

    @PutMapping("/editQuestion")
    public Result editQuestion(
            @RequestParam String email,
            @RequestParam String questionId,
            @RequestParam(required = false) String question,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) String level) {

        // 根据邮箱获取User
        QueryWrapper<User> userQuery = new QueryWrapper<>();
        userQuery.eq("Email", email);
        User user = userService.getOne(userQuery);

        if (user == null) {
            return Result.fail().message("Invalid email.");
        }

        // 根据questionId获取Question
        QueryWrapper<Question> questionQuery = new QueryWrapper<>();
        questionQuery.eq("Id", questionId);
        Question questionToUpdate = questionService.getOne(questionQuery);

        if (questionToUpdate == null) {
            return Result.fail().message("Question not found.");
        }

        // 检查权限
        if (!email.equals(questionToUpdate.getEmail()) && !"admin".equalsIgnoreCase(user.getType())) {
            return Result.fail().message("Permission denied.");
        }

        // 根据提供的参数进行更新
        if (question != null && !question.trim().isEmpty()) {
            questionToUpdate.setQuestion(question);
        }

        if (type != null && !type.trim().isEmpty()) {
            questionToUpdate.setType(type);
        }

        if (ageGroup != null && !ageGroup.trim().isEmpty()) {
            questionToUpdate.setAgeGroup(ageGroup);
        }

        if (level != null && !level.trim().isEmpty()) {
            questionToUpdate.setLevel(level);
        }

        // 使用MyBatis-Plus的服务来保存问题
        if (questionService.updateById(questionToUpdate)) {
            return Result.ok().message("Question updated successfully.");
        } else {
            return Result.fail().message("Failed to update question.");
        }
    }


    private static Result<Object> getMessage() {
        return Result.fail().message("Invalid admin credentials.");
    }

    private Question getQuestion(String questionID) {
        return questionService.getById(questionID);
    }

    private static User getAdminUser(User adminUser) {
        return adminUser;
    }


}
