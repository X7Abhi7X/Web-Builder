import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft,
  Undo2, 
  Redo2, 
  Eye, 
  Save, 
  Globe,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@shared/schema';

interface TopToolbarProps {
  project: Project;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  viewport: 'desktop' | 'tablet' | 'mobile';
  setViewport: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

export default function TopToolbar({
  project,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  viewport,
  setViewport,
  zoom,
  setZoom
}: TopToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(project.name);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProjectMutation = useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      return apiRequest<Project>('PUT', `/api/projects/${project.id}`, updates);
    },
    onSuccess: () => {
      toast({
        title: "Project updated",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${project.id}`] });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNameSave = async () => {
    if (projectName !== project.name) {
      await updateProjectMutation.mutateAsync({ name: projectName });
    }
    setIsEditingName(false);
  };

  const handlePreview = () => {
    // Open preview in new tab
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Preview - ${projectName}</title>
            <style>
              body { margin: 0; padding: 0; }
            </style>
          </head>
          <body>
            <div id="preview"></div>
            <script>
              const content = ${JSON.stringify(project.content)};
              // TODO: Implement preview rendering
              document.getElementById('preview').innerHTML = 
                '<div style="padding: 20px;"><h1>Preview of ' + 
                ${JSON.stringify(projectName)} + 
                '</h1><pre>' + 
                JSON.stringify(content, null, 2) + 
                '</pre></div>';
            </script>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const handlePublish = async () => {
    await updateProjectMutation.mutateAsync({ 
      status: 'published',
      updatedAt: new Date()
    });
  };

  const handleSave = async () => {
    await updateProjectMutation.mutateAsync({ 
      updatedAt: new Date()
    });
  };

  return (
    <div className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ChevronLeft size={16} className="mr-1" />
            Back
          </Button>
        </Link>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center space-x-2">
          {isEditingName ? (
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              className="w-64 h-8"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              {projectName}
            </button>
          )}
          <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Undo/Redo */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo2 size={16} />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Viewport Controls */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewport === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewport('desktop')}
          >
            <Monitor size={16} className="mr-1" />
            Desktop
          </Button>
          <Button
            variant={viewport === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewport('tablet')}
          >
            <Tablet size={16} className="mr-1" />
            Tablet
          </Button>
          <Button
            variant={viewport === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewport('mobile')}
          >
            <Smartphone size={16} className="mr-1" />
            Mobile
          </Button>
        </div>

        {/* Zoom Control */}
        <Select value={zoom.toString()} onValueChange={(value) => setZoom(parseInt(value))}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25%</SelectItem>
            <SelectItem value="50">50%</SelectItem>
            <SelectItem value="75">75%</SelectItem>
            <SelectItem value="100">100%</SelectItem>
            <SelectItem value="125">125%</SelectItem>
            <SelectItem value="150">150%</SelectItem>
            <SelectItem value="200">200%</SelectItem>
            <SelectItem value="300">300%</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Actions */}
        <Button variant="outline" size="sm" onClick={handlePreview}>
          <Eye size={16} className="mr-2" />
          Preview
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSave}
        >
          <Save size={16} className="mr-2" />
          Save
        </Button>

        <Button 
          size="sm" 
          onClick={handlePublish}
        >
          <Globe size={16} className="mr-2" />
          {project.status === 'published' ? 'Published' : 'Publish'}
        </Button>
      </div>
    </div>
  );
}
