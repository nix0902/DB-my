import { param } from './methods/param';
import { security } from './methods/security';
declare const methods: {
    param: typeof param;
    security: typeof security;
};
export declare class PineRequest {
    private context;
    private _cache;
    param: ReturnType<typeof methods.param>;
    security: ReturnType<typeof methods.security>;
    constructor(context: any);
}
export default PineRequest;
