import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { Users } from "./entities/user.entity";

@Injectable()
export class jwtStragtegy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {
        super({
            secretOrKey: "test",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload) {
        const { nickname } = payload;
        const user: Users = await this.userRepository.findOne({ where: { nickname } });

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
