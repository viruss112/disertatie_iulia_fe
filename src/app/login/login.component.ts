import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router, private http: HttpClient) {}

  onLogin() {
    const loginPayload = {
      username: this.email,
      password: this.password
    };

    this.http.post('http://localhost:9090/api/users/login', loginPayload).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);
        this.userService.setUser(response);
        this.router.navigate(['/home']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login failed', error);
        if (error.status === 500) {
          this.errorMessage = error.error.errorDevMessage || 'An error occurred. Please try again.';
        } else {
          this.errorMessage = 'Unexpected error. Please try again.';
        }
      }
    });
  }

  onForgotPassword() {
    console.log('Forgot Password clicked');
    // Add forgot password logic here
  }

  onSignUp(): void {
    this.router.navigate(['/register']); // Use the injected Router instance
  }
}