import { useState, useRef, useEffect } from 'react';
import { Element } from '@shared/schema';
import { cn } from '@/lib/utils';
import { ResizableElement } from './ResizableElement';
import { CanvasElement } from './CanvasElement';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasProps {
  elements: Element[];
  selectedElement?: string;
  onSelectElement: (id: string | undefined) => void;
  onElementsChange: (elements: Element[]) => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
}

interface ElementProps {
  id: string;
  type: string;
  name: string;
  style: {
    position?: 'absolute';
    left?: string;
    top?: string;
    width?: string;
    height?: string;
    backgroundColor?: string;
    color?: string;
    padding?: string;
    borderRadius?: string;
    border?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    textDecoration?: string;
    cursor?: string;
    clipPath?: string;
    objectFit?: string;
    transform?: string;
    '&:after'?: {
      content?: string;
      position?: string;
      bottom?: string;
      left?: string;
      borderWidth?: string;
      borderStyle?: string;
      borderColor?: string;
    };
    textAlign?: string;
    boxShadow?: string;
    fontFamily?: string;
    letterSpacing?: string;
    margin?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    opacity?: string;
  };
  props?: {
    src?: string;
    alt?: string;
    href?: string;
    text?: string;
  };
  children?: ElementProps[];
}

export default function Canvas({
  elements,
  selectedElement,
  onSelectElement,
  onElementsChange,
  viewport,
  zoom
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [currentZoom, setCurrentZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const transformComponentRef = useRef(null);

  // Get viewport dimensions
  const getViewportDimensions = () => {
    switch (viewport) {
      case 'mobile':
        return { width: 375, height: 667 };
      case 'tablet':
        return { width: 768, height: 1024 };
      default:
        return { width: 1280, height: 800 };
    }
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    setIsDragging(true);
    onSelectElement(elementId);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left - dragOffset.x) / (zoom / 100);
      const y = (e.clientY - canvasRect.top - dragOffset.y) / (zoom / 100);

      const newElements = elements.map(el =>
        el.id === elementId
          ? {
              ...el,
              style: {
                ...el.style,
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`
              }
            }
          : el
      );

      onElementsChange(newElements);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectElement(undefined);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    // Find the closest droppable container
    const target = e.target as HTMLElement;
    const container = target.closest('[data-droppable="true"]');
    setDropTarget(container?.id || null);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data || !canvasRef.current) return;

    try {
      const element = JSON.parse(data);
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      // Calculate position relative to the canvas
      const x = (e.clientX - canvasRect.left) / (zoom / 100);
      const y = (e.clientY - canvasRect.top) / (zoom / 100);

      const newElement = {
        ...element,
        position: { x, y }
      };

      onElementsChange([...elements, newElement]);
      onSelectElement(newElement.id);
    } catch (err) {
      console.error('Failed to parse dropped element:', err);
    }
  };

  const handleElementResize = (elementId: string, width: number, height: number) => {
    const newElements = elements.map(el =>
      el.id === elementId
        ? {
            ...el,
            style: {
              ...el.style,
              width: `${width}px`,
              height: `${height}px`
            }
          }
        : el
    );

    onElementsChange(newElements);
  };

  const handleElementMove = (elementId: string, x: number, y: number) => {
    const newElements = elements.map(el =>
      el.id === elementId
        ? {
            ...el,
            style: {
              ...el.style,
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`
            }
          }
        : el
    );

    onElementsChange(newElements);
  };

  const renderElement = (element: ElementProps) => {
    const isSelected = selectedElement === element.id;
    const isDropTarget = dropTarget === element.id;

    // Get current position and size from style
    const currentPosition = {
      x: element.style?.left ? parseInt(element.style.left) : 0,
      y: element.style?.top ? parseInt(element.style.top) : 0
    };

    const currentSize = {
      width: element.style?.width ? parseInt(element.style.width) : 200,
      height: element.style?.height ? parseInt(element.style.height) : 100
    };

    // Calculate aspect ratio for certain element types
    const getAspectRatio = () => {
      switch (element.type) {
        case 'image':
        case 'video':
          return 16/9; // Default media aspect ratio
        default:
          return undefined;
      }
    };

    // Get min/max constraints based on element type
    const getConstraints = () => {
      switch (element.type) {
        case 'text':
          return {
            minWidth: 50,
            minHeight: 24,
            maxWidth: 800,
            maxHeight: 400
          };
        case 'image':
        case 'video':
          return {
            minWidth: 100,
            minHeight: 56,
            maxWidth: 1200,
            maxHeight: 675
          };
        case 'section':
          return {
            minWidth: 200,
            minHeight: 100,
            maxWidth: 1600,
            maxHeight: 1200
          };
        default:
          return {
            minWidth: 50,
            minHeight: 30,
            maxWidth: 1000,
            maxHeight: 1000
          };
      }
    };

    const elementContent = (
      <div 
        className={cn(
          'relative transition-colors',
          element.type === 'section' && 'min-h-[100px]',
          element.type === 'shape' && 'flex items-center justify-center',
          element.type === 'text' && 'cursor-text',
          element.type === 'interactive' && 'cursor-pointer'
        )}
        style={{
          backgroundColor: isDropTarget 
            ? 'rgba(59, 130, 246, 0.1)' 
            : (element.style?.backgroundColor || '#FFFFFF'),
          width: '100%',
          height: '100%'
        }}
        data-droppable={['section', 'shape'].includes(element.type) ? 'true' : 'false'}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Render different element types */}
        {renderElementContent(element)}
      </div>
    );

    return (
      <ResizableElement
        key={element.id}
        elementId={element.id}
        isSelected={isSelected}
        onResize={(width, height) => handleElementResize(element.id, width, height)}
        onMove={(x, y) => handleElementMove(element.id, x, y)}
        initialPosition={currentPosition}
        initialSize={currentSize}
        aspectRatio={getAspectRatio()}
        {...getConstraints()}
        gridSize={8} // 8px grid for snapping
      >
        {elementContent}
      </ResizableElement>
    );
  };

  const renderElementContent = (element: ElementProps) => {
    switch (element.type) {
      case 'shape':
        return (
          <div 
            className="w-full h-full"
            style={{
              backgroundColor: element.style?.backgroundColor || '#444444',
              clipPath: element.style?.clipPath,
              borderRadius: element.style?.borderRadius || '0',
              transform: element.style?.transform || 'none',
              opacity: element.style?.opacity || '1'
            }}
          />
        );

      case 'text':
      case 'heading1':
      case 'heading2':
      case 'heading3':
      case 'paragraph':
      case 'list':
        return (
          <div 
            contentEditable
            suppressContentEditableWarning
            className="outline-none min-h-[24px] w-full h-full"
            style={{
              color: element.style?.color || '#000000',
              backgroundColor: element.style?.backgroundColor || 'transparent',
              fontSize: element.style?.fontSize || '16px',
              fontFamily: element.style?.fontFamily || 'Inter, sans-serif',
              fontWeight: element.style?.fontWeight || '400',
              lineHeight: element.style?.lineHeight || '1.5',
              letterSpacing: element.style?.letterSpacing || 'normal',
              padding: element.style?.padding || '4px',
              margin: element.style?.margin || '0px',
              borderRadius: element.style?.borderRadius || '4px',
              border: `${element.style?.borderWidth || '0px'} ${element.style?.borderStyle || 'solid'} ${element.style?.borderColor || '#000000'}`,
              textAlign: element.style?.textAlign as any || 'left',
              boxShadow: element.style?.boxShadow || 'none',
              opacity: element.style?.opacity || '1',
              transform: element.style?.transform || 'none',
              width: '100%',
              height: '100%',
              minHeight: '24px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {element.props?.text || 'Enter text here'}
          </div>
        );

      case 'media':
        if (element.props?.src) {
          return (
            <img 
              src={element.props.src}
              alt={element.props.alt || ''}
              style={{
                width: '100%',
                height: '100%',
                objectFit: element.style.objectFit || 'cover',
                borderRadius: element.style?.borderRadius || '0'
              }}
            />
          );
        }
        break;

      case 'interactive':
        return (
          <a 
            href={element.props?.href || '#'}
            style={{
              color: element.style.color || '#3B82F6',
              textDecoration: element.style.textDecoration || 'underline',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              padding: element.style?.padding || '4px',
              borderRadius: element.style?.borderRadius || '4px',
              backgroundColor: element.style?.backgroundColor || 'transparent'
            }}
          >
            {element.props?.text || element.name}
          </a>
        );

      default:
        return (
          <>
            {element.children?.map(child => renderElement(child))}
          </>
        );
    }
  };

  // Handle keyboard shortcuts for zoom
  const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    if (!transformComponentRef.current) return;

    // Ctrl/Cmd + Plus for zoom in
    if ((e.ctrlKey || e.metaKey) && e.key === '=') {
      e.preventDefault();
      transformComponentRef.current.zoomIn(0.2);
    }
    // Ctrl/Cmd + Minus for zoom out
    if ((e.ctrlKey || e.metaKey) && e.key === '-') {
      e.preventDefault();
      transformComponentRef.current.zoomOut(0.2);
    }
    // Ctrl/Cmd + 0 for reset zoom
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
      e.preventDefault();
      transformComponentRef.current.resetTransform();
    }
    // Space for panning
    if (e.code === 'Space') {
      e.preventDefault();
      setIsPanning(true);
      document.body.style.cursor = 'grab';
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      setIsPanning(false);
      document.body.style.cursor = 'default';
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcuts);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const { width, height } = getViewportDimensions();
  const scale = zoom / 100;

  // Calculate canvas dimensions (3x3 grid of viewport size)
  const canvasWidth = width * 3;
  const canvasHeight = height * 3;

  return (
    <div className="flex-1 h-full bg-[#1E1E1E] relative">
      <TransformWrapper
        ref={transformComponentRef}
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        minScale={0.1}
        maxScale={5}
        limitToBounds={false}
        centerOnInit={true}
        wheel={{
          wheelDisabled: true
        }}
        pinch={{
          pinchDisabled: false,
          step: 1,
          smoothStep: 0.002
        }}
        doubleClick={{ disabled: true }}
        panning={{
          disabled: !isPanning,
          velocityDisabled: false,
          lockAxisX: false,
          lockAxisY: false,
          velocityBaseTime: 1000,
          velocityAnimationTime: 800,
          allowLeftClickPan: true,
          allowMiddleClickPan: false,
          allowRightClickPan: false
        }}
        onZoom={({ state }) => {
          setCurrentZoom(state.scale);
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom controls with keyboard shortcuts */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-50 bg-[#2D2D2D] p-2 rounded-lg shadow-lg">
              <div className="text-xs text-gray-400 flex items-center mr-2">
                {Math.round(currentZoom * 100)}%
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="bg-[#363636] hover:bg-[#404040] relative group"
                onClick={() => zoomIn(0.2)}
                title="Zoom In (Ctrl/Cmd + Plus)"
              >
                <ZoomIn className="h-4 w-4" />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Zoom In (Ctrl/Cmd + Plus)
                </span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-[#363636] hover:bg-[#404040] relative group"
                onClick={() => zoomOut(0.2)}
                title="Zoom Out (Ctrl/Cmd + Minus)"
              >
                <ZoomOut className="h-4 w-4" />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Zoom Out (Ctrl/Cmd + Minus)
                </span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-[#363636] hover:bg-[#404040] relative group"
                onClick={() => resetTransform()}
                title="Reset Zoom (Ctrl/Cmd + 0)"
              >
                <Maximize className="h-4 w-4" />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Reset Zoom (Ctrl/Cmd + 0)
                </span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  "bg-[#363636] hover:bg-[#404040] relative group",
                  isPanning && "bg-blue-600 hover:bg-blue-700"
                )}
                onClick={() => setIsPanning(!isPanning)}
                title="Pan Tool (Space)"
              >
                <Move className="h-4 w-4" />
                <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Pan Tool (Space)
                </span>
              </Button>
            </div>

            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '100%'
              }}
              contentStyle={{
                width: '100%',
                height: '100%'
              }}
            >
              <div 
                className="w-full h-full flex items-center justify-center bg-[#1E1E1E] relative"
                style={{
                  minHeight: '100vh'
                }}
              >
                <div
                  ref={canvasRef}
                  className="bg-[#2D2D2D] rounded-lg shadow-xl border border-[#444444] overflow-visible"
                  style={{
                    width: canvasWidth,
                    height: canvasHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: -(canvasWidth / 2),
                    marginTop: -(canvasHeight / 2)
                  }}
                  onClick={handleCanvasClick}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  {/* Center indicator */}
                  <div className="absolute left-1/2 top-1/2 w-4 h-4 border-2 border-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20" />
                  
                  {/* Elements */}
                  <div className="absolute inset-0">
                    {elements.map(element => (
                      <CanvasElement
                        key={element.id}
                        element={element}
                        isSelected={selectedElement === element.id}
                      />
                    ))}
                  </div>
                </div>

                {/* Canvas size indicator */}
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#2D2D2D] px-3 py-1.5 rounded text-sm text-gray-400 z-10">
                  {Math.round(canvasWidth * currentZoom)}px × {Math.round(canvasHeight * currentZoom)}px
                </div>

                {/* Grid overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(51, 51, 51, 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(51, 51, 51, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: `${20 * currentZoom}px ${20 * currentZoom}px`
                  }}
                />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
