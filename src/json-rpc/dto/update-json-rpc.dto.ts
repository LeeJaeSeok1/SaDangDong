import { PartialType } from '@nestjs/swagger';
import { CreateJsonRpcDto } from './create-json-rpc.dto';

export class UpdateJsonRpcDto extends PartialType(CreateJsonRpcDto) {}
