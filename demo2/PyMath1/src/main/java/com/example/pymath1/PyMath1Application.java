package com.example.pymath1;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

@SpringBootApplication
@MapperScan("com.example.pymath1.mapper")
public class PyMath1Application {

    public static void main(String[] args) {
        SpringApplication.run(PyMath1Application.class, args);
    }

}
