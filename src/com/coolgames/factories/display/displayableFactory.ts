import { Displayable } from "../../components/display/displayable";

export interface DisplaylableFactory {
    get(imageId: string): Displayable;
    createImages(numImages: number):void;
}