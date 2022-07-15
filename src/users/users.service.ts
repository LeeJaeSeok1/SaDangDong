import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Users } from "./entities/user.entity";
import { CreateUserDto } from "./dto/createUser.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { ImageUpload } from "src/images/entities/image.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(ImageUpload)
        private imageUploadRepository: Repository<ImageUpload>,
    ) {}

    // 테스트용 회원가입
    async signUp(createUserDto: CreateUserDto): Promise<void> {
        try {
            await this.userRepository.save(createUserDto);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    // 테스트용 로그인
    // async logIn(createCollectionDto: CreateUserDto): Promise<{ accessToken: string }> {
    //     const { nickname, password } = createCollectionDto;
    //     const user = await this.userRepository.findOne({ where: { nickname } });
    //     if (password === user.password) {
    //         // 유저 토큰 생성
    //         const payload = { nickname };
    //         const accessToken = await this.jwtService.sign(payload);
    //         return { accessToken: accessToken };
    //     }
    //     throw new UnauthorizedException("login failed");
    // }

    // sign 페이지
    async sign(createUserDto: CreateUserDto) {
        return this.userRepository.save(createUserDto);
    }

    // 마이페이지
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

    // 모든 유저 조회
    async findAll(): Promise<Users[]> {
        return this.userRepository.find();
    }
}
