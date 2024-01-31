export declare enum Type {
    String = "string",
    Number = "number"
}
export declare enum Input {
    Text = "text",
    Checkbox = "checkbox"
}
export type ConfDesc = {
    type: Type;
    input: Input;
    display_name: string;
    placeholder: string;
    section?: string;
    value?: any;
    checkboxes?: string[];
};
