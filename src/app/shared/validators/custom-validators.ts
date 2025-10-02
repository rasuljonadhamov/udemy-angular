import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // email
  static email(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : { email: true };
  }

  // password
  static password(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const isLengthValid = value.length >= 8;
    
    const passwordValid = hasNumber && hasUpper && hasLower && isLengthValid;
    return !passwordValid ? { password: true } : null;
  }
  // min length
  static minLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      return value.length >= min ? null : { minlength: { requiredLength: min, actualLength: value.length } };
    };
  }


  static passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isLengthValid = value.length >= 8;

      const passwordValid = hasNumber && hasUpper && hasLower && isLengthValid;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  static emailDomain(allowedDomains: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;

      if (!email) {
        return null;
      }

      const domain = email.split('@')[1];
      const isAllowed = allowedDomains.some(
        (d) => domain?.toLowerCase() === d.toLowerCase()
      );

      return !isAllowed ? { emailDomain: { allowedDomains } } : null;
    };
  }

  static matchFields(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value1 = control.get(field1)?.value;
      const value2 = control.get(field2)?.value;

      return value1 === value2 ? null : { matchFields: true };
    };
  }

  static validUrl(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      try {
        new URL(value);
        return null;
      } catch {
        return { validUrl: true };
      }
    };
  }

  // phoneNumber
  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const phoneRegex =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      return phoneRegex.test(value) ? null : { phoneNumber: true };
    };
  }

  // noWhitespace
  static noWhitespace(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const isWhitespace = (value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

  // minArrayLength
  static minArrayLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!Array.isArray(value)) {
        return null;
      }

      return value.length >= min
        ? null
        : { minArrayLength: { min, actual: value.length } };
    };
  }


  static creditCard(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const cleaned = value.replace(/[\s-]/g, '');

      if (!/^\d+$/.test(cleaned)) {
        return { creditCard: true };
      }

      let sum = 0;
      let double = false;

      for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);

        if (double) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
        double = !double;
      }

      return sum % 10 === 0 ? null : { creditCard: true };
    };
  }

  static minAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= minAge
          ? null
          : { minAge: { min: minAge, actual: age - 1 } };
      }

      return age >= minAge ? null : { minAge: { min: minAge, actual: age } };
    };
  }
}
