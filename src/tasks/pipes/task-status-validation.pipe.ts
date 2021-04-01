import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task.enum";


export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowStatuses = [
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN,
        TaskStatus.DONE,
    ];
    
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is an invalid status`);
        }

        return value;
    }

    private isStatusValid(status: any) {
        const idx = this.allowStatuses.indexOf(status);
        return idx !== -1;
    }
}

