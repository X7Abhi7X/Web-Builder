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
  aspectRatio?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  gridSize?: number;
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export function ResizableElement({
  children,
  elementId,
  isSelected,
  onResize,
  onMove,
  initialPosition = { x: 0, y: 0 },
  initialSize = { width: 200, height: 100 },
  aspectRatio,
  minWidth = 50,
  minHeight = 30,
  maxWidth = 2000,
  maxHeight = 2000,
  gridSize = 1
}: ResizableElementProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  // Update position when initialPosition changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]);

  // Update size when initialSize changes
  useEffect(() => {
    setSize(initialSize);
  }, [initialSize.width, initialSize.height]);

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (e.button !== 0 || !isSelected) return;
    e.stopPropagation();

    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    document.body.style.cursor = 'grabbing';
  };

  const handleResizeMouseDown = (e: ReactMouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    document.body.style.cursor = getHandleCursor(handle);
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;

      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Snap to grid if needed
        const snappedX = Math.round(newX / gridSize) * gridSize;
        const snappedY = Math.round(newY / gridSize) * gridSize;

        setPosition({ x: snappedX, y: snappedY });
        onMove(snappedX, snappedY);
      } else if (isResizing && resizeHandle) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        const constrainSize = (w: number, h: number) => {
          w = Math.max(minWidth, Math.min(maxWidth, Math.round(w / gridSize) * gridSize));
          h = Math.max(minHeight, Math.min(maxHeight, Math.round(h / gridSize) * gridSize));

          if (aspectRatio) {
            if (w / h > aspectRatio) {
              w = h * aspectRatio;
            } else {
              h = w / aspectRatio;
            }
          }

          return { width: w, height: h };
        };

        switch (resizeHandle) {
          case 'se':
            ({ width: newWidth, height: newHeight } = constrainSize(
              size.width + deltaX,
              size.height + deltaY
            ));
            break;
          case 'sw':
            ({ width: newWidth, height: newHeight } = constrainSize(
              size.width - deltaX,
              size.height + deltaY
            ));
            newX = position.x + (size.width - newWidth);
            break;
          case 'ne':
            ({ width: newWidth, height: newHeight } = constrainSize(
              size.width + deltaX,
              size.height - deltaY
            ));
            newY = position.y + (size.height - newHeight);
            break;
          case 'nw':
            ({ width: newWidth, height: newHeight } = constrainSize(
              size.width - deltaX,
              size.height - deltaY
            ));
            newX = position.x + (size.width - newWidth);
            newY = position.y + (size.height - newHeight);
            break;
          case 'n':
            ({ width: newWidth, height: newHeight } = constrainSize(
              size.width,
              size.height - deltaY
            ));
            newY = position.y + (size.height - newHeight);
            break;
          case 's':
            ({ width: newWidth, height: newHeight } = constrainSize(
              size.width,
              size.height + deltaY
            ));
            break;
          case 'e':
            ({ width: newWidth, height: newHeight } = constrainSize(
              size.width + deltaX,
              size.height
            ));
            break;
          case 'w':
            ({ width: newWidth, height: newHeight } = constrainSize(
              size.width - deltaX,
              size.height
            ));
            newX = position.x + (size.width - newWidth);
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
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, position, size, resizeHandle, onMove, onResize, gridSize]);

  const resizeHandles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  
  const getHandleCursor = (handle: ResizeHandle): string => {
    const cursors: Record<ResizeHandle, string> = {
      nw: 'nw-resize',
      n: 'n-resize',
      ne: 'ne-resize',
      e: 'e-resize',
      se: 'se-resize',
      s: 's-resize',
      sw: 'sw-resize',
      w: 'w-resize'
    };
    return cursors[handle];
  };
  
  const getHandleClasses = (handle: ResizeHandle) => {
    const baseClasses = 'absolute bg-white border-2 border-blue-500 rounded-sm';
    const size = 'w-3 h-3';
    
    const positions = {
      nw: '-top-1.5 -left-1.5',
      n: '-top-1.5 left-1/2 -translate-x-1/2',
      ne: '-top-1.5 -right-1.5',
      e: 'top-1/2 -translate-y-1/2 -right-1.5',
      se: '-bottom-1.5 -right-1.5',
      s: '-bottom-1.5 left-1/2 -translate-x-1/2',
      sw: '-bottom-1.5 -left-1.5',
      w: 'top-1/2 -translate-y-1/2 -left-1.5'
    };
    
    return cn(
      baseClasses,
      size,
      positions[handle],
      `cursor-${getHandleCursor(handle)}`
    );
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'absolute select-none',
        isSelected && 'z-10',
        isDragging && 'cursor-grabbing',
        !isDragging && !isResizing && isSelected && 'cursor-grab'
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: size.height,
        transition: isDragging || isResizing ? 'none' : 'all 0.1s ease'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Selection outline with measurements */}
      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
            {Math.round(size.width)} × {Math.round(size.height)}
          </div>
          <div className="absolute -top-6 right-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
            {Math.round(position.x)}, {Math.round(position.y)}
          </div>
        </>
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