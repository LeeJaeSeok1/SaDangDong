import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "config";

const dbConfig = config.get("db");

console.log("port", process.env.BD_PORT);
console.log("dbPort", dbConfig.port);
console.log("dbType", dbConfig.type);

export const typeORMConfig: TypeOrmModuleOptions = {
    type: "mysql", // process.env.BD_TYPE || dbConfig.type,
    host: "localhost", // process.env.DB_HOST || dbConfig.host,
    port: 3306, // process.env.DB_PORT || dbConfig.port,
    username: "root", // process.env.DB_USERNAEM || dbConfig.username,
    password: "loej2011$$", // process.env.RDS_PASSWORD || dbConfig.password,
    database: "sadangdong", // process.env.DB_DATABASW || dbConfig.database,
    entities: [__dirname + "/../**/*.entity.{js,ts}"],
    synchronize: true,
};
