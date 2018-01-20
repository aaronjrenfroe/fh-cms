import { ErrorHandler } from "@angular/core/src/error_handler";

export class AppErrorHandler implements ErrorHandler{

    handleError(error){
        // Do something
        alert('An Unexpected error occured '+ error);
    }
}