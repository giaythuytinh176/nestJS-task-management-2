import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.enum';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        private taskRepository: TaskRepository,

    ) {
        
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
      return this.taskRepository.getTasks(filterDto);
    }

    createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}"`);
        }

        return found;
    }

    async deleteTaskById(id: number): Promise<DeleteResult> {
        const result = await this.taskRepository.delete({
          id: id,
        });
    
        if (result.affected === 0) {
          throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    
        return result;
      }

      async updateTaskStatusById(
        id: number,
        status: TaskStatus,
      ): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
      }
}
