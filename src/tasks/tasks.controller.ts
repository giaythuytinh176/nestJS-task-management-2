import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(
        private taskService: TasksService,
    ) {

    }

    @Get()
    getAllTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    ): Task[] {
        if (Object.keys(filterDto).length) {
            return this.taskService.getTasksWithFilters(filterDto);
        } 
        else {
            return this.taskService.getAllTasks();
        }
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
        @Param('id') id: string
    ): Task {
        return this.taskService.getTaskById(id);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id: string,
    ) {
        return this.taskService.deleteTaskById(id);
    }

    @Patch('/:id/status')
    updateStatusTaskById(
        @Param('id') id: string,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ) {
        return this.taskService.updateStatusTaskById(id, status);
    }
}
