import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { cn } from '@/lib/utils';

interface ResizableElementProps {
  children: React.ReactNode;
  elementId: string;
  isSelected: boolean;
  onResize: (width: number, height: number) => void;
  onMove: (x: number, y: number) => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export function ResizableElement({
  children,
  elementId,
  isSelected,
  onResize,
  onMove,
  initialPosition = { x: 0, y: 0 },
  initialSize = { width: 200, height: 100 }
}: ResizableElementProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (!isSelected) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleResizeMouseDown = (e: ReactMouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPosition({ x: newX, y: newY });
        onMove(newX, newY);
      }
      
      if (isResizing && resizeHandle) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;
        
        switch (resizeHandle) {
          case 'se':
            newWidth = Math.max(50, size.width + deltaX);
            newHeight = Math.max(30, size.height + deltaY);
            break;
          case 'sw':
            newWidth = Math.max(50, size.width - deltaX);
            newHeight = Math.max(30, size.height + deltaY);
            newX = position.x + deltaX;
            break;
          case 'ne':
            newWidth = Math.max(50, size.width + deltaX);
            newHeight = Math.max(30, size.height - deltaY);
            newY = position.y + deltaY;
            break;
          case 'nw':
            newWidth = Math.max(50, size.width - deltaX);
            newHeight = Math.max(30, size.height - deltaY);
            newX = position.x + deltaX;
            newY = position.y + deltaY;
            break;
          case 'n':
            newHeight = Math.max(30, size.height - deltaY);
            newY = position.y + deltaY;
            break;
          case 's':
            newHeight = Math.max(30, size.height + deltaY);
            break;
          case 'e':
            newWidth = Math.max(50, size.width + deltaX);
            break;
          case 'w':
            newWidth = Math.max(50, size.width - deltaX);
            newX = position.x + deltaX;
            break;
        }
        
        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
        onResize(newWidth, newHeight);
        onMove(newX, newY);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, position, size, resizeHandle, onMove, onResize]);

  const resizeHandles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  
  const getHandleClasses = (handle: ResizeHandle) => {
    const baseClasses = 'absolute bg-white border-2 border-blue-500 rounded-sm';
    const size = 'w-3 h-3';
    
    const positions = {
      nw: '-top-1.5 -left-1.5 cursor-nw-resize',
      n: '-top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize',
      ne: '-top-1.5 -right-1.5 cursor-ne-resize',
      e: 'top-1/2 -translate-y-1/2 -right-1.5 cursor-e-resize',
      se: '-bottom-1.5 -right-1.5 cursor-se-resize',
      s: '-bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize',
      sw: '-bottom-1.5 -left-1.5 cursor-sw-resize',
      w: 'top-1/2 -translate-y-1/2 -left-1.5 cursor-w-resize'
    };
    
    return `${baseClasses} ${size} ${positions[handle]}`;
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'absolute select-none',
        isSelected && 'z-10',
        isDragging && 'cursor-grabbing',
        !isDragging && !isResizing && 'cursor-grab'
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Selection outline */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none -z-10" />
      )}
      
      {/* Element content */}
      <div className="w-full h-full overflow-hidden">
        {children}
      </div>
      
      {/* Resize handles */}
      {isSelected && (
        <>
          {resizeHandles.map((handle) => (
            <div
              key={handle}
              className={getHandleClasses(handle)}
              onMouseDown={(e) => handleResizeMouseDown(e, handle)}
            />
          ))}
        </>
      )}
    </div>
  );
}