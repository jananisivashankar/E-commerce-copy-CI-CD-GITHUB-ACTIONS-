package com.Revature.Ecommerce.Platform.CustomExceptions;

import com.Revature.Ecommerce.Platform.dto.ApiResponse;
import com.Revature.Ecommerce.Platform.CustomExceptions.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 🔴 404 NOT FOUND
    @ExceptionHandler({
            ProductNotFoundException.class,
            CartNotFoundException.class,
            OrderNotFoundException.class,
            ResourceNotFoundException.class,
            WishListNotFound.class
    })
    public ResponseEntity<ApiResponse<?>> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    // 🔴 400 BAD REQUEST
    @ExceptionHandler({
            InvalidRequestException.class,
            InvalidFilterException.class,
            QuantityExceedStockException.class,
            EmptyCartException.class,
            CartItemNotFoundException.class
    })
    public ResponseEntity<ApiResponse<?>> handleBadRequest(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    // 🔴 401 UNAUTHORIZED
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<?>> handleUnauthorized(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    // 🔴 409 CONFLICT (business rule violation)
    @ExceptionHandler(OrderCancelAfterShippingEXception.class)
    public ResponseEntity<ApiResponse<?>> handleConflict(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    // 🔴 FALLBACK (anything else)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
}