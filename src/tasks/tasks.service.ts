import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(
        private taskRepository: TaskRepository,

    ) {
        
    }

    private tasks: Task[] = [
        {
            id: uuid(),
            title: "12",
            description: "1212",
            status: TaskStatus.OPEN,
        },
    ];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status: status, search: search } = filterDto;
        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status )
        }

        if (search) {
            tasks = tasks.filter(task => {
                return task.title.includes(search) || task.description.includes(search);
            })
        }

        return tasks;
    }

    createTask(createTaskDto: CreateTaskDTO): Task {
        const task: Task = {
            id: uuid(),
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);
        return task;
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({
            where: {
                id: id,
                userId: user.id,
            },
        });

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}"`);
        }

        return found;
    }

    deleteTaskById(id: string): void {
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    async updateStatusTaskById(id: string, status: TaskStatus) {
        const task = await this.getTaskById(id);
        task.status = status;
        return task;
    }
}
