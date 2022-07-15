import { Injectable, NotFoundException, Req } from "@nestjs/common";
import { Repository } from "typeorm";
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
        const mycollections = await this.collectionRepository.find({ select: ["address"] });
        const myItems = await this.itemRepository.find({ select: ["owner"] });
        console.log("mycolleciton", mycollections);
        console.log("myItem", myItems);
        let tabName = tab;
        if (tabName === "collection") {
            await this.collectionRepository.find({ select: ["address"] });
        }
        if (tabName === "Item") {
            await this.itemRepository.find({ select: ["owner"] });
        }

        return this.userRepository.findOne({ select: ["address"] });
    }

    // 모든 유저 조회
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}
