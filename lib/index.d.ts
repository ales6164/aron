export interface Options {
    imports?: Array<Page>;
}

export default class Aron {
    private options;

    private constructor();

    static render(options: Options): void;
}
export declare const html: (strings: TemplateStringsArray) => string;

export declare abstract class Page {
    render(): String;
}
