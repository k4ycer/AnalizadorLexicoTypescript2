export interface FSM{

    // Properties
    Alphabet: number[];
    States: number[];
    AcceptingStates: number[];
    InitialState: number;
    TransitionTable: number[][];
    
    // Methods
    AddTransition(sourceState: number, destinationState: number, input: number);
    GetNextState(currentState: number, input: number): number;
    Run(input: string): FSMResult;
}

export interface FSMResult{
    Accepted: boolean;
    AnalyzedString: string;
    AcceptingState: number;
}