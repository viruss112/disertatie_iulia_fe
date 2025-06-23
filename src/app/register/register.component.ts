import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  username: string = '';
  password: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService, private location: Location, private router: Router, private http: HttpClient) {}

  onRegister(): void {
    const registerPayload = {
      username: this.username,
      password: this.password,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName
    };

    this.http.post('http://localhost:9090/api/users/register', registerPayload).subscribe({
      next: (response: any) => {
        if (response.successful) {
          this.userService.setUser(response); // Store user data in the service
          this.router.navigate(['/home']); // Redirect to homepage
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Registration failed', error);
        this.errorMessage = 'An error occurred. Please try again.';
      }
    });
  }

  onBack(): void {
    this.location.back();
  }
}