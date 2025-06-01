export interface Element {
  id: string;
  type: string;
  name: string;
  visible?: boolean;
  position: {
    x: number;
    y: number;
  };
  style: {
    position?: 'absolute';
    left?: string;
    top?: string;
    width?: string;
    height?: string;
    backgroundColor?: string;
    color?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textDecoration?: string;
    textAlign?: string;
    cursor?: string;
    clipPath?: string;
    objectFit?: string;
    transform?: string;
    opacity?: string;
    boxShadow?: string;
    '&:after'?: {
      content?: string;
      position?: string;
      bottom?: string;
      left?: string;
      borderWidth?: string;
      borderStyle?: string;
      borderColor?: string;
    };
  };
  props?: {
    src?: string;
    alt?: string;
    href?: string;
    target?: string;
    text?: string;
    placeholder?: string;
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
  };
  children?: Element[];
} 