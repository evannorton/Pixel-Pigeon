export interface TextInfoTrim {
  index: number;
  length: number;
}
export interface TextInfoColor {
  color: string;
  index: number;
  length: number;
}
export interface TextInfo {
  colors: TextInfoColor[];
  trims: TextInfoTrim[];
  value: string;
}
