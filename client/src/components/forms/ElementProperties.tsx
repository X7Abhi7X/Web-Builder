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
            <Input
              value={style.borderRadius ? parseInt(style.borderRadius) : '0'}
              onChange={(e) => updateElementProp('style.borderRadius', `${e.target.value}px`)}
              className="h-7 text-xs"
            />
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
              value={style.backgroundColor || '#D9D9D9'}
              onChange={(e) => updateElementProp('style.backgroundColor', e.target.value)}
              className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
            />
            <Input
              value={style.backgroundColor || '#D9D9D9'}
              onChange={(e) => updateElementProp('style.backgroundColor', e.target.value)}
              className="h-7 text-xs flex-1"
            />
            <span className="text-xs text-gray-500">100%</span>
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
                      <SelectItem value="300">Light</SelectItem>
                      <SelectItem value="400">Regular</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
