import { createParamDecorator, ExecutionContext } from "@nestjs/common";
export const AuthToken = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { headers } = request;
    return headers["authorization"] ? headers["authorization"] : '"NOT DEFINED"';
});
