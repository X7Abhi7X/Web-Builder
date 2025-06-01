import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Element } from '@shared/schema';

interface LayersSidebarProps {
  elements: Element[];
  selectedElement?: string;
  onSelectElement: (id: string | undefined) => void;
  onToggleVisibility: (id: string) => void;
  onRemoveElement: (id: string) => void;
}

export default function LayersSidebar({
  elements,
  selectedElement,
  onSelectElement,
  onToggleVisibility,
  onRemoveElement
}: LayersSidebarProps) {
  const getElementDisplayName = (element: Element) => {
    if (element.type === 'text') {
      return element.name || 'Text';
    }
    return element.name || element.type.charAt(0).toUpperCase() + element.type.slice(1);
  };

  return (
    <div className="h-full bg-[#1E1E1E]">
      <div className="h-10 border-b border-[#333333] flex items-center px-4">
        <h2 className="font-medium text-sm text-gray-300">Layers</h2>
      </div>

      <ScrollArea className="h-[calc(100%-2.5rem)]">
        <div className="p-2 space-y-1">
          {elements.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              No elements on canvas
            </div>
          ) : (
            elements.map((element) => (
              <div
                key={element.id}
                className={cn(
                  'group flex items-center gap-2 p-2 rounded cursor-pointer transition-colors',
                  selectedElement === element.id ? 'bg-[#2D2D2D]' : 'hover:bg-[#2D2D2D]'
                )}
                onClick={() => onSelectElement(element.id)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-[#363636] transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(element.id);
                  }}
                >
                  {element.visible === false ? (
                    <EyeOff className="h-3.5 w-3.5 text-gray-400" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-gray-400" />
                  )}
                </Button>

                <div className="flex-1 truncate">
                  <span className="text-xs text-gray-300">
                    {getElementDisplayName(element)}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-[#363636] transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveElement(element.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 