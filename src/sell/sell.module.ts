import { Module } from "@nestjs/common";
import { SellService } from "./sell.service";
import { SellController } from "./sell.controller";

@Module({
    controllers: [SellController],
    providers: [SellService],
})
export class SellModule {}
