export function load({ 
    params 
}:{
    params: Record<string, any>
}): Record<string, any> {
    return {
        service: params.service
    }
}