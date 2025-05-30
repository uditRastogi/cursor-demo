import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, TaskListComponent, HttpClientModule]
})
export class AppComponent {
  title = 'Task Manager';
}
