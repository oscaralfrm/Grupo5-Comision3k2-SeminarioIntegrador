package com.harp.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class SolicitudInvalidaException extends RuntimeException {
    public SolicitudInvalidaException(String message){
        super(message);
    }
}
