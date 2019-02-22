import { Token } from './Token';

export class LexerError{
    public message: string;
    public line: number;
    public column: number;
    public currentTokens: Token[];

    constructor(message: string, line: number, column: number, currentTokens: Token[]){
        this.message = message;
        this.line = line;
        this.column = column;
        this.currentTokens = currentTokens;
    }
}