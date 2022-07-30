import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UsePipes,
    UseInterceptors,
    ValidationPipe,
    UploadedFiles,
    Put,
} from "@nestjs/common";
import { JsonRpcService } from "./jsonrpc.service";

@Controller("api/json")
export class JsonRpcController {
    constructor(private readonly jsonrpcService: JsonRpcService) {}
}
