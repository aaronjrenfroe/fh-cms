import { AbstractControl, ValidationErrors } from "@angular/forms";

export class PasswordValidators {
  
  static mustMeetSpecialReqs(control : AbstractControl): ValidationErrors | null {
    let value = (control.value as String);
    let count = 0;
    if(value.match(/\d+/)){
      count += count + 1;
    }
    if (count >= 1){
      return null;
    }else{
      return {mustMeetSpecialReqs : true};
    }   
  }
}