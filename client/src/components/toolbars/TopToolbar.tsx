import { Link } from 'wouter';
import { useBuilderStore } from '@/store/builderStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Undo2, 
  Redo2, 
  Eye, 
  Save, 
  Rocket,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface TopToolbarProps {
  projectId?: string;
  projectName?: string;
  projectStatus?: string;
}

export function TopToolbar({ projectId, projectName = 'Untitled Project', projectStatus = 'draft' }: TopToolbarProps) {
  const { 
    elements, 
    viewport, 
    setViewport, 
    zoom, 
    setZoom, 
    undo, 
    redo, 
    history, 
    historyIndex 
  } = useBuilderStore();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveProjectMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error('No project ID');
      return apiRequest('PUT', `/api/projects/${projectId}`, {
        content: { elements },
        updatedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast({
        title: "Project saved",
        description: "Your changes have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const publishProjectMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error('No project ID');
      return apiRequest('PUT', `/api/projects/${projectId}`, {
        status: 'published',
        content: { elements },
        updatedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast({
        title: "Project published",
        description: "Your website is now live!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: () => {
      toast({
        title: "Publish failed",
        description: "Failed to publish project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (projectId) {
      saveProjectMutation.mutate();
    }
  };

  const handlePublish = () => {
    if (projectId) {
      publishProjectMutation.mutate();
    }
  };

  const handlePreview = () => {
    // In a real app, this would open a preview window
    toast({
      title: "Preview mode",
      description: "Preview functionality would open here.",
    });
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center space-x-2">
          <h1 className="font-semibold text-gray-900">{projectName}</h1>
          <Badge variant={projectStatus === 'published' ? 'default' : 'secondary'}>
            {projectStatus}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Undo/Redo */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
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
          disabled={saveProjectMutation.isPending}
        >
          <Save size={16} className="mr-2" />
          {saveProjectMutation.isPending ? 'Saving...' : 'Save'}
        </Button>
        
        <Button 
          size="sm" 
          onClick={handlePublish}
          disabled={publishProjectMutation.isPending}
        >
          <Rocket size={16} className="mr-2" />
          {publishProjectMutation.isPending ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </header>
  );
}
