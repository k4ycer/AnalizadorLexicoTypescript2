import { TokenTypes } from '../Constants/TokenTypes';

export class Token{
    public Type: TokenTypes;
    public TypeString: string;
    public Value: string;
    public Line: number;
    public Column: number;

    constructor(type?: TokenTypes, typeString?: string, value?: string, line?: number, column?: number){        
        this.Type = type;
        this.TypeString = typeString;
        this.Value = value;
        this.Line = line;
        this.Column = column;
    }
}