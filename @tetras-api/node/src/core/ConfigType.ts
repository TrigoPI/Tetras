export enum Type {
    String = "string",
    Number = "number"
}

export enum Input {
    Text     = "text",
    Checkbox = "checkbox"
}

export type ConfDesc = {
    type: Type,
    input: Input,
    display_name: string,
    placeholder: string
    section?: string
    value?: any
    checkboxes?: string[]
}