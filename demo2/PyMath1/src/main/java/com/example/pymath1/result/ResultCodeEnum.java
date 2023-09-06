package com.example.pymath1.result;

import lombok.Getter;

/**
 * Unified return result status information class
 */
@Getter
public enum ResultCodeEnum {
    SUCCESS(200, "Success"),
    FAIL(201, "Failure"),
    ;

    private Integer code;
    private String message;

    private ResultCodeEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
