import { DragEvent, ReactNode, useState } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { elementTemplates } from '@/lib/builderUtils';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  children: ReactNode;
  onDrop?: (elementType: string, position: { x: number; y: number }) => void;
  parentId?: string;
  className?: string;
  allowDrop?: boolean;
}

export function DropZone({ 
  children, 
  onDrop, 
  parentId, 
  className = '', 
  allowDrop = true 
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { draggedElementType, addElement } = useBuilderStore();

  const handleDragOver = (e: DragEvent) => {
    if (!allowDrop) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    if (!allowDrop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // Check if we're still within the bounds of the drop zone
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    if (!allowDrop) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const elementType = e.dataTransfer.getData('text/plain');
    if (!elementType || !elementTemplates[elementType]) return;

    const rect = e.currentTarget.getBoundingClientRect();
    
    // Calculate position relative to the canvas, accounting for zoom
    const canvasElement = e.currentTarget.closest('[style*="scale"]') as HTMLElement;
    const zoom = canvasElement ? parseFloat(getComputedStyle(canvasElement).transform.match(/scale\(([^)]+)\)/)?.[1] || '1') : 1;
    
    const position = {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    };

    if (onDrop) {
      onDrop(elementType, position);
    } else {
      const template = elementTemplates[elementType];
      const newElement = {
        ...template,
        position: parentId ? undefined : position // Only set position for root elements
      };
      addElement(newElement, parentId);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        className,
        'relative',
        isDragOver && allowDrop && 'bg-blue-900 bg-opacity-20'
      )}
    >
      {children}
      {isDragOver && allowDrop && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
            Drop {draggedElementType} here
          </div>
        </div>
      )}
    </div>
  );
}
