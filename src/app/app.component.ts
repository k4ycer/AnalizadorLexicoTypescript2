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
	public lexer: Lexer;

	ngOnInit(){
		// let input = "let hola: boolean;\nlet adios: int;\nlet hey = (hola*adios); let palabra = 'palabrita hola'";				
		// console.log("Input: ", input);
		// this.lexer = new Lexer(input);
		// this.startLexicalAnalysis();
	}	

	readFile(e){
		let file = e.target.files[0];
		if(!file){
			return;
		}

		let reader = new FileReader();
		reader.onload = (ef) => {
			let input = (<any>ef).target.result;
			console.log("Input: ", input);
			this.lexer = new Lexer(input);
			this.startLexicalAnalysis();
		}
		reader.readAsText(file);
	}

	startLexicalAnalysis(){
		let tokens: Token[] = this.lexer.tokenize();
		console.log("tokens", tokens);
		// try{
		// 	let tokens: Token[] = this.lexer.tokenize();
		// 	console.log("tokens", tokens);
		// }catch(e){
		// 	console.log("Lexical Analysis failed: ", e.message);
		// }	
	}
}
