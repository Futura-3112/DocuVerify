export interface State {
    id: number;
    name: string;
    code?: string;
}

export interface AgeCategory {
    id: number;
    name: string;
    minAge: number;
    maxAge: number;
}

export interface Process {
    id: number;
    name: string;
    description?: string;
}

export interface MetaData {
    states: State[];
    ageCategories: AgeCategory[];
    processes: Process[];
}

export interface DocumentResult {
    documentId: number;
    documentName: string;
    stepDescription: string;
    sortOrder: number;
    notes?: string;
}

export interface SearchParams {
    processId: string;
    ageCategoryId: string;
    stateId: string;
}
