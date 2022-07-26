import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import "dotenv/config";

export const typeORMConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + "/../**/*.entity.{js,ts}"],
    synchronize: false,
    timezone: "Asia/Seoul",
};
