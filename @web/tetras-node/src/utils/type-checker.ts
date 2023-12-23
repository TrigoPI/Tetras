export function TypeValid(value: any, type: "number" | "string"): boolean {
    switch (type) {
        case "string": return typeof value == "string"
        case "number": return !isNaN(Number(value))
    }
}

export function ConvertInputToType(value: any, type: "number" | "string"): any {
    if (!TypeValid(value, type)) throw new Error(`value ${value} is not typeof ${type}`);
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
                datas[desc.name] = ConvertInputToType(formData.get(desc.name), desc.type);
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