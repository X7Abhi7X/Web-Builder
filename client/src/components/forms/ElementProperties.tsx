import { CanvasElement, ElementStyle } from '@/types/builder';
import { useBuilderStore } from '@/store/builderStore';
import { getElementById } from '@/lib/builderUtils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, AlignLeft, AlignCenter, AlignRight, RotateCcw, Move3D } from 'lucide-react';

interface ElementPropertiesProps {
  elementId: string;
}

export function ElementProperties({ elementId }: ElementPropertiesProps) {
  const { elements, updateElement, deleteElement } = useBuilderStore();
  const element = getElementById(elements, elementId);

  if (!element) {
    return (
      <div className="p-4 text-center text-gray-500">
        Element not found
      </div>
    );
  }

  const updateElementProp = (path: string, value: any) => {
    const pathParts = path.split('.');
    let updates: any = {};
    
    if (pathParts.length === 1) {
      updates = { [pathParts[0]]: value };
    } else if (pathParts[0] === 'props') {
      updates = {
        props: {
          ...element.props,
          [pathParts[1]]: value
        }
      };
    } else if (pathParts[0] === 'style') {
      updates = {
        props: {
          ...element.props,
          style: {
            ...element.props.style,
            [pathParts[1]]: value
          }
        }
      };
    }
    
    updateElement(elementId, updates);
  };

  const style = element.props.style || {};
  const position = element.position || { x: 0, y: 0 };

  return (
    <div className="space-y-4 text-sm">
      {/* Element Header */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 capitalize">{element.type}</h3>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Move3D size={12} />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <RotateCcw size={12} />
            </Button>
          </div>
        </div>
      </div>

      {/* Position */}
      <div>
        <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Position</Label>
        <div className="mt-2 space-y-2">
          {/* Alignment buttons */}
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              <AlignLeft size={12} />
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              <AlignCenter size={12} />
            </Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
              <AlignRight size={12} />
            </Button>
          </div>
          
          {/* X and Y coordinates */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-600">X</Label>
              <Input
                value={Math.round(position.x)}
                onChange={(e) => updateElement(elementId, { position: { ...position, x: parseInt(e.target.value) || 0 } })}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Y</Label>
              <Input
                value={Math.round(position.y)}
                onChange={(e) => updateElement(elementId, { position: { ...position, y: parseInt(e.target.value) || 0 } })}
                className="h-7 text-xs"
              />
            </div>
          </div>
          
          {/* Rotation */}
          <div>
            <Label className="text-xs text-gray-600">Rotation</Label>
            <div className="flex items-center space-x-2">
              <Input
                value="0°"
                className="h-7 text-xs"
                readOnly
              />
              <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                <RotateCcw size={12} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Layout - Dimensions */}
      <div>
        <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Layout</Label>
        <div className="mt-2">
          <Label className="text-xs text-gray-600">Dimensions</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <Label className="text-xs text-gray-500">W</Label>
              <Input
                value={style.width ? parseInt(style.width) : '200'}
                onChange={(e) => updateElementProp('style.width', `${e.target.value}px`)}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">H</Label>
              <Input
                value={style.height ? parseInt(style.height) : '100'}
                onChange={(e) => updateElementProp('style.height', `${e.target.value}px`)}
                className="h-7 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Appearance */}
      <div>
        <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Appearance</Label>
        <div className="mt-2 space-y-3">
          {/* Opacity */}
          <div>
            <Label className="text-xs text-gray-600">Opacity</Label>
            <div className="flex items-center space-x-2">
              <Input
                value="100%"
                className="h-7 text-xs flex-1"
                readOnly
              />
            </div>
          </div>
          
          {/* Corner radius */}
          <div>
            <Label className="text-xs text-gray-600">Corner radius</Label>
            <div className="grid grid-cols-4 gap-1 mt-1">
              <div>
                <Label className="text-xs text-gray-500">TL</Label>
                <Input
                  value={style.borderTopLeftRadius ? parseInt(style.borderTopLeftRadius) : '0'}
                  onChange={(e) => updateElementProp('style.borderTopLeftRadius', `${e.target.value}px`)}
                  className="h-7 text-xs text-center"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">TR</Label>
                <Input
                  value={style.borderTopRightRadius ? parseInt(style.borderTopRightRadius) : '0'}
                  onChange={(e) => updateElementProp('style.borderTopRightRadius', `${e.target.value}px`)}
                  className="h-7 text-xs text-center"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">BR</Label>
                <Input
                  value={style.borderBottomRightRadius ? parseInt(style.borderBottomRightRadius) : '0'}
                  onChange={(e) => updateElementProp('style.borderBottomRightRadius', `${e.target.value}px`)}
                  className="h-7 text-xs text-center"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">BL</Label>
                <Input
                  value={style.borderBottomLeftRadius ? parseInt(style.borderBottomLeftRadius) : '0'}
                  onChange={(e) => updateElementProp('style.borderBottomLeftRadius', `${e.target.value}px`)}
                  className="h-7 text-xs text-center"
                />
              </div>
            </div>
            <div className="mt-2">
              <Label className="text-xs text-gray-500">All</Label>
              <Input
                value={style.borderRadius ? parseInt(style.borderRadius) : '0'}
                onChange={(e) => {
                  const value = `${e.target.value}px`;
                  updateElementProp('style.borderRadius', value);
                  updateElementProp('style.borderTopLeftRadius', value);
                  updateElementProp('style.borderTopRightRadius', value);
                  updateElementProp('style.borderBottomRightRadius', value);
                  updateElementProp('style.borderBottomLeftRadius', value);
                }}
                className="h-7 text-xs"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Fill */}
      <div>
        <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Fill</Label>
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={style.backgroundColor || '#ffffff'}
              onChange={(e) => updateElementProp('style.backgroundColor', e.target.value)}
              className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
            />
            <Input
              value={style.backgroundColor || '#ffffff'}
              onChange={(e) => updateElementProp('style.backgroundColor', e.target.value)}
              className="h-7 text-xs flex-1"
            />
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Border */}
      <div>
        <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Border</Label>
        <div className="mt-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-600">Width</Label>
              <Input
                value={style.borderWidth || '0'}
                onChange={(e) => updateElementProp('style.borderWidth', `${e.target.value}px`)}
                className="h-7 text-xs"
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Style</Label>
              <Select
                value={style.borderStyle || 'solid'}
                onValueChange={(value) => updateElementProp('style.borderStyle', value)}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-600">Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={style.borderColor || '#000000'}
                onChange={(e) => updateElementProp('style.borderColor', e.target.value)}
                className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={style.borderColor || '#000000'}
                onChange={(e) => updateElementProp('style.borderColor', e.target.value)}
                className="h-7 text-xs flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Padding */}
      <div>
        <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Padding</Label>
        <div className="mt-2">
          <div className="grid grid-cols-4 gap-1">
            <div>
              <Label className="text-xs text-gray-500">T</Label>
              <Input
                value={style.paddingTop ? parseInt(style.paddingTop) : '8'}
                onChange={(e) => updateElementProp('style.paddingTop', `${e.target.value}px`)}
                className="h-7 text-xs text-center"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">R</Label>
              <Input
                value={style.paddingRight ? parseInt(style.paddingRight) : '8'}
                onChange={(e) => updateElementProp('style.paddingRight', `${e.target.value}px`)}
                className="h-7 text-xs text-center"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">B</Label>
              <Input
                value={style.paddingBottom ? parseInt(style.paddingBottom) : '8'}
                onChange={(e) => updateElementProp('style.paddingBottom', `${e.target.value}px`)}
                className="h-7 text-xs text-center"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">L</Label>
              <Input
                value={style.paddingLeft ? parseInt(style.paddingLeft) : '8'}
                onChange={(e) => updateElementProp('style.paddingLeft', `${e.target.value}px`)}
                className="h-7 text-xs text-center"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Margin */}
      <div>
        <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Margin</Label>
        <div className="mt-2">
          <div className="grid grid-cols-4 gap-1">
            <div>
              <Label className="text-xs text-gray-500">T</Label>
              <Input
                value={style.marginTop ? parseInt(style.marginTop) : '0'}
                onChange={(e) => updateElementProp('style.marginTop', `${e.target.value}px`)}
                className="h-7 text-xs text-center"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">R</Label>
              <Input
                value={style.marginRight ? parseInt(style.marginRight) : '0'}
                onChange={(e) => updateElementProp('style.marginRight', `${e.target.value}px`)}
                className="h-7 text-xs text-center"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">B</Label>
              <Input
                value={style.marginBottom ? parseInt(style.marginBottom) : '0'}
                onChange={(e) => updateElementProp('style.marginBottom', `${e.target.value}px`)}
                className="h-7 text-xs text-center"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">L</Label>
              <Input
                value={style.marginLeft ? parseInt(style.marginLeft) : '0'}
                onChange={(e) => updateElementProp('style.marginLeft', `${e.target.value}px`)}
                className="h-7 text-xs text-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Properties for text elements */}
      {(element.type === 'text' || element.type === 'heading' || element.type === 'button') && (
        <>
          <Separator />
          <div>
            <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Content</Label>
            <div className="mt-2">
              <Textarea
                value={element.props.text || ''}
                onChange={(e) => updateElementProp('props.text', e.target.value)}
                className="h-16 text-xs resize-none"
                placeholder="Enter text..."
              />
            </div>
          </div>
          
          <div>
            <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Typography</Label>
            <div className="mt-2 space-y-2">
              {/* Font Family */}
              <div>
                <Label className="text-xs text-gray-600">Font Family</Label>
                <Select
                  value={style.fontFamily || 'Inter'}
                  onValueChange={(value) => updateElementProp('style.fontFamily', value)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">Font Size</Label>
                  <Input
                    value={style.fontSize ? parseInt(style.fontSize) : '16'}
                    onChange={(e) => updateElementProp('style.fontSize', `${e.target.value}px`)}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Weight</Label>
                  <Select
                    value={style.fontWeight || '400'}
                    onValueChange={(value) => updateElementProp('style.fontWeight', value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">Thin</SelectItem>
                      <SelectItem value="200">Extra Light</SelectItem>
                      <SelectItem value="300">Light</SelectItem>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                      <SelectItem value="800">Extra Bold</SelectItem>
                      <SelectItem value="900">Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Text Alignment */}
              <div>
                <Label className="text-xs text-gray-600">Text Align</Label>
                <Select
                  value={style.textAlign || 'left'}
                  onValueChange={(value) => updateElementProp('style.textAlign', value)}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Text Color */}
              <div>
                <Label className="text-xs text-gray-600">Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={style.color || '#000000'}
                    onChange={(e) => updateElementProp('style.color', e.target.value)}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={style.color || '#000000'}
                    onChange={(e) => updateElementProp('style.color', e.target.value)}
                    className="h-7 text-xs flex-1"
                  />
                </div>
              </div>
              
              {/* Line Height */}
              <div>
                <Label className="text-xs text-gray-600">Line Height</Label>
                <Input
                  value={style.lineHeight || '1.5'}
                  onChange={(e) => updateElementProp('style.lineHeight', e.target.value)}
                  className="h-7 text-xs"
                  placeholder="1.5"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Image Properties */}
      {element.type === 'image' && (
        <>
          <Separator />
          <div>
            <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Image</Label>
            <div className="mt-2 space-y-2">
              <div>
                <Label className="text-xs text-gray-600">Source URL</Label>
                <Input
                  value={element.props.src || ''}
                  onChange={(e) => updateElementProp('props.src', e.target.value)}
                  className="h-7 text-xs"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Alt Text</Label>
                <Input
                  value={element.props.alt || ''}
                  onChange={(e) => updateElementProp('props.alt', e.target.value)}
                  className="h-7 text-xs"
                  placeholder="Describe the image"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Delete Action */}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => deleteElement(elementId)}
        className="w-full h-8 text-xs"
      >
        <Trash2 size={12} className="mr-2" />
        Delete Element
      </Button>
    </div>
  );
}
