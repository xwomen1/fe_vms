import { fabric } from "fabric-pure-browser";

export class Circle extends fabric.Circle { }

export const circle = options => new Circle(options);
