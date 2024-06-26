package com.nbu.logisticcompany.controllers.helpers;

import com.nbu.logisticcompany.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationException(ValidationException ex) {
        return ResponseEntity.badRequest().body(ex.getErrors());
    }

    @ExceptionHandler(UnauthorizedOperationException.class)
    public ResponseEntity<String> handleUnauthorizedOperationException(UnauthorizedOperationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler(AuthenticationFailureException.class)
    public ResponseEntity<String> handleUnauthorizedOperationException(AuthenticationFailureException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(DuplicateEntityException.class)
    public ResponseEntity<String> handleDuplicateEntityException(DuplicateEntityException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidDataException.class)
    public ResponseEntity<String> handleInvalidDataException(InvalidDataException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

}

