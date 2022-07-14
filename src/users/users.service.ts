import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Users } from "./entities/user.entity";
import { CreateUserDto } from "./dto/createUser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        private jwtService: JwtService,
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) {}

    // 테스트용 회원가입
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

    // 테스트용 로그인
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

    // 테스트용 유저 찾기
    async findByNickname(nickname: string) {
        return this.userRepository.findOne({ where: { nickname }, select: ["id", "nickname", "password"] });
    }

    async userInfo(id: number, tab: string, user: Users) {
        const mycollections = await this.collectionRepository.find({ select: ["userId"] });
        const myItems = await this.itemRepository.find({ select: ["owner"] });
        console.log("mycolleciton", mycollections);
        console.log("myItem", myItems);
        let tabName = tab;
        if (tabName === "collection") {
            await this.collectionRepository.find({ select: ["userId"] });
        }
        if (tabName === "Item") {
            await this.itemRepository.find({ select: ["owner"] });
        }

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
