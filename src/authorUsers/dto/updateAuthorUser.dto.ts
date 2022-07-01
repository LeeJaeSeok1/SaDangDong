import { PartialType } from '@nestjs/swagger';
import { CreateAuthorUserDto } from './createAuthorUser.dto';

export class UpdateAuthorUserDto extends PartialType(CreateAuthorUserDto) {}
