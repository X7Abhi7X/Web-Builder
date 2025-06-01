import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Type, 
  Square,
  Circle,
  Triangle,
  Image,
  LayoutGrid,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  Link as LinkIcon,
  Star,
  Heart,
  MessageCircle
} from 'lucide-react';

const elements = [
  // Containers
  {
    id: 'section',
    name: 'Section',
    type: 'section',
    icon: LayoutGrid,
    category: 'container',
    style: {
      width: '368px',
      height: '444px',
      backgroundColor: '#D9D9D9',
      padding: '20px',
      borderRadius: '8px',
      border: '2px solid #666666'
    }
  },
  // Basic Shapes
  {
    id: 'rectangle',
    name: 'Rectangle',
    type: 'shape',
    icon: Square,
    category: 'shape',
    style: {
      width: '200px',
      height: '150px',
      backgroundColor: '#444444',
      borderRadius: '4px'
    }
  },
  {
    id: 'circle',
    name: 'Circle',
    type: 'shape',
    icon: Circle,
    category: 'shape',
    style: {
      width: '150px',
      height: '150px',
      backgroundColor: '#444444',
      borderRadius: '50%'
    }
  },
  {
    id: 'triangle',
    name: 'Triangle',
    type: 'shape',
    icon: Triangle,
    category: 'shape',
    style: {
      width: '150px',
      height: '150px',
      backgroundColor: '#444444',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
    }
  },
  // Text Elements
  {
    id: 'heading1',
    name: 'Heading 1',
    type: 'heading1',
    icon: Heading1,
    category: 'text',
    props: {
      text: 'Heading 1'
    },
    style: {
      fontSize: '2.5rem',
      fontFamily: 'Inter',
      fontWeight: 'bold',
      color: '#000000',
      backgroundColor: '#FFFFFF',
      padding: '10px',
      margin: '0px',
      borderRadius: '4px',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: '#000000',
      letterSpacing: 'normal',
      lineHeight: '1.3',
      textAlign: 'left',
      boxShadow: 'none',
      opacity: '1'
    }
  },
  {
    id: 'heading2',
    name: 'Heading 2',
    type: 'heading2',
    icon: Heading2,
    category: 'text',
    props: {
      text: 'Heading 2'
    },
    style: {
      fontSize: '2rem',
      fontFamily: 'Inter',
      fontWeight: 'bold',
      color: '#000000',
      backgroundColor: '#FFFFFF',
      padding: '8px',
      margin: '0px',
      borderRadius: '4px',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: '#000000',
      letterSpacing: 'normal',
      lineHeight: '1.3',
      textAlign: 'left',
      boxShadow: 'none',
      opacity: '1'
    }
  },
  {
    id: 'heading3',
    name: 'Heading 3',
    type: 'heading3',
    icon: Heading3,
    category: 'text',
    props: {
      text: 'Heading 3'
    },
    style: {
      fontSize: '1.5rem',
      fontFamily: 'Inter',
      fontWeight: 'bold',
      color: '#000000',
      backgroundColor: '#FFFFFF',
      padding: '6px',
      margin: '0px',
      borderRadius: '4px',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: '#000000',
      letterSpacing: 'normal',
      lineHeight: '1.3',
      textAlign: 'left',
      boxShadow: 'none',
      opacity: '1'
    }
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    type: 'paragraph',
    icon: Type,
    category: 'text',
    props: {
      text: 'Enter your text here'
    },
    style: {
      fontSize: '1rem',
      fontFamily: 'Inter',
      fontWeight: '400',
      color: '#000000',
      backgroundColor: '#FFFFFF',
      padding: '4px',
      margin: '0px',
      borderRadius: '4px',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: '#000000',
      letterSpacing: 'normal',
      lineHeight: '1.5',
      textAlign: 'left',
      boxShadow: 'none',
      opacity: '1'
    }
  },
  {
    id: 'list',
    name: 'List',
    type: 'list',
    icon: ListOrdered,
    category: 'text',
    props: {
      text: '• List item 1\n• List item 2\n• List item 3'
    },
    style: {
      fontSize: '1rem',
      fontFamily: 'Inter',
      fontWeight: '400',
      color: '#000000',
      backgroundColor: '#FFFFFF',
      padding: '4px',
      margin: '0px',
      borderRadius: '4px',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: '#000000',
      letterSpacing: 'normal',
      lineHeight: '1.5',
      textAlign: 'left',
      boxShadow: 'none',
      opacity: '1'
    }
  },
  // Media Elements
  {
    id: 'image',
    name: 'Image',
    type: 'media',
    icon: Image,
    category: 'media',
    style: {
      width: '300px',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '4px'
    },
    props: {
      src: 'https://source.unsplash.com/random/300x200',
      alt: 'Random image'
    }
  },
  // Interactive Elements
  {
    id: 'link',
    name: 'Link',
    type: 'interactive',
    icon: LinkIcon,
    category: 'interactive',
    style: {
      color: '#3B82F6',
      textDecoration: 'underline',
      cursor: 'pointer',
      padding: '4px'
    }
  },
  // Decorative Elements
  {
    id: 'star',
    name: 'Star',
    type: 'shape',
    icon: Star,
    category: 'shape',
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: '#444444',
      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    }
  },
  {
    id: 'heart',
    name: 'Heart',
    type: 'shape',
    icon: Heart,
    category: 'shape',
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: '#444444',
      clipPath: 'path("M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 6-5.191 2.389 0 4.928 1.559 5 4.618 0.072-3.059 2.611-4.618 5-4.618 2.932 0 6 1.4 6 5.191 0 4.105-5.37 8.863-11 14.402")'
    }
  },
  {
    id: 'comment',
    name: 'Comment',
    type: 'shape',
    icon: MessageCircle,
    category: 'shape',
    style: {
      width: '120px',
      height: '100px',
      backgroundColor: '#444444',
      borderRadius: '20px',
      position: 'relative',
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: '-20px',
        left: '20px',
        borderWidth: '20px',
        borderStyle: 'solid',
        borderColor: '#444444 transparent transparent transparent'
      }
    }
  }
];

