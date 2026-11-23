import { Component, OnInit, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Task } from '../models/task';

import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);

  // List of tasks
  tasks = signal<Task[]>([]);

  // Form fields
  title = '';
  description = '';

  // Edit fields
  editingId: number | null = null;
  editTitle = '';

  // Loading and error states
  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadTasks();
  }

  // GET: Load all tasks
  loadTasks(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },

      error: (error) => {
        console.error(error);

        this.errorMessage.set('Impossible de récupérer les tâches.');

        this.loading.set(false);
      },
    });
  }

  // POST: Add a new task
  addTask(): void {
    if (!this.title.trim()) {
      return;
    }

    this.taskService
      .addTask({
        title: this.title.trim(),

        description: this.description.trim(),
      })
      .subscribe({
        next: (newTask) => {
          this.tasks.update((tasks) => [newTask, ...tasks]);

          this.title = '';
          this.description = '';
        },

        error: (error) => {
          console.error(error);

          this.errorMessage.set('Erreur lors de la création de la tâche.');
        },
      });
  }

  // Start editing a task
  startEdit(task: Task): void {
    this.editingId = task.id;

    this.editTitle = task.title;
  }

  // PUT: Save task changes
  saveEdit(task: Task): void {
    if (!this.editTitle.trim()) {
      return;
    }

    this.taskService
      .updateTask(task.id, {
        title: this.editTitle.trim(),
      })
      .subscribe({
        next: (updatedTask) => {
          this.tasks.update((tasks) =>
            tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
          );

          this.editingId = null;
          this.editTitle = '';
        },

        error: (error) => {
          console.error(error);

          this.errorMessage.set('Erreur lors de la modification.');
        },
      });
  }

  // PUT: Toggle completed status
  toggleTask(task: Task): void {
    this.taskService
      .updateTask(task.id, {
        completed: !task.completed,
      })
      .subscribe({
        next: (updatedTask) => {
          this.tasks.update((tasks) =>
            tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
          );
        },

        error: (error) => {
          console.error(error);

          this.errorMessage.set('Erreur lors du changement de statut.');
        },
      });
  }

  // DELETE: Remove a task
  deleteTask(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
      },

      error: (error) => {
        console.error(error);

        this.errorMessage.set('Erreur lors de la suppression.');
      },
    });
  }
}
