import { TaskStatus } from "../task.enum";
import { IsIn, IsOptional, IsNotEmpty } from 'class-validator';

export class GetTasksFilterDto {

    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string
}