package com.harp.backend.exception;


import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class ErrorResponse {
    private Date tiempo = new Date();
    private String message;
    private String url;

    public ErrorResponse(String message, String url) {
        this.message = message;
        this.url = url.replace("uri=", "");
    }
}
