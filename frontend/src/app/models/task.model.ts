export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    DONE = 'DONE'
}

export interface Task {
    id?: number;
    title: string;
    description: string;
    completed: boolean;
    type: string;
    status: TaskStatus;
    assignees: string[];
    progress: number;
    comments?: number;
    subtasks?: number;
    createdAt?: Date;
    updatedAt?: Date;
} 