package com.example.pymath1.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pymath1.entity.User;
import com.example.pymath1.entity.Verify;
import com.example.pymath1.result.Result;
import com.example.pymath1.service.EmailService;
import com.example.pymath1.service.UserService;
import com.example.pymath1.service.VerifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/public/User")
public class UserController {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private VerifyService  verifyService;

    @Autowired
    private EmailService emailService;

  //Send an email verification code request
    @PutMapping("/send-email")
    public Result sendEmail(@RequestParam String emailAddress) {
        try {
            // check if the email is existed
            QueryWrapper<User> emailQuery = new QueryWrapper<>();
            emailQuery.eq("Email", emailAddress);
            if (userService.count(emailQuery) > 0) {
                return Result.fail().message("Email address already exists.");
            } //generate the captcha
            String captcha = generateCaptcha();
            emailService.sendSimpleMessage(emailAddress, "Your Verification Code", "Your verification code is: " + captcha);
            Verify newVerify = new Verify();
            newVerify.setEmail(emailAddress);
            newVerify.setCode(captcha);
            verifyService.save(newVerify);
            return Result.ok().message("Verification code sent successfully.");
        } catch(Exception e) {
            return Result.fail().message(e.getMessage());
        }
    }


    //Verify the verification code entered by the user
    @PutMapping("/verify-email")
    public Result verifyEmail(@RequestParam String emailAddress, @RequestParam String userCaptcha) {
        QueryWrapper<Verify> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", emailAddress)
                .orderByDesc("Create_Time")  // order by create time
                .last("LIMIT 1");
        Verify verify = verifyService.getOne(queryWrapper);

        if (verify == null) {
            return Result.fail().message("Not Found");
        }

        String sessionCaptcha = verify.getCode();
        if (sessionCaptcha != null && sessionCaptcha.equals(userCaptcha)) {
            return Result.ok();
        } else {
            return Result.fail().message("Invalid Code");
        }
    }

  //Verify login information
    @PutMapping("/login")
    public Result loginUser(@RequestParam String email, @RequestParam String password) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        User user = userService.getOne(queryWrapper);

        if (user == null) {
            return Result.fail().message("User not found");
        }

        boolean judge = passwordEncoder.matches(password, user.getPassword());

