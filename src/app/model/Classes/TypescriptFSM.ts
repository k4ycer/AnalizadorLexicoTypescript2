import { CharacterCodes } from './../Constants/CharacterCodes';
import { FSM, FSMResult } from "../Interfaces/FSM";
import { TypescriptFSMStates } from '../Constants/TypescriptFSMStates';

export class TypescriptFSM implements FSM{    
    Alphabet: number[];
    States: number[];
    AcceptingStates: number[];
    NotAcceptingStates: number[];
    InitialState: number;
    TransitionTable: number[][];    

    constructor(){
        this.Alphabet = this.enumToArray(CharacterCodes);
        this.States = this.enumToArray(TypescriptFSMStates);
        this.AcceptingStates = [];
        this.NotAcceptingStates = [TypescriptFSMStates.Initial, TypescriptFSMStates.StringLiteralSingleQuotePart, TypescriptFSMStates.StringLiteralDoubleQuotePart, TypescriptFSMStates.MultiLineCommentPart, TypescriptFSMStates.MultiLineCommentEndStart];
        this.InitialState = TypescriptFSMStates.Initial;
        this.TransitionTable = [];

        this.InitializeTransitionTable();
        this.BuildTransitionTable();
    }

    public AddTransition(sourceState: number, destinationState: number, input: number) {
        let column = this.inputToColumn(input);
        this.TransitionTable[sourceState][column] = destinationState;
    }

