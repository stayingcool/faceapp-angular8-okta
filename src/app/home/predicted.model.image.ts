import { SafeUrl } from '@angular/platform-browser';

export interface ICoordinates {
    left: number,
    top: number
}

export interface Faces {
    person?: string;
    coordinates: ICoordinates[]
}

export interface IPredictedImage {
    fileURL: SafeUrl,
    filename?: string,
    faces?: Faces
}

export class PredictedImage implements IPredictedImage {
    fileURL: SafeUrl;
    filename?: string;
    faces?: Faces
}

export interface IPredictedDetails {
    predictedImage: IPredictedImage;
    fileURL: SafeUrl
}