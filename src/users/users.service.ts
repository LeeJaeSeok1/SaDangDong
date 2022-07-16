import { Injectable, NotFoundException } from "@nestjs/common";
import { RelationId, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
    ) {}

    // sign 페이지
    async sign(addressId: CreateUserDto) {
        const { address } = addressId;
        const existUser = await this.userRepository.findOne({ where: { address } });
        if (!existUser) {
            const user = new User();
            user.address = address;
            return await this.userRepository.save(user);
        }
        return existUser;
    }

    findByUser(address: string) {
        return this.userRepository.findOne({ where: { address } });
    }

    async settingUser(editUser: UpdateUserDto, address: string) {
        try {
            const existUser = await this.findByUser(address);
            console.log("address", address);
            console.log("existUser", existUser);

            if (existUser === null) throw new NotFoundException(`본인만 수정 가능합니다.`);
            if (existUser.address !== address) {
                throw new NotFoundException(`본인만 수정 가능합니다.`);
            }
            existUser.name = editUser.name;
            existUser.banner_image = editUser.benner_image;
            existUser.profile_image = editUser.profile_image;
            return this.userRepository.save(existUser);
        } catch (error) {
            throw new NotFoundException(`본인만 수정 가능합니다.`);
        }
    }

    // 마이페이지;
    async userInfo(id: string, tab: string, address: string) {
        try {
            const mycollections = await this.collectionRepository
                .createQueryBuilder("collection")
                .innerJoin("collection.user", "user", "user.collection = :address", { address });
            // const userCollection = await this.userRepository
            //     .createQueryBuilder("user")
            //     .innerJoin("user.collection", "colleciton", "collection.userAddress = :address", { address })
            //     .getMany();
            console.log(mycollections);
            // console.log(userCollection);

            const myItems = await this.itemRepository.find({ select: ["owner"] });

            if (id !== address) {
                throw new NotFoundException("로그인 후 이용해주세요.");
            }
            let tabName = tab;
            if (tabName === "collection") {
                return mycollections;
            }
            if (tabName === "Item") {
                return myItems;
            }
        } catch (error) {
            throw new NotFoundException(error);
        }
    }
    // 모든 유저 조회
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}
