import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ethereum } from "./entities/ethereum.entity";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import * as dotenv from "dotenv";

@Injectable()
export class JsonRpcService {
    constructor(
        @InjectRepository(Ethereum)
        private ethereumRepository: Repository<Ethereum>,
        private httpService: HttpService,
    ) {}

    // process.env.AWS_SECRET_ACCESS_KEY

    async getethereumcoin(address: string) {
        try {
            const url = process.env.BLOCKCHAIN_SERVER;
            const data = {
                jsonrpc: "2.0",
                method: "eth_sendTransaction",
                params: [
                    {
                        from: "eth_accounts[0]",
                        to: `${address}`,
                        value: "0x821ab0d441498000",
                        // data: 컴파일 주소,
                    },
                ],
                id: 1,
            };
            const option = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const hello = await this.httpService.post(url, data, option);
            console.log(hello);
            console.log(address);
            console.log(process.env.BLOCKCHAIN_SERVER);
            return hello;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async hellofunction() {
        const response = await this.httpService.get(`https://m2.melon.com/cds/main/mobile4web/main_chart.htm`);
        console.log(response);
        return response;
    }
}
