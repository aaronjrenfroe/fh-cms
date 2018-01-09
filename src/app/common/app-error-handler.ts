import { ErrorHandler } from "@angular/core/src/error_handler";
import { error } from "selenium-webdriver";

export class AppErrorHandler implements ErrorHandler{

    handleError(error){
        // Do something
        console.log(error);
        alert('An Unexpected error occured' );
    }
}