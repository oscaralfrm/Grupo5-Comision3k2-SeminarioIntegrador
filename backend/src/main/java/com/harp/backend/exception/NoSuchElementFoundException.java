package com.harp.backend.exception;

import org.springframework.http.HttpStatus;

public class NoSuchElementFoundException extends RuntimeException {
    public NoSuchElementFoundException(String message){
        super(message);
    }
}


