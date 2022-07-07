import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';
// import { RedisIoAdapter } from './chat/redis.adapter';


async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    // app.useWebSocketAdapter(new RedisIoAdapter(app));
    // app.useStaticAssets(join(__dirname, '..', 'static'));
    const config = new DocumentBuilder()
        .setTitle("SaDangDong API")
        .setDescription("사당동(NFT Auction 프로젝트)를 위한 API 문서입니다.")
        .setVersion("1.0")
        .addCookieAuth("connect.sid")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
    // 테스트
    // await app.listen(3000);
    await app.listen(process.env.NODE_PORT);
}
bootstrap();
