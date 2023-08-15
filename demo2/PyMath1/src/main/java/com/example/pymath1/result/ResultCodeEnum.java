package com.example.pymath1.result;

import lombok.Getter;

/**
 * Unified return result status information class
 */
@Getter
public enum ResultCodeEnum {

    SUCCESS(200, "Success"),
    FAIL(201, "Failure"),
    PARAM_ERROR(202, "Incorrect parameter"),
    SERVICE_ERROR(203, "Service exception"),
    DATA_ERROR(204, "Data exception"),
    DATA_UPDATE_ERROR(205, "Data version exception"),

    LOGIN_AUTH(208, "Not logged in"),
    PERMISSION(209, "No permission"),

    CODE_ERROR(210, "Verification code error"),
    //    LOGIN_MOBLE_ERROR(211, "Account incorrect"),
    LOGIN_DISABLED_ERROR(212, "This user has been disabled"),
    REGISTER_MOBLE_ERROR(213, "Mobile number has already been used"),
    LOGIN_AURH(214, "Need to log in"),
    LOGIN_ACL(215, "No permission"),

    URL_ENCODE_ERROR(216, "URL encoding failed"),
    ILLEGAL_CALLBACK_REQUEST_ERROR(217, "Illegal callback request"),
    FETCH_ACCESSTOKEN_FAILD(218, "Failed to obtain accessToken"),
    FETCH_USERINFO_ERROR(219, "Failed to fetch user information"),
    //LOGIN_ERROR(23005, "Login failed"),

    PAY_RUN(220, "Payment in progress"),
    CANCEL_ORDER_FAIL(225, "Failed to cancel order"),
    CANCEL_ORDER_NO(225, "Cannot cancel reservation"),

    HOSCODE_EXIST(230, "Hospital code already exists"),
    NUMBER_NO(240, "Not enough numbers for reservation"),
    TIME_NO(250, "Cannot reserve at this time"),

    SIGN_ERROR(300, "Signature error"),
    HOSPITAL_OPEN(310, "Hospital not open, cannot access temporarily"),
    HOSPITAL_LOCK(320, "Hospital is locked, cannot access temporarily"),
    ;

    private Integer code;
    private String message;

    private ResultCodeEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
