import { Injectable } from "@nestjs/common";
import { getConnection, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // findOne(walletId: string): Promise<User> {
    //   return this.userRepository.findOne(walletId);
    // }

    findOne(nickname: string): Promise<User> {
        return this.userRepository.findOneBy({ nickname });
    }

    async create(user: User): Promise<void> {
        await this.userRepository.save(user);
    }

    async remove(nickname: string): Promise<void> {
        await this.userRepository.delete(nickname);
    }

    async update(nickname: string, user: User): Promise<void> {
        const existCat = await this.userRepository.findOneBy({ nickname });
        if (existCat) {
            await getConnection()
                .createQueryBuilder()
                .update(User)
                .set({
                    profileImage: user.profileImage,
                    bannerImage: user.bannerImage,
                    description: user.description,
                })
                .where("nickname = :nickname", { nickname })
                .execute();
        }
    }
}
