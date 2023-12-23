import { InvalidTypeError } from "./errors";

export function TypeValid(value: any, type: "number" | "string"): boolean {
    switch (type) {
        case "string": return typeof value == "string"
        case "number": return !isNaN(Number(value))
    }
}

export function ConvertInputToType(value: string, type: "number" | "string"): any | undefined{
    if (!TypeValid(value, type)) throw new InvalidTypeError(value, type);
    if (value.length == 0) return undefined

    switch (type) {
        case "string": return value
        case "number": return Number(value)
    }
}

export function BuildForm(formData: FormData, descs: Record<string, any>[]): Record<string, any> {
    let datas: Record<string, any> = {};

    for (const desc of descs) {
        
        switch (desc.input) {
            case "text":
                const value: FormDataEntryValue | null = formData.get(desc.name);
                if (value) datas[desc.name] = ConvertInputToType(value.toString(), desc.type);
            break;
            case "checkbox":
                datas[desc.name] = [];

                for (const box of desc.checkboxes) {
                    if (formData.has(box)) {
                        const value: any = ConvertInputToType(box, desc.type);
                        datas[desc.name].push(value);
                    }
                }
            break;
        }
    }

    return datas;
}