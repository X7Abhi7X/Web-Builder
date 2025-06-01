import { useState } from 'react';
import { Element } from '@shared/schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  RotateCcw,
  Link,
  History,
  Grid,
  Moon,
  Eye,
  Type,
  Settings,
  Layers,
  MousePointer,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Move,
  CornerUpLeft,
  Copy,
  Trash
} from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PropertiesSidebarProps {
  selectedElement?: Element;
}

const fontFamilies = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Source Sans Pro',
  'Poppins'
];

const fontWeights = [
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' }
];

const fontSizes = Array.from({ length: 16 }, (_, i) => (i + 1) * 8);

export default function PropertiesSidebar({ selectedElement }: PropertiesSidebarProps) {
  const updateElement = useBuilderStore(state => state.updateElement);
  const getProject = useBuilderStore(state => state.getProject);
  const queryClient = useQueryClient();

  const updateProjectMutation = useMutation({
    mutationFn: async (updates: { elements: Element[] }) => {
      const project = getProject();
      if (!project) return;
      
      return apiRequest('PUT', `/api/projects/${project.id}`, {
        content: updates
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${getProject()?.id}`] });
    }
  });

  const handleStyleChange = (property: string, value: string | number) => {
    if (!selectedElement) return;

    updateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [property]: typeof value === 'number' ? `${value}px` : value
      }
    });

    // Sync with server
    const project = getProject();
    if (project) {
      updateProjectMutation.mutate({
        elements: project.content.elements
      });
    }
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (!selectedElement) return;
    
    updateElement(selectedElement.id, {
      position: {
        ...selectedElement.position,
        [axis]: value
      }
    });

    // Sync with server
    const project = getProject();
    if (project) {
      updateProjectMutation.mutate({
        elements: project.content.elements
      });
    }
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    updateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [dimension]: `${value}px`
      }
    });
  };

  const handleRotationChange = (value: number) => {
    updateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        transform: `rotate(${value}deg)`
      }
    });
  };

  const handleAlignmentChange = (alignment: string) => {
    updateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        textAlign: alignment
      }
    });
  };

  if (!selectedElement) {
    return (
      <div className="w-[300px] border-l border-[#2D2D2D] bg-[#1E1E1E] p-4">
        <p className="text-sm text-gray-400">No element selected</p>
      </div>
    );
  }

  // Get the opacity as a number between 0 and 100
  const currentOpacity = Math.round(parseFloat(selectedElement.style.opacity || '1') * 100);
  
  // Get the border radius as a number
  const currentBorderRadius = parseInt(selectedElement.style.borderRadius || '0');

  return (
    <div className="w-[300px] border-l border-[#2D2D2D] bg-[#1E1E1E] p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Position Controls */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-200">Position</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">X</Label>
              <Input
                type="number"
                value={selectedElement.position?.x || 0}
                onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
                className="h-8"
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Y</Label>
              <Input
                type="number"
                value={selectedElement.position?.y || 0}
                onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
                className="h-8"
                step={1}
              />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-200">Appearance</Label>
          
          {/* Opacity Control */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Opacity</Label>
            <div className="flex gap-2 items-center">
              <Slider
                value={[currentOpacity]}
                onValueChange={([value]) => handleStyleChange('opacity', (value / 100).toString())}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-12 text-right">
                {currentOpacity}%
              </span>
            </div>
          </div>

          {/* Border Radius Control */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Border Radius</Label>
            <div className="flex gap-2 items-center">
              <Slider
                value={[currentBorderRadius]}
                onValueChange={([value]) => handleStyleChange('borderRadius', value)}
                min={0}
                max={50}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-gray-400 w-12 text-right">
                {currentBorderRadius}px
              </span>
            </div>
          </div>

          {/* Box Shadow Control */}
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Box Shadow</Label>
            <RadioGroup
              defaultValue={selectedElement.style.boxShadow === 'none' ? 'none' : 'custom'}
              className="grid grid-cols-2 gap-2 mb-2"
              onValueChange={(value) => {
                if (value === 'none') {
                  handleStyleChange('boxShadow', 'none');
                } else {
                  handleStyleChange('boxShadow', '0px 2px 4px rgba(0, 0, 0, 0.1)');
                }
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="shadow-none" />
                <Label htmlFor="shadow-none" className="text-xs">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="shadow-custom" />
                <Label htmlFor="shadow-custom" className="text-xs">Custom</Label>
              </div>
            </RadioGroup>

            {selectedElement.style.boxShadow !== 'none' && (
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-gray-500">Offset X</Label>
                  <div className="flex gap-2 items-center">
                    <Slider
                      value={[parseInt(selectedElement.style.boxShadow?.split(' ')[0] || '0')]}
                      onValueChange={([value]) => {
                        const parts = (selectedElement.style.boxShadow || '0px 2px 4px rgba(0, 0, 0, 0.1)').split(' ');
                        parts[0] = `${value}px`;
                        handleStyleChange('boxShadow', parts.join(' '));
                      }}
                      min={-20}
                      max={20}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-8">
                      {parseInt(selectedElement.style.boxShadow?.split(' ')[0] || '0')}px
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Offset Y</Label>
                  <div className="flex gap-2 items-center">
                    <Slider
                      value={[parseInt(selectedElement.style.boxShadow?.split(' ')[1] || '0')]}
                      onValueChange={([value]) => {
                        const parts = (selectedElement.style.boxShadow || '0px 2px 4px rgba(0, 0, 0, 0.1)').split(' ');
                        parts[1] = `${value}px`;
                        handleStyleChange('boxShadow', parts.join(' '));
                      }}
                      min={-20}
                      max={20}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-8">
                      {parseInt(selectedElement.style.boxShadow?.split(' ')[1] || '0')}px
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Blur</Label>
                  <div className="flex gap-2 items-center">
                    <Slider
                      value={[parseInt(selectedElement.style.boxShadow?.split(' ')[2] || '0')]}
                      onValueChange={([value]) => {
                        const parts = (selectedElement.style.boxShadow || '0px 2px 4px rgba(0, 0, 0, 0.1)').split(' ');
                        parts[2] = `${value}px`;
                        handleStyleChange('boxShadow', parts.join(' '));
                      }}
                      min={0}
                      max={40}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-8">
                      {parseInt(selectedElement.style.boxShadow?.split(' ')[2] || '0')}px
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500">Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={selectedElement.style.boxShadow?.split(' ')[3] || 'rgba(0, 0, 0, 0.1)'}
                      onChange={(e) => {
                        const parts = (selectedElement.style.boxShadow || '0px 2px 4px rgba(0, 0, 0, 0.1)').split(' ');
                        parts[3] = e.target.value;
                        handleStyleChange('boxShadow', parts.join(' '));
                      }}
                      className="h-7 w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="bg-[#2D2D2D]" />

        <ScrollArea className="h-[calc(100%-2.5rem)]">
          <Tabs defaultValue="style" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
              <TabsTrigger value="layout" className="flex-1">Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="style" className="p-4 space-y-6">
              {/* Colors */}
              <div className="space-y-4">
                <Label className="text-xs font-medium text-gray-400">Colors</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">Background</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={selectedElement.style.backgroundColor || '#FFFFFF'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                      <Input
                        type="text"
                        value={selectedElement.style.backgroundColor || '#FFFFFF'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={selectedElement.style.color || '#000000'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                      <Input
                        type="text"
                        value={selectedElement.style.color || '#000000'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              {(selectedElement.type === 'text' || selectedElement.type === 'heading1' || selectedElement.type === 'heading2' || selectedElement.type === 'heading3' || selectedElement.type === 'paragraph') && (
                <div className="space-y-4">
                  <Label className="text-xs font-medium text-gray-400">Typography</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-gray-500">Font Family</Label>
                      <Select
                        value={selectedElement.style.fontFamily || 'Inter'}
                        onValueChange={(value) => handleStyleChange('fontFamily', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontFamilies.map(font => (
                            <SelectItem key={font} value={font}>{font}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Font Size</Label>
                      <div className="flex gap-2 items-center">
                        <Slider
                          value={[parseInt(selectedElement.style.fontSize || '16')]}
                          onValueChange={([value]) => handleStyleChange('fontSize', `${value}px`)}
                          min={8}
                          max={72}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-400 w-8">
                          {parseInt(selectedElement.style.fontSize || '16')}px
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Font Weight</Label>
                      <Select
                        value={selectedElement.style.fontWeight || '400'}
                        onValueChange={(value) => handleStyleChange('fontWeight', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontWeights.map(weight => (
                            <SelectItem key={weight.value} value={weight.value}>
                              {weight.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Line Height</Label>
                      <Input
                        type="number"
                        value={parseFloat(selectedElement.style.lineHeight || '1.5')}
                        onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                        step={0.1}
                        min={1}
                        max={2}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Letter Spacing</Label>
                      <Input
                        type="number"
                        value={parseFloat(selectedElement.style.letterSpacing || '0')}
                        onChange={(e) => handleStyleChange('letterSpacing', `${e.target.value}px`)}
                        step={0.5}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Border */}
              <div className="space-y-4">
                <Label className="text-xs font-medium text-gray-400">Border</Label>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Border Width</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        value={parseInt(selectedElement.style.borderWidth || '0')}
                        onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)}
                        min={0}
                        className="w-20"
                      />
                      <Select
                        value={selectedElement.style.borderStyle || 'solid'}
                        onValueChange={(value) => handleStyleChange('borderStyle', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                          <SelectItem value="dotted">Dotted</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="color"
                        value={selectedElement.style.borderColor || '#000000'}
                        onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Effects */}
              <div className="space-y-4">
                <Label className="text-xs font-medium text-gray-400">Effects</Label>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Box Shadow</Label>
                    <Input
                      type="text"
                      value={selectedElement.style.boxShadow || 'none'}
                      onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                      placeholder="0px 4px 8px rgba(0, 0, 0, 0.1)"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="p-4 space-y-6">
              {/* Size */}
              <div className="space-y-4">
                <Label className="text-xs font-medium text-gray-400">Size</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-500">Width</Label>
                    <Input
                      type="number"
                      value={parseInt(selectedElement.style.width || '0')}
                      onChange={(e) => handleStyleChange('width', `${e.target.value}px`)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Height</Label>
                    <Input
                      type="number"
                      value={parseInt(selectedElement.style.height || '0')}
                      onChange={(e) => handleStyleChange('height', `${e.target.value}px`)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div className="space-y-4">
                <Label className="text-xs font-medium text-gray-400">Spacing</Label>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Padding</Label>
                    <div className="grid grid-cols-4 gap-1">
                      <div>
                        <Label className="text-xs text-gray-400">Top</Label>
                        <Input
                          type="number"
                          value={parseInt(selectedElement.style.paddingTop || '0')}
                          onChange={(e) => handleStyleChange('paddingTop', `${e.target.value}px`)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-400">Right</Label>
                        <Input
                          type="number"
                          value={parseInt(selectedElement.style.paddingRight || '0')}
                          onChange={(e) => handleStyleChange('paddingRight', `${e.target.value}px`)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-400">Bottom</Label>
                        <Input
                          type="number"
                          value={parseInt(selectedElement.style.paddingBottom || '0')}
                          onChange={(e) => handleStyleChange('paddingBottom', `${e.target.value}px`)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-400">Left</Label>
                        <Input
                          type="number"
                          value={parseInt(selectedElement.style.paddingLeft || '0')}
                          onChange={(e) => handleStyleChange('paddingLeft', `${e.target.value}px`)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Margin</Label>
                    <div className="grid grid-cols-4 gap-1">
                      <div>
                        <Label className="text-xs text-gray-400">Top</Label>
                        <Input
                          type="number"
                          value={parseInt(selectedElement.style.marginTop || '0')}
                          onChange={(e) => handleStyleChange('marginTop', `${e.target.value}px`)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-400">Right</Label>
                        <Input
                          type="number"
                          value={parseInt(selectedElement.style.marginRight || '0')}
                          onChange={(e) => handleStyleChange('marginRight', `${e.target.value}px`)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-400">Bottom</Label>
                        <Input
                          type="number"
                          value={parseInt(selectedElement.style.marginBottom || '0')}
                          onChange={(e) => handleStyleChange('marginBottom', `${e.target.value}px`)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-400">Left</Label>
                        <Input
                          type="number"
                          value={parseInt(selectedElement.style.marginLeft || '0')}
                          onChange={(e) => handleStyleChange('marginLeft', `${e.target.value}px`)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  );
}
