import { ReactNode, MouseEvent } from 'react';
import { CanvasElement as CanvasElementType } from '@/types/builder';
import { useBuilderStore } from '@/store/builderStore';
import { DropZone } from '@/components/drag-drop/DropZone';
import { canDropInside } from '@/lib/builderUtils';
import { cn } from '@/lib/utils';
import { Trash2, Edit3 } from 'lucide-react';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected?: boolean;
}

export function CanvasElement({ element, isSelected }: CanvasElementProps) {
  const { selectElement, deleteElement } = useBuilderStore();

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const renderElement = (): ReactNode => {
    const style = element.props.style || {};
    const baseProps = {
      style,
      className: cn(
        'relative transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2'
      )
    };

    switch (element.type) {
      case 'text':
        return (
          <p {...baseProps}>
            {element.props.text}
          </p>
        );

      case 'heading':
        return (
          <h2 {...baseProps}>
            {element.props.text}
          </h2>
        );

      case 'image':
        return (
          <img
            {...baseProps}
            src={element.props.src}
            alt={element.props.alt || 'Image'}
          />
        );

      case 'button':
        return (
          <button {...baseProps}>
            {element.props.text}
          </button>
        );

      case 'video':
        return (
          <video {...baseProps} controls>
            <source src={element.props.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case 'section':
      case 'container':
      case 'navbar':
      case 'footer':
        return (
          <div {...baseProps}>
            {element.props.children && element.props.children.length > 0 ? (
              element.props.children.map((child) => (
                <CanvasElement
                  key={child.id}
                  element={child}
                  isSelected={false}
                />
              ))
            ) : (
              <div className="text-gray-400 text-center py-8">
                Drop elements here
              </div>
            )}
          </div>
        );

      default:
        return (
          <div {...baseProps}>
            Unknown element type: {element.type}
          </div>
        );
    }
  };

  const elementContent = renderElement();
  const canDrop = canDropInside(element.type);

  const wrappedElement = (
    <div
      onClick={handleClick}
      className={cn(
        'group relative cursor-pointer',
        element.position && 'absolute',
        isSelected && 'z-10'
      )}
      style={element.position ? {
        left: element.position.x,
        top: element.position.y
      } : undefined}
    >
      {/* Selection outline */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none -z-10" />
      )}
      
      {/* Hover outline */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 pointer-events-none transition-colors" />
      
      {/* Element controls */}
      <div className={cn(
        'absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity z-20',
        'flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded text-xs'
      )}>
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

      {elementContent}
    </div>
  );

  return canDrop ? (
    <DropZone parentId={element.id} className="relative">
      {wrappedElement}
    </DropZone>
  ) : wrappedElement;
}
