import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStore } from '../../../store/auth.store';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { AutoFocusDirective } from '../../../shared/directives/auto-focus.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AutoFocusDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, CustomValidators.minLength(2)]],
    email: ['', [Validators.required, CustomValidators.email]],
    password: ['', [Validators.required, CustomValidators.password]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: CustomValidators.passwordMatch });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { confirmPassword, ...registerData } = this.registerForm.getRawValue();

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.authStore.login(response.user, response.token);
          this.router.navigate(['/courses']);
        },
        error: (error) => {
          this.errorMessage.set(
            error.error?.message || 'Registration failed. Please try again.'
          );
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}