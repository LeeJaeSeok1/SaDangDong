import { Controller, Get, Param, Query } from "@nestjs/common";
import { HelloService } from "./hello.service";
import { ApiOperation, ApiTags, ApiQuery } from "@nestjs/swagger";

@ApiTags("Hello")
@Controller("api/hello")
export class HelloController {
    constructor(private readonly helloService: HelloService) {}

    @Get(":auction_id")
    findAllMessages(@Param(":auction_id") auction_id: number) {
        return this.helloService.findAllMessages(auction_id);
    }
}
