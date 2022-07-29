import { Controller, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { TaskService } from "./task.service";

@Controller("task")
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Cron("*/10 * * * * *", { name: "cronTask" })
    handleCron() {
        return this.taskService.updateAuction();
    }
}
