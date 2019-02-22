import { FSM } from './../Interfaces/FSM';
import { LexerError } from './LexerError';
import { CharacterCodes } from './../Constants/CharacterCodes';
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
    public typescriptFSM: FSM;
    
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

            try{
                token = this.getNextToken();   
            }catch(e){
                throw new LexerError(e.message, this.line, this.column, tokens);
            }
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
            // Unknown
            if(AnalyzedString.length == 0){
                // Comentar lo siguiente para asignarlo como Unknown
                throw new Error("Error: Invalid character " + this.input.charAt(this.position) + " on line " + this.line + ", column " + this.column);
                
                token = new Token(TokenTypes.Unknown, "Unknown", this.input.charAt(this.position), this.line, this.column);
                this.position += AnalyzedString.length;
                this.column += AnalyzedString.length;
                return token;
            }

            // String literal
            if(AcceptingState == TypescriptFSMStates.StringLiteralSingleQuotePart || AcceptingState == TypescriptFSMStates.StringLiteralDoubleQuotePart){                
                throw new Error("Error: Unterminated string literal on line "+this.line+", column "+this.column);
            }     
            
            // Multi line comment
            if(AcceptingState == TypescriptFSMStates.MultiLineCommentPart || AcceptingState == TypescriptFSMStates.MultiLineCommentEndStart){
                throw new Error("Error: Unterminated multi line comment on line "+this.line+", column "+this.column);
            }
            //Numeric literal
            if(AcceptingState == TypescriptFSMStates.EnteroDecimalStart || AcceptingState == TypescriptFSMStates.ExpontenteStart 
                 || AcceptingState == TypescriptFSMStates.ExponenteNegativoStart  || AcceptingState == TypescriptFSMStates.NumHexStart 
                 || AcceptingState == TypescriptFSMStates.NumHexX || AcceptingState == TypescriptFSMStates.NumBinB || AcceptingState == TypescriptFSMStates.NumBinStart
                 || AcceptingState == TypescriptFSMStates.NumOctalStart || AcceptingState == TypescriptFSMStates.NumOctalO){
                throw new Error("Error: Unterminated numeric literal on line "+this.line+", column "+this.column);
            }            
        }else{ 
            //Numeric literal
            if(AcceptingState == TypescriptFSMStates.Entero || AcceptingState == TypescriptFSMStates.EnteroDecimal || 
              AcceptingState == TypescriptFSMStates.ExponentePositivo || AcceptingState == TypescriptFSMStates.ExponenteNegativo||
              AcceptingState == TypescriptFSMStates.DecimalDirecto || AcceptingState == TypescriptFSMStates.NumHex ||
              AcceptingState == TypescriptFSMStates.NumBin || AcceptingState == TypescriptFSMStates.NumOctal ){
                token = new Token(TokenTypes.NumericLiteral, TokenTypes[TokenTypes.NumericLiteral], AnalyzedString, this.line, this.column);
                this.column += AnalyzedString.length;
                this.position += AnalyzedString.length;
                

                return token;
            }


            // Single line comment
            if(AcceptingState == TypescriptFSMStates.SingleLineComment){
                token = new Token(TokenTypes.SingleLineCommentTrivia, TokenTypes[TokenTypes.SingleLineCommentTrivia], AnalyzedString, this.line, this.column);
                this.position += AnalyzedString.length;
                this.column += AnalyzedString.length;

                return token;
            }

            // Multi line comment
            if(AcceptingState == TypescriptFSMStates.MultiLineCommentEnd){
                token = new Token(TokenTypes.MultiLineCommentTrivia, TokenTypes[TokenTypes.MultiLineCommentTrivia], AnalyzedString, this.line, this.column);
                this.position += AnalyzedString.length;
                this.column += AnalyzedString.length;
                this.line += this.getLineBreaksFromMultilineComment(AnalyzedString);

                return token;
            }
            
            // End of line
            if(AcceptingState == TypescriptFSMStates.EndOfLine){                
                token = new Token(TokenTypes.NewLineTrivia, TokenTypes[TokenTypes.NewLineTrivia], AnalyzedString, this.line, this.column);
                this.line++;
                this.column = 0;
                this.position += AnalyzedString.length;

                return token;
            }

            // Whitespace
            if(AcceptingState == TypescriptFSMStates.WhiteSpace){
                token = new Token(TokenTypes.WhitespaceTrivia, TokenTypes[TokenTypes.WhitespaceTrivia], AnalyzedString, this.line, this.column);
                this.position += AnalyzedString.length;
                this.column += AnalyzedString.length;

                return token;
            }

            // String literal
            if(AcceptingState == TypescriptFSMStates.StringLiteralDoubleQuoteEnd || AcceptingState == TypescriptFSMStates.StringLiteralSingleQuoteEnd){
                token = new Token(TokenTypes.StringLiteral, TokenTypes[TokenTypes.StringLiteral], AnalyzedString, this.line, this.column);
                this.position += AnalyzedString.length;
                this.column += AnalyzedString.length;

                return token;
            }


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

    private getLineBreaksFromMultilineComment(comment: string): number {
        let position: number = 0;
        let lineBreaks = 0;

        while(position < comment.length){
            if(comment.charCodeAt(position) == CharacterCodes.carriageReturn || comment.charCodeAt(position) == CharacterCodes.lineFeed){
                lineBreaks++;
            }
            position++;
        }

        return lineBreaks;
    }
}