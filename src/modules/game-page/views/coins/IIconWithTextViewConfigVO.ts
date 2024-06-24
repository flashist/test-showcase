import {IFLabelConfig, Point} from "@flashist/flibs";

export interface IIconWithTextViewConfigVO {
    icon: {
        imageId: string,
        size: Point,
    };

    label: IFLabelConfig;
}