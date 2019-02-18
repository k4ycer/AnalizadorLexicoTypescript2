import { Token } from './Token';
import { TypescriptFSM } from './TypescriptFSM';
import { TokenTypes } from '../Constants/TokenTypes';
import { TextToToken } from '../Constants/TextToToken';
import { TypescriptFSMStates } from '../Constants/TypescriptFSMStates';

export class Lexer{    
    public input: string;
    public position: number;
    public line: number;
    public column: number;
    public typescriptFSM: TypescriptFSM;
    
    private ignoredTokens: TokenTypes[];

    constructor(input: string){
        this.input = input;
        this.position = 0;
        this.line = 0;
        this.column = 0;
        this.typescriptFSM = new TypescriptFSM();
        this.ignoredTokens = [TokenTypes.WhitespaceTrivia, TokenTypes.NewLineTrivia];
    }

    public tokenize(): Token[]{
        this.position = 0;
        this.line = 0;
        this.column = 0;
        
        let tokens: Token[] = [];
        let token: Token = this.getNextToken();        

        while(token.Type != TokenTypes.EndOfFileToken){
            if(this.ignoredTokens.indexOf(token.Type) == -1){
                tokens.push(token);                
            }

            token = this.getNextToken();   
        }

        return tokens;
    }

    public getNextToken(): Token{        
        if(this.position >= this.input.length){
            return new Token(TokenTypes.EndOfFileToken);
        }

        let input: string = this.input.substr(this.position);
        let { Accepted, AnalyzedString, AcceptingState } = this.typescriptFSM.Run(input);
        let token: Token;

        if(!Accepted){
            token = new Token(TokenTypes.Unknown, "Unknown", this.input.charAt(this.position), this.line, this.column);            

            return token;
        }else{
            if(AcceptingState == TypescriptFSMStates.EndOfLine){                
                token = new Token(TokenTypes.NewLineTrivia, TokenTypes[TokenTypes.NewLineTrivia], AnalyzedString, this.line, this.column);
                this.line++;
                this.column = 0;
                this.position += AnalyzedString.length;

                return token;
            }

            if(AcceptingState == TypescriptFSMStates.WhiteSpace){
                token = new Token(TokenTypes.WhitespaceTrivia, TokenTypes[TokenTypes.WhitespaceTrivia], AnalyzedString, this.line, this.column);
                this.position += AnalyzedString.length;
                this.column += AnalyzedString.length;

                return token;
            }
                
            // Check if is identifier
            let tokenType = TextToToken[AnalyzedString]; 
            if(!tokenType){
                token = new Token(TokenTypes.Identifier, TokenTypes[TokenTypes.Identifier], AnalyzedString, this.line, this.column);                
            }else{
                token = new Token(tokenType, TokenTypes[tokenType], AnalyzedString, this.line, this.column);
            }   
            
            this.position += AnalyzedString.length;
            this.column += AnalyzedString.length;

            return token;
        }
    }
}