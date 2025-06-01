import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import TopToolbar from '@/components/toolbars/TopToolbar';
import LayersSidebar from '@/components/sidebars/LayersSidebar';
import ElementsSidebar from '@/components/sidebars/ElementsSidebar';
import PropertiesSidebar from '@/components/sidebars/PropertiesSidebar';
import Canvas from '@/components/canvas/Canvas';
import { Project, Element } from '@shared/schema';
import { useBuilderStore } from '@/store/builderStore';
import { apiRequest } from '@/lib/queryClient';

export default function Builder() {
  const [, params] = useRoute('/builder/:id');
  const projectId = params?.id;
  const queryClient = useQueryClient();

  // Get store actions
  const {
    elements,
    setElements,
    selectedElementId,
    selectElement,
    deleteElement,
    toggleElementVisibility,
    setProject,
    getProject,
    viewport,
    setViewport,
    zoom,
    setZoom,
    undo,
    redo,
    historyIndex,
    history
  } = useBuilderStore();

  // Fetch project data
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
    onSuccess: (data) => {
      setProject(data);
    },
    onError: () => {
      setProject(null);
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setProject(null);
    };
  }, []);

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      return apiRequest<Project>('PUT', `/api/projects/${projectId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
    }
  });

  // Handle elements change
  const handleElementsChange = (newElements: Element[]) => {
    setElements(newElements);
    
    // Save changes to server
    const currentProject = getProject();
    if (currentProject) {
      updateProjectMutation.mutate({
        content: {
          elements: newElements
        }
      });
    }
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-gray-400">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col">
      <TopToolbar
        project={project}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={undo}
        onRedo={redo}
        viewport={viewport}
        setViewport={setViewport}
        zoom={zoom}
        setZoom={setZoom}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar with Elements and Layers */}
        <div className="w-64 bg-[#1E1E1E] border-r border-[#333333] flex flex-col">
          <div className="flex-1">
            <ElementsSidebar />
          </div>
          <div className="h-[40%] border-t border-[#333333]">
            <LayersSidebar
              elements={elements}
              selectedElement={selectedElementId}
              onSelectElement={selectElement}
              onToggleVisibility={toggleElementVisibility}
              onRemoveElement={deleteElement}
            />
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <Canvas
            elements={elements}
            selectedElement={selectedElementId}
            onSelectElement={selectElement}
            onElementsChange={handleElementsChange}
            viewport={viewport}
            zoom={zoom}
          />
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 bg-[#1E1E1E] border-l border-[#333333]">
          <PropertiesSidebar
            selectedElement={elements.find(el => el.id === selectedElementId)}
          />
        </div>
      </div>
    </div>
  );
}
