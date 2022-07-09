import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/createUser.dto";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async signUp(createUserDto: CreateUserDto): Promise<void> {
        await this.userRepository.save(createUserDto);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // async create(user: User): Promise<void> {
    //     await this.userRepository.save(user);
    // }

    // async remove(nickname: string): Promise<void> {
    //     await this.userRepository.delete(nickname);
    // }

    // async update(nickname: string, user: User): Promise<void> {
    //     const existCat = await this.userRepository.findOneBy({ nickname });
    //     if (existCat) {
    //         await getConnection()
    //             .createQueryBuilder()
    //             .update(User)
    //             .set({
    //                 profileImage: user.profileImage,
    //                 bannerImage: user.bannerImage,
    //                 description: user.description,
    //             })
    //             .where("nickname = :nickname", { nickname })
    //             .execute();
    //     }
    // }
}
