import { useState } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { ElementProperties } from '@/components/forms/ElementProperties';
import { LayersPanel } from './LayersPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Layers, MousePointer } from 'lucide-react';

export function PropertiesSidebar() {
  const { selectedElementId } = useBuilderStore();

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <div className="border-b border-gray-200">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties" className="flex items-center space-x-2">
              <Settings size={16} />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="layers" className="flex items-center space-x-2">
              <Layers size={16} />
              <span>Layers</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="properties" className="flex-1 overflow-y-auto p-4 mt-0">
          {selectedElementId ? (
            <ElementProperties elementId={selectedElementId} />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <MousePointer size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium">No element selected</p>
              <p className="text-xs mt-1">Click on an element to edit its properties</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="layers" className="flex-1 overflow-hidden mt-0">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Layers</h3>
            <p className="text-sm text-gray-500 mt-1">Manage element hierarchy</p>
          </div>
          <LayersPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
