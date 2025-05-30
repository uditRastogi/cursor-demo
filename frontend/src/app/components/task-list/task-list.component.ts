import { Component, OnInit } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnakeGameComponent } from '../snake-game/snake-game.component';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, SnakeGameComponent]
})
export class TaskListComponent implements OnInit {
    tasks: Task[] = [];
    newTask: Task = this.getInitialTaskState();
    editingTask: Task | null = null;
    isCreateTaskFormVisible = false;
    TaskStatus = TaskStatus; // Make enum available in template
    JSON = JSON; // Make JSON available in template

    constructor(private taskService: TaskService) { }

    private getInitialTaskState(): Task {
        return {
            title: '',
            description: '',
            completed: false,
            type: 'website',
            status: TaskStatus.TODO,
            assignees: [],
            progress: 0
        };
    }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.taskService.getAllTasks().subscribe({
            next: (tasks) => {
                // Ensure all tasks have proper enum values
                this.tasks = tasks.map(task => ({
                    ...task,
                    status: TaskStatus[task.status as keyof typeof TaskStatus]
                }));
            },
            error: (error) => console.error('Error loading tasks:', error)
        });
    }

    getTodoTasks(): Task[] {
        return this.tasks.filter(task => task.status === TaskStatus.TODO);
    }

    getInProgressTasks(): Task[] {
        return this.tasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
    }

    getInReviewTasks(): Task[] {
        return this.tasks.filter(task => task.status === TaskStatus.IN_REVIEW);
    }

    getDoneTasks(): Task[] {
        return this.tasks.filter(task => task.status === TaskStatus.DONE);
    }

    showFilters(): void {
        // Implement filter functionality
        console.log('Show filters clicked');
    }

    openCreateTaskForm(): void {
        this.isCreateTaskFormVisible = true;
        this.newTask = this.getInitialTaskState();
    }

    closeCreateTaskForm(): void {
        this.isCreateTaskFormVisible = false;
    }

    createTask(): void {
        if (this.newTask.title.trim()) {
            // Set initial progress based on status
            this.newTask.progress = this.getProgressForStatus(this.newTask.status);

            this.taskService.createTask(this.newTask).subscribe({
                next: (task) => {
                    // Ensure the returned task has proper enum value
                    const newTask = {
                        ...task,
                        status: TaskStatus[task.status as keyof typeof TaskStatus]
                    };
                    this.tasks = [...this.tasks, newTask];
                    this.closeCreateTaskForm();
                },
                error: (error) => console.error('Error creating task:', error)
            });
        }
    }

    startEditing(task: Task): void {
        this.editingTask = { ...task };
    }

    updateTask(task: Task): void {
        if (!task.id) return;
        
        this.taskService.updateTask(task.id, task).subscribe({
            next: (updatedTask) => {
                // Ensure the returned task has proper enum value
                const newTask = {
                    ...updatedTask,
                    status: TaskStatus[updatedTask.status as keyof typeof TaskStatus]
                };
                const index = this.tasks.findIndex(t => t.id === newTask.id);
                if (index !== -1) {
                    this.tasks = [
                        ...this.tasks.slice(0, index),
                        newTask,
                        ...this.tasks.slice(index + 1)
                    ];
                }
                this.editingTask = null;
            },
            error: (error) => console.error('Error updating task:', error)
        });
    }

    updateTaskStatus(task: Task, newStatus: TaskStatus): void {
        const updatedTask = { 
            ...task, 
            status: newStatus,
            progress: this.getProgressForStatus(newStatus)
        };
        
        this.taskService.updateTask(task.id!, updatedTask).subscribe({
            next: (updated) => {
                // Ensure the returned task has proper enum value
                const newTask = {
                    ...updated,
                    status: TaskStatus[updated.status as keyof typeof TaskStatus]
                };
                const index = this.tasks.findIndex(t => t.id === newTask.id);
                if (index !== -1) {
                    this.tasks = [
                        ...this.tasks.slice(0, index),
                        newTask,
                        ...this.tasks.slice(index + 1)
                    ];
                }
            },
            error: (error) => console.error('Error updating task:', error)
        });
    }

    private getProgressForStatus(status: TaskStatus): number {
        switch (status) {
            case TaskStatus.TODO:
                return 0;
            case TaskStatus.IN_PROGRESS:
                return 25;
            case TaskStatus.IN_REVIEW:
                return 75;
            case TaskStatus.DONE:
                return 100;
            default:
                return 0;
        }
    }

    deleteTask(taskId: number): void {
        this.taskService.deleteTask(taskId).subscribe({
            next: () => {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
            },
            error: (error) => console.error('Error deleting task:', error)
        });
    }

    toggleComplete(task: Task): void {
        if (!task.id) return;
        
        const updatedTask = { 
            ...task, 
            completed: !task.completed,
            status: task.completed ? task.status : TaskStatus.DONE,
            progress: task.completed ? task.progress : 100
        };
        
        this.taskService.updateTask(task.id, updatedTask).subscribe({
            next: (result) => {
                // Ensure the returned task has proper enum value
                const newTask = {
                    ...result,
                    status: TaskStatus[result.status as keyof typeof TaskStatus]
                };
                const index = this.tasks.findIndex(t => t.id === newTask.id);
                if (index !== -1) {
                    this.tasks = [
                        ...this.tasks.slice(0, index),
                        newTask,
                        ...this.tasks.slice(index + 1)
                    ];
                }
            },
            error: (error) => console.error('Error toggling task completion:', error)
        });
    }
}