        if (judge) {
            return Result.ok().message("Login successful");
        } else {
            return Result.fail().message("Invalid credentials");
        }
    }


  //register a new user
    @PostMapping("/register")
    public Result postRegister(
            @RequestParam String email,
            @RequestParam String username,
            @RequestParam String role,
            @RequestParam String password,
            @RequestParam String birthday,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) String institution,
            @RequestParam(required = false) String realName,
            @RequestParam(required = false) String idCard,
            @RequestParam String safeQ,
            @RequestParam String safeA) {

        // check null
        if (email == null || username == null || role == null || password == null ||
                birthday == null || safeQ == null || safeA == null) {
            return Result.fail().message("Required parameters are missing.");
        }

        // check double email
        QueryWrapper<User> emailQuery = new QueryWrapper<>();
        emailQuery.eq("Email", email);
        if (userService.count(emailQuery) > 0) {
            return Result.fail().message("Email already exists.");
        }

        if (!isValidEmail(email)) {
            return Result.fail().message("Invalid email format.");
        }

        // check role valid
        if (!"teacher".equalsIgnoreCase(role) && !"student".equalsIgnoreCase(role)&& !"admin".equalsIgnoreCase(role)) {
            return Result.fail().message("Invalid user role.");
        }

        // get the birthday
        LocalDate parsedBirthday;
        try {
            parsedBirthday = LocalDate.parse(birthday);
        } catch (DateTimeParseException e) {
            return Result.fail().message("Invalid birthday format.");
        }

        // save the new user
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setUserName(username);
        newUser.setType(role);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setBirthday(parsedBirthday);
        if (ageGroup != null) newUser.setAgeGroup(ageGroup);
        if (institution != null) newUser.setInstitution(institution);
        if (realName != null) newUser.setRealName(realName);
        if (idCard != null) newUser.setSchoolId(idCard);
        newUser.setSafeQuestion(safeQ);
        newUser.setSafeAnswer(passwordEncoder.encode(safeA));

        if (userService.save(newUser)) {
            return Result.ok().message("User registration successful.");
        } else {
            return Result.fail().message("Failed to register user.");
        }
    }


    private boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9+_.-]+@(.+)$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
   //eturn the safe question of a user
    @GetMapping("safequestion")
    public Result getSafeQuestion(@RequestParam String email){
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        User user = userService.getOne(queryWrapper);
        return Result.ok(user.getSafeQuestion());
    }
  //Verify the safe answer of a use
    @PostMapping("/verifysafeanswer")
    public Result verifySafeAnswer(
            @RequestParam String email,
            @RequestParam String userSafeAnswer) {

        // check null
        if (email == null || userSafeAnswer == null) {
            return Result.fail().message("Required fields cannot be null.");
        }

        // get the user object
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("Email", email);
        User user = userService.getOne(queryWrapper);

        // check if user exist
        if (user == null) {
            return Result.fail().message("User not found");
        }

        // compare the safe answer
        if (passwordEncoder.matches(userSafeAnswer,user.getSafeAnswer())) {
            return Result.ok().message("Safe answer is correct.");
        } else {
            return Result.fail().message("Safe answer is incorrect.");
        }
    }

    //change a password of a user
    @PutMapping("/changepassword")
    public Result changePassword(@RequestParam String email, @RequestParam String newPassword) {
        QueryWrapper<User> emailQuery = new QueryWrapper<>();
        emailQuery.eq("Email", email);
        User user = userService.getOne(emailQuery);

        if (user == null) {
            return Result.fail().message("User not found");
        }

        // Encrypt the new password
        user.setPassword(passwordEncoder.encode(newPassword));

        if (userService.updateById(user)) {
            return Result.ok().message("Password changed successfully.");
        } else {
            return Result.fail().message("Password change failed.");
        }
    }
  //Edit personal information on the user end
    @PutMapping("/changeinfouserend")
    public Result changeInfoUserend(
            @RequestParam String email,
            @RequestParam String username,
            @RequestParam String birthday,
            @RequestParam(required = false) String ageGroup,
            @RequestParam(required = false) String institution,
            @RequestParam(required = false) String realName,
            @RequestParam(required = false) String idCard) {

        QueryWrapper<User> emailQuery = new QueryWrapper<>();
        emailQuery.eq("Email", email);
        User user = userService.getOne(emailQuery);
        if (user == null) {
            return Result.fail().message("User not found");
        }

        user.setUserName(username);
        LocalDate parsedBirthday = LocalDate.parse(birthday);
        user.setBirthday(parsedBirthday);
        if(ageGroup!=null) {
            user.setAgeGroup(ageGroup);
        }
        if(institution!=null) {
            user.setInstitution(institution);
        }
        if(realName!=null) {
            user.setRealName(realName);
        }
        if(idCard!=null) {
            user.setSchoolId(idCard);
        }
        if (userService.updateById(user)) {
            return Result.ok().message("User info updated successfully.");
        } else {
            return Result.fail().message("User info update failed.");
        }
    }
  //change the safe question and safe answer of a user
    @PutMapping("/changeinfoadminend")
    public Result changeInfoAdminend(
            @RequestParam String email,
            @RequestParam String safeQuestion,
            @RequestParam String safeAnswer,
            @RequestParam String adminEmail,
            @RequestParam String adminPass) {

        // check the password of admin
        QueryWrapper<User> adminQuery = new QueryWrapper<>();
        adminQuery.eq("Email", adminEmail);
        User adminUser = userService.getOne(adminQuery);

        if (adminUser == null || !passwordEncoder.matches(adminPass, adminUser.getPassword())) {
            return Result.fail().message("Invalid admin credentials.");
        }
        // check the role
        if (!"admin".equalsIgnoreCase(adminUser.getType())) {
            return Result.fail().message("User is not an admin.");
        }

        QueryWrapper<User> emailQuery = new QueryWrapper<>();
        emailQuery.eq("Email", email);
        User user = userService.getOne(emailQuery);

        if (user == null) {
            return Result.fail().message("User not found");
        }

        // Save hashed version of safeAnswer
        String hashedSafeAnswer = passwordEncoder.encode(safeAnswer);

        user.setSafeQuestion(safeQuestion);
        user.setSafeAnswer(hashedSafeAnswer);

        if (userService.updateById(user)) {
            return Result.ok().message("Admin-end user info updated successfully.");
        } else {
            return Result.fail().message("Admin-end user info update failed.");
        }
    }


    @DeleteMapping("/deleteUser")
    public Result deleteUser(@RequestParam String email,
                             @RequestParam String adminEmail,
                             @RequestParam String adminPass) {
        // check the role of email
        QueryWrapper<User> adminQuery = new QueryWrapper<>();
        adminQuery.eq("Email", adminEmail);
        User adminUser = userService.getOne(adminQuery);

        if (adminUser == null
                || !passwordEncoder.matches(adminPass, adminUser.getPassword())
                || !"admin".equals(adminUser.getType())) {  // 假设“type”字段是一个字符串，用于表示用户的类型，且管理员的值为"admin"
            return Result.fail().message("Invalid admin credentials.");
        }

        // delete
        QueryWrapper<User> userQuery = new QueryWrapper<>();
        userQuery.eq("Email", email);
        if (userService.remove(userQuery)) {
            return Result.ok().message("User deleted successfully.");
        } else {
            return Result.fail().message("Failed to delete user.");
        }
    }


    @GetMapping("/getUserList")
    public Result getUserList(@RequestParam long current,
                              @RequestParam(required = false) String type,
                              @RequestParam(required = false) String username,
                              @RequestParam(required = false) String email,
                              @RequestParam(required = false) String userId) {

        QueryWrapper<User> query = new QueryWrapper<>();
        if (type != null) {
            query.eq("Type", type);
        }
        if (username != null) {
            query.like("User_Name", username);
        }
        if (email != null) {
            query.like("Email", email);
        }
        if (userId != null) {
            query.like("Id", userId);
        }
        Page<User> page = new Page<>(current,5);
        Page<User> users = userService.page(page,query);
        if (users != null) {
            return Result.ok(users);
        } else {
            return Result.fail().message("No users found matching the criteria.");
        }
    }


    private String generateCaptcha() {
        int length = 6;
        String charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random rand = new Random();
        StringBuilder captcha = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            captcha.append(charset.charAt(rand.nextInt(charset.length())));
        }
        return captcha.toString();
    }


}
