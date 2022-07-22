import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Collection } from "src/collections/entities/collection.entity";
import { Item } from "src/items/entities/item.entity";
import { User } from "./entities/user.entity";
import { ImageUpload } from "src/images/entities/image.entity";

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
        try {
            // console.log("서비스 어드레스", address);
            const existUser = await this.userRepository.findOne({ where: { address } });
            // console.log("existUser", existUser);
            if (!existUser) {
                const user = new User();
                user.address = address;
                await this.userRepository.save(user);
                return Object.assign({
                    statusCode: 201,
                    success: true,
                    statusMsg: "유저가 등록 되었습니다.",
                });
            }
            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "유저를 불러왔습니다..",
                data: existUser,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    findByUser(address: string) {
        return this.userRepository.findOne({ where: { address } });
    }

    // 유저 수정 페이지
    async settingUser(userData, address: string, files: Express.Multer.File[]) {
        try {
            const existUser = await this.findByUser(address);
            if (existUser === null) throw new NotFoundException(`본인만 수정 가능합니다.`);
            if (existUser.address !== address) {
                throw new NotFoundException(`본인만 수정 가능합니다.`);
            }

            // 이미지 저장
            const uploadeImages = [];
            let profileImage;
            let bennerImage;
            let element;
            if (files) {
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
            }

            existUser.name = userData.name;
            existUser.banner_image = bennerImage;
            existUser.profile_image = profileImage;
            await this.userRepository.save(existUser);
            return Object.assign({
                statusCode: 201,
                success: true,
                statusMsg: "수정이 완료 됐습니다.",
                datea: existUser,
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // 회원 페이지
    async userInfo(id: string, tab: string) {
        try {
            if (tab === "collection") {
                const userCollections = await this.collectionRepository.find({ where: { address: id } });
                return Object.assign({
                    statusCode: 200,
                    success: true,
                    statusMsg: "유저의 컬렌션 목록을 불러왔습니다.",
                    data: userCollections,
                });
            }
            if (tab === "item") {
                const userItems = await this.itemRepository.find({ where: { address: id } });
                return Object.assign({
                    statusCode: 200,
                    success: true,
                    statusMsg: "유저의 아이템 목록을 불러왔습니다.",
                    data: userItems,
                });
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    // 모든 유저 조회
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}
