import { ReactNode } from 'react';
import { Element } from '@shared/schema';
import { useBuilderStore } from '@/store/builderStore';
import { ResizableElement } from './ResizableElement';
import { Edit3, Trash2 } from 'lucide-react';

interface CanvasElementProps {
  element: Element;
  isSelected?: boolean;
}

export function CanvasElement({ element, isSelected }: CanvasElementProps) {
  const { selectElement, deleteElement, updateElement } = useBuilderStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const handleResize = (width: number, height: number) => {
    updateElement(element.id, {
      style: {
        ...element.style,
        width: `${width}px`,
        height: `${height}px`
      }
    });
  };

  const handleMove = (x: number, y: number) => {
    updateElement(element.id, {
      position: { x, y }
    });
  };

  // Get current dimensions
  const currentWidth = parseInt(element.style.width || '200');
  const currentHeight = parseInt(element.style.height || '100');

  // Get current position with default values
  const currentPosition = {
    x: element.position?.x ?? 0,
    y: element.position?.y ?? 0
  };

  const elementContent = (
    <div 
      className="w-full h-full"
      style={{
        ...element.style,
        position: 'relative',
        opacity: parseFloat(element.style.opacity || '1'),
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      {element.props?.text || element.name}
    </div>
  );

  return (
    <ResizableElement
      elementId={element.id}
      isSelected={!!isSelected}
      onResize={handleResize}
      onMove={handleMove}
      initialPosition={currentPosition}
      initialSize={{ width: currentWidth, height: currentHeight }}
      gridSize={8}
    >
      <div 
        onClick={handleClick} 
        className="w-full h-full relative group"
      >
        {/* Element controls */}
        {isSelected && (
          <div className="absolute -top-8 left-0 z-30 flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            <span className="capitalize">{element.type}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                selectElement(element.id);
              }}
              className="ml-2 hover:bg-blue-600 p-1 rounded"
            >
              <Edit3 size={12} />
            </button>
            <button
              onClick={handleDelete}
              className="hover:bg-red-600 p-1 rounded"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
        {elementContent}
      </div>
    </ResizableElement>
  );
}
