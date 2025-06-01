import { CanvasElement, ElementStyle } from '@/types/builder';
import { useBuilderStore } from '@/store/builderStore';
import { getElementById } from '@/lib/builderUtils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Element Info */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Element</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="font-medium text-gray-900 capitalize">{element.type}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">ID: {element.id}</p>
        </div>
      </div>

      {/* Content Properties */}
      {(element.type === 'text' || element.type === 'heading' || element.type === 'button') && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Content</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="text">Text</Label>
              <Textarea
                id="text"
                value={element.props.text || ''}
                onChange={(e) => updateElementProp('props.text', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Properties */}
      {element.type === 'image' && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Image</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="src">Source URL</Label>
              <Input
                id="src"
                value={element.props.src || ''}
                onChange={(e) => updateElementProp('props.src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={element.props.alt || ''}
                onChange={(e) => updateElementProp('props.alt', e.target.value)}
                placeholder="Describe the image"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Properties */}
      {element.type === 'video' && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Video</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="videoSrc">Source URL</Label>
              <Input
                id="videoSrc"
                value={element.props.src || ''}
                onChange={(e) => updateElementProp('props.src', e.target.value)}
                placeholder="https://example.com/video.mp4"
              />
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Layout Properties */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Layout</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={style.width || ''}
                onChange={(e) => updateElementProp('style.width', e.target.value)}
                placeholder="auto"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={style.height || ''}
                onChange={(e) => updateElementProp('style.height', e.target.value)}
                placeholder="auto"
              />
            </div>
          </div>
          
          <div>
            <Label>Padding</Label>
            <div className="grid grid-cols-4 gap-1 mt-1">
              <Input
                placeholder="T"
                value={style.paddingTop || ''}
                onChange={(e) => updateElementProp('style.paddingTop', e.target.value)}
                className="text-center text-xs"
              />
              <Input
                placeholder="R"
                value={style.paddingRight || ''}
                onChange={(e) => updateElementProp('style.paddingRight', e.target.value)}
                className="text-center text-xs"
              />
              <Input
                placeholder="B"
                value={style.paddingBottom || ''}
                onChange={(e) => updateElementProp('style.paddingBottom', e.target.value)}
                className="text-center text-xs"
              />
              <Input
                placeholder="L"
                value={style.paddingLeft || ''}
                onChange={(e) => updateElementProp('style.paddingLeft', e.target.value)}
                className="text-center text-xs"
              />
            </div>
          </div>
          
          <div>
            <Label>Margin</Label>
            <div className="grid grid-cols-4 gap-1 mt-1">
              <Input
                placeholder="T"
                value={style.marginTop || ''}
                onChange={(e) => updateElementProp('style.marginTop', e.target.value)}
                className="text-center text-xs"
              />
              <Input
                placeholder="R"
                value={style.marginRight || ''}
                onChange={(e) => updateElementProp('style.marginRight', e.target.value)}
                className="text-center text-xs"
              />
              <Input
                placeholder="B"
                value={style.marginBottom || ''}
                onChange={(e) => updateElementProp('style.marginBottom', e.target.value)}
                className="text-center text-xs"
              />
              <Input
                placeholder="L"
                value={style.marginLeft || ''}
                onChange={(e) => updateElementProp('style.marginLeft', e.target.value)}
                className="text-center text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Style Properties */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Style</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={style.backgroundColor || '#ffffff'}
                onChange={(e) => updateElementProp('style.backgroundColor', e.target.value)}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                id="backgroundColor"
                value={style.backgroundColor || ''}
                onChange={(e) => updateElementProp('style.backgroundColor', e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="borderRadius">Border Radius</Label>
            <Input
              id="borderRadius"
              value={style.borderRadius || ''}
              onChange={(e) => updateElementProp('style.borderRadius', e.target.value)}
              placeholder="0px"
            />
          </div>
        </div>
      </div>

      {/* Typography Properties */}
      {(element.type === 'text' || element.type === 'heading' || element.type === 'button') && (
        <>
          <Separator />
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Typography</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  value={style.fontFamily || 'Inter'}
                  onValueChange={(value) => updateElementProp('style.fontFamily', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Input
                    id="fontSize"
                    value={style.fontSize || ''}
                    onChange={(e) => updateElementProp('style.fontSize', e.target.value)}
                    placeholder="16px"
                  />
                </div>
                <div>
                  <Label htmlFor="fontWeight">Font Weight</Label>
                  <Select
                    value={style.fontWeight || '400'}
                    onValueChange={(value) => updateElementProp('style.fontWeight', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Weight" />
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
              
              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={style.color || '#000000'}
                    onChange={(e) => updateElementProp('style.color', e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    id="textColor"
                    value={style.color || ''}
                    onChange={(e) => updateElementProp('style.color', e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* Actions */}
      <div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteElement(elementId)}
          className="w-full"
        >
          <Trash2 size={16} className="mr-2" />
          Delete Element
        </Button>
      </div>
    </div>
  );
}
