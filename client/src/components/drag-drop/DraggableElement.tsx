import { DragEvent, ReactNode } from 'react';
import { useBuilderStore } from '@/store/builderStore';

interface DraggableElementProps {
  elementType: string;
  children: ReactNode;
  className?: string;
}

export function DraggableElement({ elementType, children, className = '' }: DraggableElementProps) {
  const setDraggedElementType = useBuilderStore(state => state.setDraggedElementType);

  const handleDragStart = (e: DragEvent) => {
    setDraggedElementType(elementType);
    e.dataTransfer.setData('text/plain', elementType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedElementType(null);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`cursor-grab active:cursor-grabbing ${className}`}
    >
      {children}
    </div>
  );
}
