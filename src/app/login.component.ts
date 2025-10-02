import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <form (ngSubmit)="onLogin()" class="login-form">
        <h2>Login</h2>
        
        <div class="form-group">
          <input 
            type="email" 
            [(ngModel)]="email" 
            name="email"
            placeholder="Email" 
            required>
        </div>
        
        <div class="form-group">
          <input 
            type="password" 
            [(ngModel)]="password" 
            name="password"
            placeholder="Password" 
            required>
        </div>
        
        <button type="submit" [disabled]="loading">
          {{loading ? 'Logging in...' : 'Login'}}
        </button>
        
        <div *ngIf="error" class="error">{{error}}</div>
        <div *ngIf="success" class="success">{{success}}</div>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .login-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    button {
      width: 100%;
      padding: 0.75rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }
    
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .error {
      color: #dc3545;
      margin-top: 1rem;
      text-align: center;
    }
    
    .success {
      color: #28a745;
      margin-top: 1rem;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Login successful!';
        console.log('Login response:', response);
        // Store token if needed
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Login failed';
        console.error('Login error:', error);
      }
    });
  }
}