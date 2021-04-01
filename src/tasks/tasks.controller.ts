import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task.enum';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';

@Controller('tasks')
export class TasksController {
    constructor(
        private taskService: TasksService,
    ) {

    }

    @Get()
    getTasks(
      @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    ): Promise<Task[]> {
      return this.taskService.getTasks(filterDto);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDTO
        ) {
        return this.taskService.createTask(createTaskDto);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<Task> {
        return this.taskService.getTaskById(id);
    }

    @Delete('/:id')
    async deleteTaskById(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<DeleteResult> {
      // return this.tasksService.deleteTaskById(id);
      return this.taskService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    async updateTaskStatusById(
      @Param('id', ParseIntPipe) id: number,
      @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Promise<Task> {
      return this.taskService.updateTaskStatusById(id, status);
    }
}
