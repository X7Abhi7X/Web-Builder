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
    // Only hide drop indicator if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    if (!allowDrop) return;
    e.preventDefault();
    setIsDragOver(false);

    const elementType = e.dataTransfer.getData('text/plain');
    if (!elementType || !elementTemplates[elementType]) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
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
        isDragOver && allowDrop && 'bg-blue-50 border-2 border-dashed border-blue-300'
      )}
    >
      {children}
      {isDragOver && allowDrop && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-50 border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-blue-500 text-white px-3 py-2 rounded-lg font-medium">
            Drop {draggedElementType} here
          </div>
        </div>
      )}
    </div>
  );
}
