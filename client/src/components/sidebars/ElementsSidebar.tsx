import { DraggableElement } from '@/components/drag-drop/DraggableElement';
import { 
  Type, 
  Image, 
  MousePointer, 
  Video, 
  Square, 
  Layout, 
  Columns, 
  Navigation, 
  Minus 
} from 'lucide-react';

const elementTypes = [
  {
    category: 'Basic',
    elements: [
      { type: 'text', icon: Type, label: 'Text', description: 'Add text content' },
      { type: 'heading', icon: Type, label: 'Heading', description: 'Add headings' },
      { type: 'image', icon: Image, label: 'Image', description: 'Add images' },
      { type: 'button', icon: MousePointer, label: 'Button', description: 'Add buttons' },
      { type: 'video', icon: Video, label: 'Video', description: 'Add videos' }
    ]
  },
  {
    category: 'Layout',
    elements: [
      { type: 'section', icon: Square, label: 'Section', description: 'Container element' },
      { type: 'container', icon: Layout, label: 'Container', description: 'Centered container' },
      { type: 'columns', icon: Columns, label: 'Columns', description: 'Column layout' }
    ]
  },
  {
    category: 'Navigation',
    elements: [
      { type: 'navbar', icon: Navigation, label: 'Navbar', description: 'Navigation bar' },
      { type: 'footer', icon: Minus, label: 'Footer', description: 'Page footer' }
    ]
  }
];

export function ElementsSidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Elements</h3>
        <p className="text-sm text-gray-500 mt-1">Drag elements to the canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {elementTypes.map((category) => (
          <div key={category.category}>
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              {category.category}
            </h4>
            
            <div className="space-y-2">
              {category.elements.map((element) => (
                <DraggableElement
                  key={element.type}
                  elementType={element.type}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <element.icon size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{element.label}</p>
                      <p className="text-xs text-gray-500 truncate">{element.description}</p>
                    </div>
                  </div>
                </DraggableElement>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
