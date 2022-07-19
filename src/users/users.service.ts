import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { ImageUpload } from "src/images/entities/image.entity";
import { ForeignKeyMetadata } from "typeorm/metadata/ForeignKeyMetadata";

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
    async sign(address: string) {
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

    // 유저 수정 페이지
    async settingUser(userData, address: string, files: Express.Multer.File[]) {
        try {
            const existUser = await this.findByUser(address);
            console.log("existUser", existUser);
            console.log("유저데이터", userData.name);
            console.log("유저데이터", userData.address);
            if (existUser === null) throw new NotFoundException(`본인만 수정 가능합니다.`);
            if (existUser.address !== address) {
                throw new NotFoundException(`본인만 수정 가능합니다.`);
            }

            const uploadeImages = [];
            let profileImage;
            let bennerImage;
            let element;
            for (element of files) {
                const file = new ImageUpload();
                file.originalName = element.originalname;
                file.mimeType = element.mimetype;
                file.url = element.location;
                uploadeImages.push(file);

                if (file.originalName === "profileImg") {
                    profileImage = file.url;
                }

                if (file.originalName === "bennerImg") {
                    bennerImage = file.url;
                }
            }

            existUser.name = userData.name;
            existUser.banner_image = bennerImage;
            existUser.profile_image = profileImage;
            return await this.userRepository.save(existUser);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 마이페이지;
    async userInfo(id: string, address: string, tab: string) {
        try {
            // const mycollections = await this.collectionRepository
            //     .createQueryBuilder("collection")
            //     .innerJoin("collection.user", "user", "user.collection = :address", { address })
            //     .getMany();

            // const mycollections = await this.userRepository
            const mycollections = await this.userRepository
                .createQueryBuilder("user")
                .innerJoin("user.collection", "collection", "collection.user = :address", { address })
                .getMany();
            console.log(mycollections);
            // console.log(userCollection);

            // const myItems = await this.itemRepository.find({ select: ["owner"] });

            // if (id !== address) {
            //     throw new NotFoundException("로그인 후 이용해주세요.");
            // }
            // let tabName = tab;
            // if (tabName === "collection") {
            //     return mycollections;
            // }
            // if (tabName === "Item") {
            //     return myItems;
            // }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    // 모든 유저 조회
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}
