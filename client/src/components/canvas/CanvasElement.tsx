import { ReactNode, MouseEvent } from 'react';
import { CanvasElement as CanvasElementType } from '@/types/builder';
import { useBuilderStore } from '@/store/builderStore';
import { DropZone } from '@/components/drag-drop/DropZone';
import { ResizableElement } from './ResizableElement';
import { canDropInside } from '@/lib/builderUtils';
import { cn } from '@/lib/utils';
import { Trash2, Edit3 } from 'lucide-react';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected?: boolean;
}

export function CanvasElement({ element, isSelected }: CanvasElementProps) {
  const { selectElement, deleteElement, updateElement } = useBuilderStore();

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const handleResize = (width: number, height: number) => {
    updateElement(element.id, {
      props: {
        ...element.props,
        style: {
          ...element.props.style,
          width: `${width}px`,
          height: `${height}px`
        }
      }
    });
  };

  const handleMove = (x: number, y: number) => {
    updateElement(element.id, {
      position: { x, y }
    });
  };

  const renderElement = (): ReactNode => {
    const style = element.props.style || {};
    const baseStyle: React.CSSProperties = {
      ...style,
      width: '100%',
      height: '100%',
      backgroundColor: style.backgroundColor || '#ffffff',
      color: style.color || '#000000',
      fontSize: style.fontSize || '16px',
      fontFamily: style.fontFamily || 'Inter',
      fontWeight: style.fontWeight || '400',
      borderRadius: style.borderRadius || '0px',
      border: `${style.borderWidth || '0px'} ${style.borderStyle || 'solid'} ${style.borderColor || '#000000'}`,
      padding: `${style.paddingTop || '8px'} ${style.paddingRight || '8px'} ${style.paddingBottom || '8px'} ${style.paddingLeft || '8px'}`,
      margin: `${style.marginTop || '0px'} ${style.marginRight || '0px'} ${style.marginBottom || '0px'} ${style.marginLeft || '0px'}`,
      textAlign: style.textAlign as any || 'left',
      display: style.display || 'flex',
      alignItems: style.alignItems as any || 'center',
      justifyContent: style.justifyContent as any || 'flex-start'
    };

    switch (element.type) {
      case 'text':
        return (
          <div 
            style={{
              ...baseStyle,
              fontSize: style.fontSize || '16px',
              lineHeight: '1.5',
              overflow: 'hidden'
            }}
            className="w-full h-full"
          >
            {element.props.text || 'Your text here'}
          </div>
        );

      case 'heading':
        return (
          <div 
            style={{
              ...baseStyle,
              fontSize: style.fontSize || '24px',
              fontWeight: style.fontWeight || '600',
              lineHeight: '1.3',
              overflow: 'hidden'
            }}
            className="w-full h-full"
          >
            {element.props.text || 'Heading'}
          </div>
        );

      case 'image':
        return (
          <img
            src={element.props.src || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&w=300&h=200&fit=crop'}
            alt={element.props.alt || 'Image'}
            style={{
              ...baseStyle,
              objectFit: 'cover',
              padding: '0px'
            }}
            className="w-full h-full"
          />
        );

      case 'button':
        return (
          <button 
            style={{
              ...baseStyle,
              backgroundColor: style.backgroundColor || '#2563eb',
              color: style.color || '#ffffff',
              border: style.border || 'none',
              cursor: 'pointer',
              fontSize: style.fontSize || '16px',
              fontWeight: style.fontWeight || '500'
            }}
            className="w-full h-full hover:opacity-90 transition-opacity"
          >
            {element.props.text || 'Button'}
          </button>
        );

      case 'video':
        return (
          <video 
            controls 
            style={{
              ...baseStyle,
              objectFit: 'cover',
              padding: '0px'
            }}
            className="w-full h-full"
          >
            <source src={element.props.src || 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case 'section':
      case 'container':
      case 'navbar':
      case 'footer':
        return (
          <div 
            style={{
              ...baseStyle,
              backgroundColor: style.backgroundColor || '#f9fafb',
              border: style.border || '2px dashed #d1d5db',
              minHeight: '100px',
              position: 'relative'
            }}
            className="w-full h-full"
          >
            {element.props.children && element.props.children.length > 0 ? (
              element.props.children.map((child) => (
                <CanvasElement
                  key={child.id}
                  element={child}
                  isSelected={false}
                />
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm pointer-events-none">
                Drop elements here
              </div>
            )}
          </div>
        );

      default:
        return (
          <div style={baseStyle} className="w-full h-full flex items-center justify-center text-red-600 bg-red-50">
            Unknown element: {element.type}
          </div>
        );
    }
  };

  const elementContent = renderElement();
  const canDrop = canDropInside(element.type);

  // Get current size from style or use defaults
  const currentWidth = element.props.style?.width ? parseInt(element.props.style.width) : 200;
  const currentHeight = element.props.style?.height ? parseInt(element.props.style.height) : 100;
  const currentPosition = element.position || { x: 50, y: 50 };

  const wrappedElement = (
    <ResizableElement
      elementId={element.id}
      isSelected={!!isSelected}
      onResize={handleResize}
      onMove={handleMove}
      initialPosition={currentPosition}
      initialSize={{ width: currentWidth, height: currentHeight }}
    >
      <div onClick={handleClick} className="w-full h-full relative group">
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

  return canDrop ? (
    <DropZone parentId={element.id} className="relative">
      {wrappedElement}
    </DropZone>
  ) : wrappedElement;
}
