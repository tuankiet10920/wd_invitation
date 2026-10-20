export interface Border {
  size: number;
  color: string;
  style: "solid" | "dashed" | "dotted" | "double" | "none";
  position: "top" | "bottom" | "left" | "right";
  "border-top-right-radius": number;
  "border-top-left-radius": number;
  "border-bottom-right-radius": number;
  "border-bottom-left-radius": number;
}

export interface BoxShadow {
  horizontal: number;
  verticle: number;
  blur: number;
  spread: number;
  color: string;
}

export interface Symmetry {
  horizontal: boolean; // lật ngang
  vertical: boolean; // lật dọc
}

export interface Padding {
  top: number;
  bottom: number;
  right: number;
  left: number;
}

export interface KindText {
  bold: boolean;
  italic: boolean;
  through: boolean;
  underline: boolean;
  uppercase: boolean;
  "letter-spacing": number;
  "line-height": number;
  "text-align": "start" | "center" | "end" | "justify";
  "font-size": number;
  "font-family": string;
  color: string;
  background: string;
  opacity: number;
}

export interface BaseNode {
  width: number;
  top: number;
  left: number;
  position: "absolute" | "relative" | "fixed" | "sticky";
  zIndex: number;
  isLocked: boolean;
}

export interface Image extends BaseNode {
  height: number;
  color: string;
  opacity: number;
  symmetry: Symmetry;
  border: Border;
  boxShadow: BoxShadow;
}

export interface Text extends BaseNode {
  kind: KindText;
  padding: Padding;
  border: Border;
  boxShadow: BoxShadow;
}