interface ElementsSidebarProps {
  onAddElement: (element: any) => void;
}

export default function ElementsSidebar({ onAddElement }: ElementsSidebarProps) {
  const handleDragStart = (e: React.DragEvent, element: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      ...element,
      id: `${element.id}-${Date.now()}`,
      style: {
        position: 'absolute',
        left: '0px',
        top: '0px',
        ...element.style,
        backgroundColor: element.style?.backgroundColor || '#FFFFFF',
        color: element.style?.color || '#000000',
        fontSize: element.style?.fontSize || '16px',
        fontFamily: element.style?.fontFamily || 'Inter',
        fontWeight: element.style?.fontWeight || '400',
        lineHeight: element.style?.lineHeight || '1.5',
        letterSpacing: element.style?.letterSpacing || 'normal',
        padding: element.style?.padding || '4px',
        margin: element.style?.margin || '0px',
        borderRadius: element.style?.borderRadius || '4px',
        borderWidth: element.style?.borderWidth || '0px',
        borderStyle: element.style?.borderStyle || 'solid',
        borderColor: element.style?.borderColor || '#000000',
        textAlign: element.style?.textAlign || 'left',
        boxShadow: element.style?.boxShadow || 'none',
        opacity: element.style?.opacity || '1'
      }
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Group elements by category
  const groupedElements = elements.reduce((acc, element) => {
    const category = element.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(element);
    return acc;
  }, {} as Record<string, typeof elements>);

  return (
    <div className="h-full bg-[#1E1E1E]">
      <div className="h-10 border-b border-[#333333] flex items-center px-4">
        <h2 className="font-medium text-sm text-gray-300">Elements</h2>
      </div>

      <ScrollArea className="h-[calc(100%-2.5rem)]">
        <div className="p-4 space-y-6">
          {Object.entries(groupedElements).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase px-1">
                {category}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {items.map((element) => {
                  const Icon = element.icon;
                  return (
                    <div
                      key={element.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, element)}
                      className="group cursor-grab active:cursor-grabbing"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-16 flex flex-col items-center justify-center gap-1.5 bg-[#2D2D2D] border-[#333333] hover:bg-[#363636] hover:border-[#444444] transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                          {element.name}
                        </span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
