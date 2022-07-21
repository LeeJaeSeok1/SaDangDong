import { Test, TestingModule } from "@nestjs/testing";
import { LikeController } from "./favorites.controller";
import { LikeService } from "./favorites.service";

describe("FavoritesController", () => {
    let controller: LikeController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LikeController],
            providers: [LikeService],
        }).compile();

        controller = module.get<LikeController>(LikeController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
