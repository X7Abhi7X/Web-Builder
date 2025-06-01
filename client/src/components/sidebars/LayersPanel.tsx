import { CanvasElement } from '@/types/builder';
import { useBuilderStore } from '@/store/builderStore';
import { getAllElements } from '@/lib/builderUtils';
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Type,
  Image,
  MousePointer,
  Video,
  Square,
  Layout
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const getElementIcon = (type: string) => {
  switch (type) {
    case 'text':
    case 'heading':
      return Type;
    case 'image':
      return Image;
    case 'button':
      return MousePointer;
    case 'video':
      return Video;
    case 'section':
    case 'container':
    case 'navbar':
    case 'footer':
      return Square;
    default:
      return Layout;
  }
};

interface LayerItemProps {
  element: CanvasElement;
  level: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function LayerItem({ element, level, isSelected, onSelect }: LayerItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const { selectedElementId, deleteElement, updateElement } = useBuilderStore();
  
  const Icon = getElementIcon(element.type);
  const hasChildren = element.props.children && element.props.children.length > 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const handleVisibilityToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
    // In a real implementation, you would update element visibility
    updateElement(element.id, {
      props: {
        ...element.props,
        style: {
          ...element.props.style,
          display: isVisible ? 'none' : (element.props.style?.display || 'block')
        }
      }
    });
  };

  const getElementDisplayName = () => {
    if (element.props.text) {
      return element.props.text.length > 20 
        ? element.props.text.substring(0, 20) + '...'
        : element.props.text;
    }
    return element.type.charAt(0).toUpperCase() + element.type.slice(1);
  };

  return (
    <div>
      <div
        className={cn(
          'flex items-center space-x-2 px-2 py-1.5 rounded cursor-pointer group hover:bg-gray-50 transition-colors',
          isSelected && 'bg-blue-50 border-l-2 border-blue-500',
          !isVisible && 'opacity-50'
        )}
        style={{ marginLeft: `${level * 16}px` }}
        onClick={() => onSelect(element.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={12} className="text-gray-400" />
            ) : (
              <ChevronRight size={12} className="text-gray-400" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}
        
        <div className="w-5 h-5 flex items-center justify-center">
          <Icon size={14} className={cn(
            "text-gray-500",
            element.type === 'text' && "text-blue-600",
            element.type === 'heading' && "text-purple-600",
            element.type === 'image' && "text-green-600",
            element.type === 'button' && "text-orange-600",
            element.type === 'section' && "text-gray-600"
          )} />
        </div>
        
        <span className={cn(
          "flex-1 text-sm truncate transition-colors",
          isSelected ? "text-blue-700 font-medium" : "text-gray-700"
        )}>
          {getElementDisplayName()}
        </span>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleVisibilityToggle}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title={isVisible ? "Hide element" : "Show element"}
          >
            {isVisible ? (
              <Eye size={12} className="text-gray-500" />
            ) : (
              <EyeOff size={12} className="text-red-500" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLocked(!isLocked);
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title={isLocked ? "Unlock element" : "Lock element"}
          >
            {isLocked ? (
              <Lock size={12} className="text-red-500" />
            ) : (
              <Unlock size={12} className="text-gray-500" />
            )}
          </button>
          {level > 0 && (
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-100 rounded transition-colors"
              title="Delete element"
            >
              <Layout size={12} className="text-red-500" />
            </button>
          )}
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="border-l border-gray-200 ml-2">
          {element.props.children!.map((child) => (
            <LayerItem
              key={child.id}
              element={child}
              level={level + 1}
              isSelected={selectedElementId === child.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LayersPanel() {
  const { elements, selectedElementId, selectElement } = useBuilderStore();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-1">
        {elements.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Square size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No elements yet</p>
            <p className="text-xs">Add elements to see them here</p>
          </div>
        ) : (
          elements.map((element) => (
            <LayerItem
              key={element.id}
              element={element}
              level={0}
              isSelected={selectedElementId === element.id}
              onSelect={selectElement}
            />
          ))
        )}
      </div>
    </div>
  );
}
