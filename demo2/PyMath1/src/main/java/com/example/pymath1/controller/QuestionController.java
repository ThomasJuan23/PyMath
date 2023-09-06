package com.example.pymath1.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pymath1.entity.Message;
import com.example.pymath1.entity.Question;
import com.example.pymath1.entity.User;
import com.example.pymath1.result.Result;
import com.example.pymath1.service.CodeExecutionService;
import com.example.pymath1.service.MessageService;
import com.example.pymath1.service.QuestionService;
import com.example.pymath1.service.UserService;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Random;
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

    @Autowired
    private MessageService messageService;

    //Verify whether the user's answer results are consistent with the answer
    @PutMapping("/verifyAnswer")
    public Result verifyAnswer(@RequestParam String code, @RequestParam String questionID) {
        // 1. get the answer by question id
        Question question = getQuestion(questionID);
        if (question == null) {
            return Result.fail().message("Question not found.");
        }

        String answerCode = question.getAnswer();
        if (answerCode == null || answerCode.trim().isEmpty()) {
            return Result.fail().message("No answer found for the given question.");
        }

        try {
            // 2. execute the code user input
            String userOutput = codeExecutionService.executeCode(code);

            // 3. execute the code of answer
            String answerOutput = codeExecutionService.executeCode(answerCode);

            // 4. compare the output
            if (userOutput.equals(answerOutput)) {
                return Result.ok(userOutput).message("Execution is correct!");
            } else {
                return Result.fail(userOutput).message("Execution is incorrect.");
            }

        } catch (Exception e) {
            return Result.fail().message("An error occurred during code execution: " + e.getMessage());
        }
    }
  //Test code used to answer questions or provide questions
    @PutMapping("/runCode")
    public Result runAnswer(@RequestParam String code) {

        try {
            // Execute the code
            String userOutput = codeExecutionService.executeCode(code);
            return Result.ok(userOutput).message("Execution is correct!");

        } catch (Exception e) {
            return Result.fail().message("An error occurred during code execution: " + e.getMessage());
        }
    }
   //provide the answer of a question
    @PostMapping("/provideAnswer")
    public Result provideAnswer(
            @RequestParam String questionID,
            @RequestParam String answer,
            @RequestParam String adminEmail,
            @RequestParam String adminPass,
            @RequestParam(required = false) String answerExplain) {

        // Check for administrator identity
        QueryWrapper<User> adminQuery = new QueryWrapper<>();
        adminQuery.eq("Email", adminEmail);
        User adminUser = userService.getOne(adminQuery);
        if (adminUser == null || !passwordEncoder.matches(adminPass, adminUser.getPassword()) || !"admin".equalsIgnoreCase(adminUser.getType())) {
            return getMessage();
        }

        // get the object of question
        Question questionToUpdate = getQuestion(questionID);
        if (questionToUpdate == null) {
            return Result.fail().message("Question not found.");
        }

        // update the answer
        questionToUpdate.setAnswer(answer);

        // update the explain
        if (answerExplain != null && !answerExplain.trim().isEmpty()) {
            questionToUpdate.setAnswerExplain(answerExplain);
        }

        // save answer
        if (questionService.updateById(questionToUpdate)) {
            return Result.ok().message("Answer provided successfully.");
        } else {
            return Result.fail().message("Failed to provide answer.");
        }
    }

  // Teacher add a new question
    @PostMapping("/addQuestion")
    public Result addQuestion(
            @RequestParam String question,
            @RequestParam String level,
            @RequestParam String type,
            @RequestParam String ageGroup,
            @RequestParam String email) {

        // Check null
        if (question == null || level == null || type == null || ageGroup == null || email == null) {
            return Result.fail().message("All fields are required.");
        }

        // check the email format
        if (!isValidEmail(email)) {
            return Result.fail().message("Invalid email format.");
        }

        //check the role of the email
        QueryWrapper<User> userQuery = new QueryWrapper<>();
        userQuery.eq("Email", email);
        User user = userService.getOne(userQuery);

        if (user == null) {
            return Result.fail().message("The provided email does not exist.");
        }

        if (!"teacher".equalsIgnoreCase(user.getType())) {
            return Result.fail().message("Only teachers can add questions.");
        }

        // create a question object
        Question newQuestion = new Question();
        newQuestion.setQuestion(question);
        newQuestion.setLevel(level);
        newQuestion.setType(type);
        newQuestion.setAgeGroup(ageGroup);
        newQuestion.setEmail(email);

        // save the question
        if (questionService.save(newQuestion)) {
            QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
            userQueryWrapper.eq("Type","admin");
            List<User> adminList = userService.list(userQueryWrapper);
            if(adminList.isEmpty()){
                return Result.fail().message("No admin found to assign the question");
            }
            User randomAdmin = adminList.get(new Random().nextInt(adminList.size()));
            String receiverEmail = randomAdmin.getEmail();
            QueryWrapper<Question> questionQueryWrapper = new QueryWrapper<>();
            questionQueryWrapper.eq("Question",question)
            .eq("Level",level)
                    .eq("Type", type)
                    .eq("Age_Group",ageGroup)
                    .eq("Email",email)
                    .orderByDesc("Create_Time")
                    .last("LIMIT 1");
            Question q = questionService.getOne(questionQueryWrapper);
            String questionId = q.getId(); // Assuming the Question entity has an ID field

            // submit a new question request message
            QueryWrapper<User> senderWrapper = new QueryWrapper<>();
            senderWrapper.eq("Email", email);
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
           //get the threadid
            QueryWrapper<Message> threadWrapper = new QueryWrapper<>();
            threadWrapper.eq("Sender", email)
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
            message.setSender(email);
            message.setReceiver(receiverEmail);
            message.setContent("new_question");
            message.setType("question");
            message.setQuestionId(questionId);
            message.setThreadId(nextThreadId);

            messageService.saveOrUpdate(message);

            return Result.ok().message("Question added successfully.");
        } else {
            return Result.fail().message("Failed to add question.");
        }
    }

    // Check email format
    private boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$";
        return email != null && email.matches(regex);
    }

  //Edit the answer of a question
    @PutMapping("/editAnswer")
    public Result editAnswer(
            @RequestParam String questionID,
            @RequestParam(required = false) String answer,
            @RequestParam String adminEmail,
            @RequestParam String adminPass,
            @RequestParam(required = false) String answerExplain) {

        // Check for administrator identity
        QueryWrapper<User> adminQuery = new QueryWrapper<>();
        adminQuery.eq("Email", adminEmail);
        User adminUser = userService.getOne(adminQuery);
        if (getAdminUser(adminUser) == null || !passwordEncoder.matches(adminPass, adminUser.getPassword()) || !"admin".equalsIgnoreCase(adminUser.getType())) {
            return getMessage();
        }

        // get the question object
        Question questionToUpdate = getQuestion(questionID);
        if (questionToUpdate == null) {
            return Result.fail().message("Question not found.");
        }

        if (answer != null && !answer.trim().isEmpty()) {
            questionToUpdate.setAnswer(answer);
        }

        if (answerExplain != null && !answerExplain.trim().isEmpty()) {
            questionToUpdate.setAnswerExplain(answerExplain);
        }

        if (questionService.updateById(questionToUpdate)) {
            return Result.ok().message("Answer edited successfully.");
        } else {
            return Result.fail().message("Failed to edit answer.");
        }
    }
  //The creator and the admin can delete a question by this AP
    @DeleteMapping("/deleteQuestion")
    public Result deleteQuestion(@RequestParam String email, @RequestParam String questionId) {

        // get the user object
        QueryWrapper<User> userQuery = new QueryWrapper<>();
        userQuery.eq("Email", email);
        User user = userService.getOne(userQuery);

        if (user == null) {
            return Result.fail().message("Invalid email.");
        }

        // get the question object
        QueryWrapper<Question> questionQuery = new QueryWrapper<>();
        questionQuery.eq("Id", questionId);
        Question question = questionService.getOne(questionQuery);

        if (question == null) {
            return Result.fail().message("Question not found.");
        }

        // Check for administrator identity
        if (email.equals(question.getEmail()) || "admin".equalsIgnoreCase(user.getType())) {
            // Can delete
            if (questionService.removeById(questionId)) {
                return Result.ok().message("Question deleted successfully.");
            } else {
                return Result.fail().message("Failed to delete question.");
            }
        } else {
            return Result.fail().message("Permission denied.");
        }
    }

    //get all types by age group
    @GetMapping("/getTypesByAgeGroup")
    public Result getTypesByAgeGroup(@RequestParam String AgeGroup,@RequestParam(required = false) String startDate,
                                     @RequestParam(required = false) String endDate, @RequestParam(required = false) String Type){
        QueryWrapper<Question> queryWrapper = new QueryWrapper<>();
        queryWrapper.isNotNull("Answer");
        queryWrapper.eq("age_Group", AgeGroup);
        if(startDate!=null && endDate!=null) {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            try {
                Date start = format.parse(startDate);
                Date end = format.parse(endDate);
                queryWrapper.between("change_time", start, end);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        queryWrapper.like("Type",Type);
        List<Question> questions = questionService.list(queryWrapper);
        if (questions != null && !questions.isEmpty()) {
            // Using Java 8 streams to extract unique 'type' values from the list of questions
            List<String> uniqueTypes = questions.stream()
                    .map(Question::getType)
                    .distinct()
                    .collect(Collectors.toList());

            return Result.ok(uniqueTypes);
        } else {
            return Result.fail().message("No types found.");
        }
    }
//Get the previous question specific to a student who is doing this question
    @GetMapping("/getBeforeQuestion")
    public Result getBeforeQuestion(@RequestParam String email, @RequestParam String questionId) {
        try {
            QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
            userQueryWrapper.eq("Email", email);
            userQueryWrapper.last("LIMIT 1");
            User user = userService.getOne(userQueryWrapper);
            if (user == null) {
                return Result.fail().message("User not found");
            }
            //get the actual age group
            LocalDate birthDate =user.getBirthday();
            LocalDate currentDate = LocalDate.now();
            Period agePeriod = Period.between(birthDate, currentDate);
            String ageGroup;
            if (agePeriod.getYears() < 14 || (agePeriod.getYears() == 14 && agePeriod.getMonths() < 6)) {
                ageGroup = "11-14";
            } else if (agePeriod.getYears() < 16 || (agePeriod.getYears() == 16 && agePeriod.getMonths() < 6)) {
                ageGroup = "14-16";
            } else {
                ageGroup = "16-18";
            }
            //get the question object
            Question question = questionService.getById(questionId);
            if (question == null) {
                return Result.fail().message("Question not found");
            }
            String type = question.getType();
            String level = question.getLevel();
            Date changeTime = question.getChangeTime();
       //get the previous question
            String questionID = "";
            int i = 0;
            while (questionID.isEmpty()) {
                int newLevel = Integer.parseInt(level) - i;
                if (newLevel <= 0) {
                    return Result.ok("first one");
                }
                QueryWrapper<Question> queryWrapper1 = new QueryWrapper<>();
                queryWrapper1.isNotNull("Answer");
                queryWrapper1.eq("Type", type);
                queryWrapper1.eq("Age_Group", ageGroup);
                queryWrapper1.eq("Level", String.valueOf(newLevel));
                if (newLevel == Integer.parseInt(level)) {
                    queryWrapper1.lt("Change_Time", changeTime);
                }
                queryWrapper1.orderByDesc("Change_Time");
                queryWrapper1.last("LIMIT 1");
                Question q = questionService.getOne(queryWrapper1);
                if (q != null) {
                    questionID = q.getId();
                }
                i++;
            }
            return Result.ok(questionID);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail().message("An error occurred");
        }
    }


  //Get the next question specific to a student who is doing this question
    @GetMapping("/getAfterQuestion")
    public Result getAfterQuestion(@RequestParam String email, @RequestParam String questionId){
        try {
            QueryWrapper<User> userQueryWrapper = new QueryWrapper<>();
            userQueryWrapper.eq("Email", email);
            userQueryWrapper.last("LIMIT 1");
            User user = userService.getOne(userQueryWrapper);
            if (user == null) {
                return Result.fail().message("User not found");
            }
            LocalDate birthDate =user.getBirthday();
            LocalDate currentDate = LocalDate.now();
            Period agePeriod = Period.between(birthDate, currentDate);
            String ageGroup;
            if (agePeriod.getYears() < 14 || (agePeriod.getYears() == 14 && agePeriod.getMonths() < 6)) {
                ageGroup = "11-14";
            } else if (agePeriod.getYears() < 16 || (agePeriod.getYears() == 16 && agePeriod.getMonths() < 6)) {
                ageGroup = "14-16";
            } else {
                ageGroup = "16-18";
            }
            Question question = questionService.getById(questionId);
            if (question == null) {
                return Result.fail().message("Question not found");
            }
            String type = question.getType();
            String level = question.getLevel();
            Date changeTime = question.getChangeTime();

            String questionID = "";
            int i = 0;
            while (questionID.isEmpty()) {
                int newLevel = Integer.parseInt(level) + i;
                if (newLevel > 4) {
                    return Result.ok("last one");
                }
                QueryWrapper<Question> queryWrapper1 = new QueryWrapper<>();
                queryWrapper1.isNotNull("Answer");
                queryWrapper1.eq("Type", type);
                queryWrapper1.eq("Age_Group", ageGroup);
                queryWrapper1.eq("Level", String.valueOf(newLevel));
                if (newLevel == Integer.parseInt(level)) {
                    queryWrapper1.gt("Change_Time", changeTime);
                }
                queryWrapper1.orderByAsc("Change_Time");
                queryWrapper1.last("LIMIT 1");
                Question q = questionService.getOne(queryWrapper1);
                if (q != null) {
                    questionID = q.getId();
                }
                i++;
            }
            return Result.ok(questionID);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.fail().message("An error occurred");
        }
    }

    //get the distinct types of all questions to be an option filter

    @GetMapping("/getDistinctTypes")
    public Result getDistinctTypes() {
        List<Question> questions = questionService.list();

        if (questions != null && !questions.isEmpty()) {
            // Using Java 8 streams to extract unique 'type' values from the list of questions
            List<String> uniqueTypes = questions.stream()
                    .map(Question::getType)
                    .distinct()
                    .collect(Collectors.toList());

            return Result.ok(uniqueTypes);
        } else {
            return Result.fail().message("No types found.");
        }
    }
   //Get a list of questions based on filter criteria
    @GetMapping("/getQuestions")
    public Result getQuestions(
            @RequestParam long current,
            @RequestParam(required = false) String questionID,
            @RequestParam(required = false) String questionContent,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) Boolean hasAnswer,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
            ) {

        // use querywappper to query
        QueryWrapper<Question> questionQuery = new QueryWrapper<>();
        if(startDate!=null && endDate!=null) {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            try {
                Date start = format.parse(startDate);
                Date end = format.parse(endDate);
                questionQuery.between("change_time", start, end);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        if (questionID != null && !questionID.trim().isEmpty()) {
            questionQuery.like("Id", questionID);
        }

        if (questionContent != null && !questionContent.trim().isEmpty()) {
            questionQuery.like("Question", questionContent);  // Using LIKE for fuzzy matching
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

        Page<Question> page = new Page<>(current,5);

        Page<Question> questions = questionService.page(page,questionQuery);

        if (questions != null) {
            return Result.ok(questions);
        } else {
            return Result.fail().message("No questions found.");
        }
    }
  //Using LIKE for fuzzy matching
    @PutMapping("/editQuestion")
    public Result editQuestion(
            @RequestParam String email,
            @RequestParam String questionId,
            @RequestParam(required = false) String question,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) String level) {

        // get the user object
        QueryWrapper<User> userQuery = new QueryWrapper<>();
        userQuery.eq("Email", email);
        User user = userService.getOne(userQuery);

        if (user == null) {
            return Result.fail().message("Invalid email.");
        }

        // get the question object
        QueryWrapper<Question> questionQuery = new QueryWrapper<>();
        questionQuery.eq("Id", questionId);
        Question questionToUpdate = questionService.getOne(questionQuery);

        if (questionToUpdate == null) {
            return Result.fail().message("Question not found.");
        }

        // check the role
        if (!email.equals(questionToUpdate.getEmail()) && !"admin".equalsIgnoreCase(user.getType())) {
            return Result.fail().message("Permission denied.");
        }

        // update the question object
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

        //save the updated question
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
