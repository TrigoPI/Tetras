export type CameraName = { name: string };
export type ImageDesc = { 
    name: string, 
    dt: number, 
    id: string 
}

export enum CAMERA_MODE {
    SETUP         = "Setup",
    STORAGE       = "Storage",    
    VIDEO_CAPTURE = "VideoCapture",
    PHOTP_CAPTURE = "PhotoCapture"
}