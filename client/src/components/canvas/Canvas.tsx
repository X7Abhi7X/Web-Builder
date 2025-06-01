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
        return '1200px';
    }
  };

  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-8">
      <div className="flex justify-center">
        <div
          className="bg-white rounded-lg shadow-lg relative transition-all duration-300"
          style={{
            width: getCanvasWidth(),
            minHeight: '800px',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
        >
          <DropZone
            onDrop={(elementType, position) => {
              // Handle drop on canvas root
            }}
            className="w-full h-full relative"
            onClick={handleCanvasClick}
          >
            {/* Canvas grid background */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #2563eb 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* Canvas elements */}
            {elements.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎨</div>
                  <p className="text-lg font-medium">Start building your website</p>
                  <p className="text-sm">Drag elements from the sidebar to get started</p>
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
