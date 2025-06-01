export interface ElementStyle {
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  border?: string;
  textAlign?: string;
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  [key: string]: any;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'heading' | 'image' | 'button' | 'section' | 'container' | 'video' | 'navbar' | 'footer';
  props: {
    text?: string;
    src?: string;
    alt?: string;
    href?: string;
    style?: ElementStyle;
    children?: CanvasElement[];
    [key: string]: any;
  };
  position?: {
    x: number;
    y: number;
  };
  parentId?: string;
}

export interface ProjectContent {
  elements: CanvasElement[];
  settings?: {
    theme?: string;
    viewport?: 'desktop' | 'tablet' | 'mobile';
    [key: string]: any;
  };
}

export interface BuilderState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  draggedElementType: string | null;
  clipboard: CanvasElement | null;
  history: CanvasElement[][];
  historyIndex: number;
  viewport: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
}

export interface DragItem {
  type: string;
  elementType?: string;
  element?: CanvasElement;
}
