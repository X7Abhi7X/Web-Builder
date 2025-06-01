import { MouseEvent } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { DropZone } from '@/components/drag-drop/DropZone';
import { CanvasElement } from './CanvasElement';
import { cn } from '@/lib/utils';

export function Canvas() {
  const { elements, selectedElementId, selectElement, viewport, zoom } = useBuilderStore();

  const handleCanvasClick = (e: MouseEvent) => {
    // Only deselect if clicking directly on the canvas
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  const getCanvasWidth = () => {
    switch (viewport) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '1400px';
    }
  };

  return (
    <div className="flex-1 bg-gray-800 overflow-auto p-8">
      <div className="flex justify-center">
        <div
          className="bg-black rounded-lg shadow-2xl relative transition-all duration-300 border border-gray-600"
          style={{
            width: getCanvasWidth(),
            minHeight: '1200px',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
        >
          <DropZone
            className="w-full h-full relative"
          >
            {/* Canvas grid background */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* Canvas elements */}
            {elements.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎨</div>
                  <p className="text-lg font-medium text-white">Start building your website</p>
                  <p className="text-sm text-gray-300">Drag elements from the sidebar to get started</p>
                </div>
              </div>
            ) : (
              elements.map((element) => (
                <CanvasElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                />
              ))
            )}
          </DropZone>
        </div>
      </div>
    </div>
  );
}
