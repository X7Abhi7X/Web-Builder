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
  
  const Icon = getElementIcon(element.type);
  const hasChildren = element.props.children && element.props.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'flex items-center space-x-2 px-2 py-1 rounded cursor-pointer group hover:bg-gray-50',
          isSelected && 'bg-blue-50 border-l-2 border-blue-500',
          `ml-${level * 4}`
        )}
        onClick={() => onSelect(element.id)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
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
        
        <Icon size={14} className="text-gray-500" />
        
        <span className="flex-1 text-sm text-gray-700 truncate">
          {element.props.text || element.type.charAt(0).toUpperCase() + element.type.slice(1)}
        </span>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(!isVisible);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isVisible ? (
              <Eye size={12} className="text-gray-500" />
            ) : (
              <EyeOff size={12} className="text-gray-500" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLocked(!isLocked);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isLocked ? (
              <Lock size={12} className="text-gray-500" />
            ) : (
              <Unlock size={12} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {element.props.children!.map((child) => (
            <LayerItem
              key={child.id}
              element={child}
              level={level + 1}
              isSelected={false}
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
