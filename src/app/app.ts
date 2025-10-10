import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { UserDataService } from './core/services/user-data.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    LoaderComponent,
    NotificationComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private userDataService = inject(UserDataService);
}
