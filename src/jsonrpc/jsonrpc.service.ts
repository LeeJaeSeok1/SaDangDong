import { BadRequestException, Injectable } from "@nestjs/common";
import { ApiExtraModels } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class JsonRpcService {}
