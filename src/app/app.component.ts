import { TypescriptFSMStates } from './model/Constants/TypescriptFSMStates';
import { CharacterCodes } from './model/Constants/CharacterCodes';
import { Component } from '@angular/core';
import { Lexer } from './model/Classes/Lexer';
import { Token } from './model/Classes/Token';
import { TokenTypes } from './model/Constants/TokenTypes';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'AnalizadorLexicoTypescript2';
	public lexer: Lexer;
	public input: string;
	public tokenLinesUI: Token[][] = [];
	public error: string;
	public characterCodesUI: string[];
	public statesUI: string[];

	ngOnInit(){
		
	}	

	readFile(e){
		let file = e.target.files[0];
		if(!file){
			return;
		}

		let reader = new FileReader();
		reader.onload = (ef) => {
			this.input = (<any>ef).target.result;
			console.log("Input: ", this.input);
			this.lexer = new Lexer(this.input);
			this.buildUITransitionMatrix();
			this.startLexicalAnalysis();
		}
		reader.readAsText(file);
	}	

	startLexicalAnalysis(){
		let tokens: Token[];
		try{
			tokens = this.lexer.tokenize();
			console.log("tokens", tokens);					
		}catch(e){
			console.log("Lexical Analysis failed: ", e.message);
			this.error = "Lexical Analysis failed: " + e.message;
			tokens = e.currentTokens;
		}	

		if(tokens){
			let currentLine = tokens[0].Line;
			this.tokenLinesUI[currentLine] = [];
			tokens.forEach(token => {
				if(currentLine != token.Line){
					currentLine = token.Line;
					this.tokenLinesUI[currentLine] = [];
				}

				this.tokenLinesUI[currentLine].push(token);
			});	
		}		
	}

	buildUITransitionMatrix(){
		this.characterCodesUI = [];
		this.statesUI = [];
		for(let item in CharacterCodes){
            if(isNaN(Number(item))){
                this.characterCodesUI.push(item);
            }             
		}

		for(let item in TypescriptFSMStates){
			if(isNaN(Number(item))){
				this.statesUI.push(item);
            }    
		}
		
		console.log('characterCodesUi', this.characterCodesUI);
		console.log('statesUI', this.statesUI);
	}
}
