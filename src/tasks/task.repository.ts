import { InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { Task } from "./task.entity";
import { TaskStatus } from "./task.enum";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status: status, search: search } = filterDto;
        const query = this.createQueryBuilder('task');
    
        // query.where('task.userId = :userId', { userId: user.id});
    
        if (status) {
          query.andWhere('task.status = :status', { status: status });
        }
    
        if (search) {
          query.andWhere(
            // Sử dụng ( ) trong câu sql duoi để dùng đồng thời 2 andWhere
            '(task.title LIKE :search OR task.description LIKE :search)',
            { search: `%${search}%` },
          );
        }
        // console.log('query', query.getQuery());
        try {
          return await query.getMany();
        } catch (e) {
          throw new InternalServerErrorException();
        }
      }

    async createTask(createTaskDto: CreateTaskDTO) {
        const task = new Task();
        task.title = createTaskDto.title;
        task.description = createTaskDto.description;
        task.status = TaskStatus.IN_PROGRESS;

        await task.save();
        return task;
    }

}
