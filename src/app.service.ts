import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "사당동에 오신걸 환영 합니다!";
    }
}
