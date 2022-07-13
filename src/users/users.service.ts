import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Users } from "./entities/user.entity";
import { CreateUserDto } from "./dto/createUser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        private jwtService: JwtService,
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
    ) {}

    async signUp(createUserDto: CreateUserDto): Promise<void> {
        try {
            await this.userRepository.save(createUserDto);
        } catch (error) {
            // 서버에서 보내는 코드가 23505 면 'Existing nickname' 에러 발생
            if (error.code === "23505") {
                throw new ConflictException("Existing nickname");
            }
            throw new InternalServerErrorException();
        }
    }

    async logIn(createCollectionDto: CreateUserDto): Promise<{ accessToken: string }> {
        const { nickname, password } = createCollectionDto;
        const user = await this.userRepository.findOne({ where: { nickname } });
        if (password === user.password) {
            // 유저 토큰 생성
            const payload = { nickname };
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken: accessToken };
        }
        throw new UnauthorizedException("login failed");
    }

    async findByNickname(nickname: string) {
        return this.userRepository.findOne({ where: { nickname }, select: ["id", "nickname", "password"] });
    }

    async findById(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Users[]> {
        return this.userRepository.find();
    }

    async getUserCollection(id: number): Promise<Collection[]> {
        const user = await this.userRepository.findOne({ where: { id } });
        const collectionInfo = await this.collectionRepository.findOne({ where: { user } });

        return;
    }
}
