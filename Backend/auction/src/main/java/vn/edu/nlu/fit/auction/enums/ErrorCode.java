package vn.edu.nlu.fit.auction.enums;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // General Errors
    BAD_REQUEST (400, HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.getReasonPhrase()),
    NOT_FOUND (404, HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND.getReasonPhrase()),
    RESOURCE_ALREADY_EXISTS(400, HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.getReasonPhrase());
    int code;
    HttpStatus httpStatus;
    String message;

    ErrorCode(int code, HttpStatus httpStatus, String message) {
        this.code = code;
        this.httpStatus = httpStatus;
        this.message = message;
    }
    
}
