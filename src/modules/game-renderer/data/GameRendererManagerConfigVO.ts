import { RendererManagerConfigVO } from "@flashist/appframework";
import { TemplateSettings } from "../../../TemplateSettings";

export class GameRendererManagerConfigVO extends RendererManagerConfigVO {
    antialias: boolean = false;
    backgroundAlpha: number = 1;
    backgroundColor: number = TemplateSettings.colors.black;
}