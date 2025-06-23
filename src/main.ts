(window as any).global = window;

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { NgApexchartsModule } from 'ng-apexcharts';

bootstrapApplication(AppComponent, {

  providers: [
    provideRouter(appRoutes),
    provideHttpClient(), // Provide HttpClient here
    { provide: NgApexchartsModule, useValue: NgApexchartsModule }

  ]
}).catch(err => console.error(err));