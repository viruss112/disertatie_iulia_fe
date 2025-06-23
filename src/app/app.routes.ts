import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';

export const appRoutes: Routes = [
  { path: '', component: LoginComponent }, // Default route
  { path: 'home', component: HomepageComponent }, // Homepage route
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) }, // Register route
  { path: '**', redirectTo: '' } // Redirect unmatched routes to login
];