export declare class Core {
    private context;
    color: {
        param: (source: any, index?: number) => any;
        rgb: (r: number, g: number, b: number, a?: number) => string;
        new: (color: string, a?: number) => string;
        white: string;
        lime: string;
        green: string;
        red: string;
        maroon: string;
        black: string;
        gray: string;
        blue: string;
    };
    constructor(context: any);
    private extractPlotOptions;
    indicator(title: string, shorttitle?: string, options?: IndicatorOptions): void;
    plotchar(series: number[], title: string, options: PlotCharOptions): void;
    plot(series: any, title: string, options: PlotOptions): void;
    get bar_index(): any;
    na(series: any): boolean;
    nz(series: any, replacement?: number): any;
}
