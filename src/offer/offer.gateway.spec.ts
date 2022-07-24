import { Test, TestingModule } from "@nestjs/testing";
import { OfferGateway } from "./offer.gateway";

describe("EventsGateway", () => {
    let gateway: OfferGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [OfferGateway],
        }).compile();

        gateway = module.get<OfferGateway>(OfferGateway);
    });

    it("should be defined", () => {
        expect(gateway).toBeDefined();
    });
});
