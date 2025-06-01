import { MouseEvent, useRef, useEffect, useState } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { DropZone } from '@/components/drag-drop/DropZone';
import { CanvasElement } from './CanvasElement';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export function Canvas() {
  const { elements, selectedElementId, selectElement, viewport, zoom, setZoom } = useBuilderStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleCanvasClick = (e: MouseEvent) => {
    // Only deselect if clicking directly on the canvas
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  const getCanvasSize = () => {
    switch (viewport) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '1200px', height: '1200px' }; // Square canvas
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 300);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 25);
    setZoom(newZoom);
  };

  const handleResetZoom = () => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+click for panning
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [isPanning, dragStart]);

  return (
    <div className="flex-1 bg-gray-800 overflow-hidden relative">
      {/* Canvas zoom controls */}
      <div className="absolute top-4 right-4 z-50 flex flex-col space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomIn}
          className="w-10 h-10 p-0"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomOut}
          className="w-10 h-10 p-0"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleResetZoom}
          className="w-10 h-10 p-0"
          title="Reset Zoom"
        >
          <RotateCcw size={16} />
        </Button>
        <div className="bg-white px-2 py-1 rounded text-xs font-medium">
          {zoom}%
        </div>
      </div>

      {/* Canvas container with panning and zooming */}
      <div 
        ref={canvasRef}
        className="w-full h-full overflow-auto"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          cursor: isPanning ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex justify-center items-start p-8 min-h-full">
          <div
            className="bg-black rounded-lg shadow-2xl relative transition-all duration-300 border border-gray-600"
            style={{
              ...getCanvasSize(),
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
                  backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`
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
    </div>
  );
}
