import { Component } from '@angular/core';
import { Tasks } from './tasks/tasks';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Tasks],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