    private BuildTransitionTable(){
        // Line feed, carriage return
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.EndOfLine, CharacterCodes.carriageReturn);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.EndOfLine, CharacterCodes.lineFeed);
        this.AddTransition(TypescriptFSMStates.EndOfLine, TypescriptFSMStates.EndOfLine, CharacterCodes.lineFeed);

        // Whitespace
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.tab);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.verticalTab);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.formFeed);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.space);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.nonBreakingSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.ogham);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.enQuad);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.emQuad);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.enSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.emSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.threePerEmSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.fourPerEmSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.sixPerEmSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.figureSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.punctuationSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.thinSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.hairSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.zeroWidthSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.narrowNoBreakSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.mathematicalSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.ideographicSpace);
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.WhiteSpace, CharacterCodes.byteOrderMark);

        // Exclamation
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Exclamation, CharacterCodes.exclamation);
        this.AddTransition(TypescriptFSMStates.Exclamation, TypescriptFSMStates.ExclamationEquals, CharacterCodes.equals);
        this.AddTransition(TypescriptFSMStates.ExclamationEquals, TypescriptFSMStates.ExclamationEqualsEquals, CharacterCodes.equals);

        // String Literal Single Quote
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.StringLiteralSingleQuotePart, CharacterCodes.singleQuote);
        this.addTransitionAllInputs(TypescriptFSMStates.StringLiteralSingleQuotePart, TypescriptFSMStates.StringLiteralSingleQuotePart);
        this.AddTransition(TypescriptFSMStates.StringLiteralSingleQuotePart, TypescriptFSMStates.StringLiteralSingleQuoteEnd, CharacterCodes.singleQuote);
        this.AddTransition(TypescriptFSMStates.StringLiteralSingleQuotePart, -1, CharacterCodes.lineFeed);
        this.AddTransition(TypescriptFSMStates.StringLiteralSingleQuotePart, -1, CharacterCodes.carriageReturn);

        // String Literal Double Quote
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.StringLiteralDoubleQuotePart, CharacterCodes.doubleQuote);
        this.addTransitionAllInputs(TypescriptFSMStates.StringLiteralDoubleQuotePart, TypescriptFSMStates.StringLiteralDoubleQuotePart);
        this.AddTransition(TypescriptFSMStates.StringLiteralDoubleQuotePart, TypescriptFSMStates.StringLiteralDoubleQuoteEnd, CharacterCodes.doubleQuote);
        this.AddTransition(TypescriptFSMStates.StringLiteralDoubleQuotePart, -1, CharacterCodes.lineFeed);
        this.AddTransition(TypescriptFSMStates.StringLiteralDoubleQuotePart, -1, CharacterCodes.carriageReturn);
        

        // TODO: Backtick

        // Percent 
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Percent, CharacterCodes.percent);
        this.AddTransition(TypescriptFSMStates.Percent, TypescriptFSMStates.PercentEquals, CharacterCodes.equals);

        // Ampersand
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Ampersand, CharacterCodes.ampersand);
        this.AddTransition(TypescriptFSMStates.Ampersand, TypescriptFSMStates.AmpersandAmpersand, CharacterCodes.ampersand);
        this.AddTransition(TypescriptFSMStates.Ampersand, TypescriptFSMStates.AmpersandEquals, CharacterCodes.equals);

        // Open Paren
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.OpenParen, CharacterCodes.openParen);

        // Close Paren
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.CloseParen, CharacterCodes.closeParen);

        // Asterisk
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Asterisk, CharacterCodes.asterisk);
        this.AddTransition(TypescriptFSMStates.Asterisk, TypescriptFSMStates.AsteriskEquals, CharacterCodes.equals);
        this.AddTransition(TypescriptFSMStates.Asterisk, TypescriptFSMStates.AsteriskAsterisk, CharacterCodes.asterisk);
        this.AddTransition(TypescriptFSMStates.AsteriskAsterisk, TypescriptFSMStates.AsteriskAsteriskEquals, CharacterCodes.equals);
        
        // Plus
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Plus, CharacterCodes.plus);
        this.AddTransition(TypescriptFSMStates.Plus, TypescriptFSMStates.PlusPlus, CharacterCodes.plus);
        this.AddTransition(TypescriptFSMStates.Plus, TypescriptFSMStates.PlusEqual, CharacterCodes.equals);

        // Comma
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Comma, CharacterCodes.comma);

        // Minus
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Minus, CharacterCodes.minus);
        this.AddTransition(TypescriptFSMStates.Minus, TypescriptFSMStates.MinusMinus, CharacterCodes.minus);
        this.AddTransition(TypescriptFSMStates.Minus, TypescriptFSMStates.MinusEquals, CharacterCodes.equals);

        // Dot
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Dot, CharacterCodes.dot);        
        this.AddTransition(TypescriptFSMStates.Dot, TypescriptFSMStates.DotDot, CharacterCodes.dot);
        this.AddTransition(TypescriptFSMStates.DotDot, TypescriptFSMStates.DotDotDot, CharacterCodes.dot);
        // TODO: Dot -> Numeric Literal

        // Slash
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Slash, CharacterCodes.slash);
        this.AddTransition(TypescriptFSMStates.Slash, TypescriptFSMStates.SlashEquals, CharacterCodes.equals);        
        this.AddTransition(TypescriptFSMStates.Slash, TypescriptFSMStates.SingleLineComment, CharacterCodes.slash);
        this.AddTransition(TypescriptFSMStates.Slash, TypescriptFSMStates.MultiLineCommentPart, CharacterCodes.asterisk);
        // Single line comment
        this.addTransitionAllInputs(TypescriptFSMStates.SingleLineComment, TypescriptFSMStates.SingleLineComment);
        this.addTransitionMultipleInputs(TypescriptFSMStates.SingleLineComment, -1, [CharacterCodes.lineFeed, CharacterCodes.carriageReturn]);        

        // TODO: Multi line comment
        this.addTransitionAllInputs(TypescriptFSMStates.MultiLineCommentPart, TypescriptFSMStates.MultiLineCommentPart);
        this.AddTransition(TypescriptFSMStates.MultiLineCommentPart, TypescriptFSMStates.MultiLineCommentEndStart, CharacterCodes.asterisk);
        this.addTransitionAllInputs(TypescriptFSMStates.MultiLineCommentEndStart, TypescriptFSMStates.MultiLineCommentPart);
        this.AddTransition(TypescriptFSMStates.MultiLineCommentEndStart, TypescriptFSMStates.MultiLineCommentEnd, CharacterCodes.slash);
        this.addTransitionAllInputs(TypescriptFSMStates.MultiLineCommentEnd, -1);

        // TODO: Numeric Literal

        // Colon
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Colon, CharacterCodes.colon);

        // Semicolon
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Semicolon, CharacterCodes.semicolon);

        // Less than
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.LessThan, CharacterCodes.lessThan);
        this.AddTransition(TypescriptFSMStates.LessThan, TypescriptFSMStates.LessThanLessThan, CharacterCodes.lessThan);
        this.AddTransition(TypescriptFSMStates.LessThan, TypescriptFSMStates.LessThanEquals, CharacterCodes.equals);
        this.AddTransition(TypescriptFSMStates.LessThan, TypescriptFSMStates.LessThanSlash, CharacterCodes.slash);
        this.AddTransition(TypescriptFSMStates.LessThanLessThan, TypescriptFSMStates.LessThanLessThanEquals, CharacterCodes.equals);        

        // Equals
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Equals, CharacterCodes.equals);
        this.AddTransition(TypescriptFSMStates.Equals, TypescriptFSMStates.EqualsEquals, CharacterCodes.equals);
        this.AddTransition(TypescriptFSMStates.EqualsEquals, TypescriptFSMStates.EqualsEqualsEquals, CharacterCodes.equals);
        this.AddTransition(TypescriptFSMStates.Equals, TypescriptFSMStates.EqualsGreaterThan, CharacterCodes.greaterThan);

        // Greater than
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.GreaterThan, CharacterCodes.greaterThan);

        // Question
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Question, CharacterCodes.question);

        // Open bracket
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.OpenBracket, CharacterCodes.openBracket);

        // Close bracket
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.CloseBracket, CharacterCodes.closeBracket);

        // Caret
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Caret, CharacterCodes.caret);
        this.AddTransition(TypescriptFSMStates.Caret, TypescriptFSMStates.CaretEquals, CharacterCodes.equals);

        // Open brace
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.OpenBrace, CharacterCodes.openBrace);
        
        // Bar
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Bar, CharacterCodes.bar);        
        this.AddTransition(TypescriptFSMStates.Bar, TypescriptFSMStates.BarBar, CharacterCodes.bar);
        this.AddTransition(TypescriptFSMStates.Bar, TypescriptFSMStates.BarEquals, CharacterCodes.equals);

        // Close brace
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.CloseBrace, CharacterCodes.closeBrace);

        // Tilde
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.Tilde, CharacterCodes.tilde);

        // At
        this.AddTransition(TypescriptFSMStates.Initial, TypescriptFSMStates.At, CharacterCodes.at);

        // TODO: backslash        

        // Identifiers
        let identifierStartInputs = [CharacterCodes.$, CharacterCodes.A, CharacterCodes.B, CharacterCodes.C, CharacterCodes.D, CharacterCodes.E, CharacterCodes.F, CharacterCodes.G, CharacterCodes.H, CharacterCodes.I, CharacterCodes.J, CharacterCodes.K, CharacterCodes.L, CharacterCodes.M, CharacterCodes.N, CharacterCodes.O, CharacterCodes.P, CharacterCodes.Q, CharacterCodes.R, CharacterCodes.S, CharacterCodes.T, CharacterCodes.U, CharacterCodes.V, CharacterCodes.W, CharacterCodes.X, CharacterCodes.Y, CharacterCodes.Z, CharacterCodes.a, CharacterCodes.b, CharacterCodes.c, CharacterCodes.d, CharacterCodes.e, CharacterCodes.f, CharacterCodes.g, CharacterCodes.h, CharacterCodes.i, CharacterCodes.j, CharacterCodes.k, CharacterCodes.l, CharacterCodes.m, CharacterCodes.n, CharacterCodes.o, CharacterCodes.p, CharacterCodes.q, CharacterCodes.r, CharacterCodes.s, CharacterCodes.t, CharacterCodes.u, CharacterCodes.v, CharacterCodes.w, CharacterCodes.x, CharacterCodes.y, CharacterCodes.z];
        let identifierPartInputs = identifierStartInputs.concat([CharacterCodes._0, CharacterCodes._1, CharacterCodes._2, CharacterCodes._3, CharacterCodes._4, CharacterCodes._5, CharacterCodes._6, CharacterCodes._7, CharacterCodes._8, CharacterCodes._9]);
        this.addTransitionMultipleInputs(TypescriptFSMStates.Initial, TypescriptFSMStates.IdentifierStart, identifierStartInputs);
        this.addTransitionMultipleInputs(TypescriptFSMStates.IdentifierStart, TypescriptFSMStates.IdentifierPart, identifierPartInputs);        
        this.addTransitionMultipleInputs(TypescriptFSMStates.IdentifierPart, TypescriptFSMStates.IdentifierPart, identifierPartInputs);        
    }

    private InitializeTransitionTable(){
        this.States.forEach(state => {
            this.TransitionTable[state] = [];
            this.Alphabet.forEach(alphabetSymbol => {
                this.TransitionTable[state][alphabetSymbol] = -1;
            });
        });
    }

    public Run(input: string): FSMResult{
        let currentState: number = this.InitialState,
            nextState: number = 0,
            position: number = 0,
            analyzedString: string = "";

        while(nextState != -1 && position < input.length){
            nextState = this.GetNextState(currentState, input.charCodeAt(position));
            if(nextState != -1){                                
                analyzedString += input.charAt(position);
                currentState = nextState;
                position++;
            }
        }

        return <FSMResult>{
            Accepted: this.NotAcceptingStates.indexOf(currentState) == -1,
            AnalyzedString: analyzedString,
            AcceptingState: currentState
        };
    }

    public GetNextState(currentState: number, input: number): number{
        let column = this.inputToColumn(input);

        // Input is not in the alphabet
        if(column == -1){
            return -1;
        }

        return this.TransitionTable[currentState][column];
    }    

    private enumToArray(enumerator: any){
        let arr = [];
        let counter = 0;
        for(let item in enumerator){
            if(isNaN(Number(item))){
                arr.push(counter);
                counter++;
            }            
        }
        return arr;
    }

    private inputToColumn(input: number): number{
        let counter = 0;
        for(let item in CharacterCodes){
            if(isNaN(Number(item))){
                if((<any>CharacterCodes[item]) == input){
                    return counter;
                }
                counter++;
            }             
        }

        return -1;
    }

    private addTransitionMultipleInputs(sourceState: number, destinationState: number, inputs: number[]){
        for(let input of inputs){
            this.AddTransition(sourceState, destinationState, input);
        }
    }

    private addTransitionAllInputs(sourceState: number, destinationState: number){
        for(let item in  CharacterCodes){
            if(isNaN(Number(item))){
                this.AddTransition(sourceState, destinationState, (<any>CharacterCodes[item]));
            }
        }
    }
}