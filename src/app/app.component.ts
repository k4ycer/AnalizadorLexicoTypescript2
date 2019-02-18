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

	ngOnInit(){
		let input = "let hola: boolean;\nlet adios: int;\nlet hey = (hola*adios);";
		console.log("Lexer input:\n", input)
		let lexer: Lexer = new Lexer(input);
		let tokens: Token[] = lexer.tokenize();
		console.log("tokens", tokens);
	}	
}
