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
		// this.input = "let hola: boolean;\nlet adios: int;\nlet hey = (hola*adios); let palabra = 'palabrita hola'";				
		// this.startLexicalAnalysis();
	}	

	readFile(e){
		let file = e.target.files[0];
		if(!file){
			return;
		}

		let reader = new FileReader();
		reader.onload = (ef) => {
			let contents = (<any>ef).target.result;
			console.log("Input: ", contents);
			this.lexer = new Lexer(contents);
			this.startLexicalAnalysis();
		}
		reader.readAsText(file);
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
