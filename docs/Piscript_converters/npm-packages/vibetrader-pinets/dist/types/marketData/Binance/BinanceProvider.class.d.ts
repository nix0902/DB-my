import { IProvider } from '@pinets/marketData/IProvider';
export declare class BinanceProvider implements IProvider {
    private cacheManager;
    constructor();
    getMarketDataInterval(tickerId: string, timeframe: string, sDate: number, eDate: number): Promise<any>;
    getMarketData(tickerId: string, timeframe: string, limit?: number, sDate?: number, eDate?: number): Promise<any>;
    /**
     * Determines if pagination is needed based on the parameters
     */
    private shouldPaginate;
}
