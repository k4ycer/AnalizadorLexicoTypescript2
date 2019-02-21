import { Component } from '@angular/core';
import { Lexer } from './model/Classes/Lexer';
import { Token } from './model/Classes/Token';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'AnalizadorLexicoTypescript2';
	public input: string;
	public lexer: Lexer;

	ngOnInit(){
		this.input = "let hola: boolean;\nlet adios: int;\nlet hey = (hola*adios); let palabra = 'palabrita hola";		
		this.lexer = new Lexer(this.input);
		this.startLexicalAnalysis();
	}	

	readFile(){
		
	}

	startLexicalAnalysis(){
		try{
			let tokens: Token[] = this.lexer.tokenize();
			console.log("tokens", tokens);
		}catch(e){
			console.log("Lexical Analysis failed: ", e.message);
		}	
	}
}
