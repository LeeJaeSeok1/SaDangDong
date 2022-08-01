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
import { AuthToken } from "src/config/auth.decorator";
import { JsonRpcService } from "./jsonrpc.service";

@Controller("api/json")
export class JsonRpcController {
    constructor(private readonly jsonrpcService: JsonRpcService) {}

    // ethereum 받기
    @Get("getETH")
    getethereum(@AuthToken() address: string) {
        return this.jsonrpcService.getethereumcoin(address);
    }

    @Get("/transaction/:hashdata")
    checktransaction(@Param() hashdata: string) {
        return this.jsonrpcService.transactioncomplete(hashdata);
    }
}
