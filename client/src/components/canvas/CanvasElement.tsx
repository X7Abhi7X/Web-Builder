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
    const baseProps = {
      style: {
        ...style,
        width: '100%',
        height: '100%'
      },
      className: cn(
        'block w-full h-full',
        element.type === 'text' && 'text-white',
        element.type === 'heading' && 'text-white font-bold',
        element.type === 'button' && 'bg-blue-600 text-white rounded px-4 py-2 border-0 cursor-pointer hover:bg-blue-700'
      )
    };

    switch (element.type) {
      case 'text':
        return (
          <div {...baseProps} style={{ ...baseProps.style, padding: '8px', fontSize: '16px' }}>
            {element.props.text || 'Text Element'}
          </div>
        );

      case 'heading':
        return (
          <div {...baseProps} style={{ ...baseProps.style, padding: '8px', fontSize: '24px', fontWeight: 'bold' }}>
            {element.props.text || 'Heading Element'}
          </div>
        );

      case 'image':
        return (
          <img
            {...baseProps}
            src={element.props.src || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&w=300&h=200&fit=crop'}
            alt={element.props.alt || 'Image'}
            style={{ ...baseProps.style, objectFit: 'cover' }}
          />
        );

      case 'button':
        return (
          <button {...baseProps} style={{ ...baseProps.style, fontSize: '16px' }}>
            {element.props.text || 'Button'}
          </button>
        );

      case 'video':
        return (
          <video {...baseProps} controls style={{ ...baseProps.style, objectFit: 'cover' }}>
            <source src={element.props.src || 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case 'section':
      case 'container':
      case 'navbar':
      case 'footer':
        return (
          <div {...baseProps} style={{ ...baseProps.style, backgroundColor: '#374151', border: '2px dashed #6b7280', minHeight: '100px' }}>
            {element.props.children && element.props.children.length > 0 ? (
              element.props.children.map((child) => (
                <CanvasElement
                  key={child.id}
                  element={child}
                  isSelected={false}
                />
              ))
            ) : (
              <div className="text-gray-300 text-center py-8 text-sm">
                Drop elements here
              </div>
            )}
          </div>
        );

      default:
        return (
          <div {...baseProps} className="bg-red-500 text-white p-4 text-center">
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
