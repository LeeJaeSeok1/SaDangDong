import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ethereum } from "./entities/ethereum.entity";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import * as dotenv from "dotenv";
import { lastValueFrom } from "rxjs/internal/lastValueFrom";
import { map } from "rxjs/internal/operators/map";

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
            if (address == `"NOT DEFINED"`) {
                return Object.assign({
                    statusCode: 400,
                    success: true,
                    statusMsg: `메타마스크에 연결하십시오.`,
                });
            }

            const loweraddress = address.toLowerCase();

            const [check_getethereum] = await this.ethereumRepository.query(`
            SELECT *
            FROM ethereum
            WHERE address = "${loweraddress}"
            `);

            if (check_getethereum) {
                const new_date = new Date();
                const ended_at = new Date(check_getethereum.get_at);
                ended_at.setDate(ended_at.getDate() + 1);
                if (new_date < ended_at) {
                    const remained_time = ended_at.getTime() - new_date.getTime();
                    const fixed_time = new Date(remained_time).toISOString().split("T")[1].split(".")[0];
                    return Object.assign({
                        statusCode: 401,
                        success: true,
                        statusMsg: `이더리움이 지급시간까지 ${fixed_time} 남았습니다.`,
                    });
                }
            }

            const url = process.env.BLOCKCHAIN_SERVER;
            const from_address = process.env.BLOCKCHAIN_ADDRESS;
            const data = {
                jsonrpc: "2.0",
                method: "eth_sendTransaction",
                params: [
                    {
                        from: `${from_address}`,
                        to: `${address}`,
                        value: "0x1221ab0d441498000",
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
            const result = await lastValueFrom(
                this.httpService.post(url, data, option).pipe(
                    map((response) => {
                        console.log(response);
                        return response.data;
                    }),
                ),
            );
            console.log(result);
            console.log(result.error);
            if (result.error) {
                return Object.assign({
                    statusCode: 400,
                    success: true,
                    statusMsg: `주소 또는 요청이 잘못되었습니다.`,
                });
            }

            if (!check_getethereum) {
                const getethereumtime = new Ethereum();

                getethereumtime.address = loweraddress;
                getethereumtime.get_at = new Date();

                await this.ethereumRepository.save(getethereumtime);
            } else {
                check_getethereum.get_at = new Date();
                await this.ethereumRepository.update(check_getethereum.id, check_getethereum);
            }

            return Object.assign({
                statusCode: 200,
                success: true,
                statusMsg: `몇 초 뒤에 이더리움이 지급됩니다.`,
            });
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async hellofunction() {
        const url = process.env.BLOCKCHAIN_SERVER;
        const data = {
            jsonrpc: "2.0",
            method: "eth_sendTransaction",
            params: [
                {
                    jsonrpc: "2.0",
                    method: "miner_stop",
                    params: [],
                },
            ],
            id: 1,
        };
        const option = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await this.httpService.get(url, data);
        console.log(response);
        return response;
    }
}
