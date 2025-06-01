import { useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useBuilderStore } from '@/store/builderStore';
import { TopToolbar } from '@/components/toolbars/TopToolbar';
import { ElementsSidebar } from '@/components/sidebars/ElementsSidebar';
import { PropertiesSidebar } from '@/components/sidebars/PropertiesSidebar';
import { Canvas } from '@/components/canvas/Canvas';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Builder() {
  const { id } = useParams<{ id: string }>();
  const { setElements, selectElement } = useBuilderStore();

  const { data: project, isLoading, error } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  useEffect(() => {
    if (project?.content?.elements) {
      setElements(project.content.elements);
      selectElement(null);
    }
  }, [project, setElements, selectElement]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="flex-1 flex">
          <div className="w-64 bg-white border-r border-gray-200 p-4">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
          <div className="flex-1 bg-gray-100 p-8">
            <Skeleton className="w-full max-w-4xl mx-auto h-96" />
          </div>
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ? 'Failed to load project. Please try again.' : 'Project not found.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TopToolbar
        projectId={project.id.toString()}
        projectName={project.name}
        projectStatus={project.status}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <ElementsSidebar />
        <Canvas />
        <PropertiesSidebar />
      </div>
    </div>
  );
}
