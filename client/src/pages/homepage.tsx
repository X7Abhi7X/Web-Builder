import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Project, InsertProject } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { formatTimeAgo } from '@/lib/builderUtils';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  MoreHorizontal, 
  ExternalLink,
  Rocket,
  Palette,
  Upload,
  Edit,
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState<Array<{ 
    id: number;
    name: string; 
    description: string;
    thumbnail?: string;
    content?: { elements: any[] };
  }>>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const fetchTemplates = async () => {
    try {
      console.log('Fetching templates...');
      const response = await fetch('/api/templates');
      console.log('Template response status:', response.status);
      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to fetch templates",
          variant: "destructive",
        });
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      console.log('Fetched templates:', data);
      setTemplates(data);
      return data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  };

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: InsertProject): Promise<Project> => {
      return apiRequest('POST', '/api/projects', projectData);
    },
    onSuccess: () => {
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: () => {
      toast({
        title: "Creation failed",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTemplateSelect = async (template: { 
    id: number;
    name: string; 
    description: string;
    thumbnail?: string;
    content?: { elements: any[] };
  }) => {
    setIsTemplateModalOpen(false);
    const projectData: InsertProject = {
      name: template.name,
      description: template.description,
      content: template.content || { elements: [] },
      status: 'draft',
      userId: 1
    };
    
    const project = await createProjectMutation.mutateAsync(projectData);
    if (project?.id) {
      navigate(`/builder/${project.id}`);
    }
  };

  const handleCreateProject = async (type: 'blank' | 'template' | 'import') => {
    if (type === 'template') {
      const fetchedTemplates = await fetchTemplates();
      setTemplates(fetchedTemplates);
      setIsTemplateModalOpen(true);
      return;
    }

    if (type === 'import') {
      navigate('/import');
      return;
    }

    // For blank projects
    const projectData: InsertProject = {
      name: 'New Project',
      description: 'A blank canvas for your creativity',
      content: { elements: [] },
      status: 'draft',
      userId: 1
    };
    
    const project = await createProjectMutation.mutateAsync(projectData);
    if (project?.id) {
      navigate(`/builder/${project.id}`);
    }
  };

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      return apiRequest('DELETE', `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: () => {
      toast({
        title: "Deletion failed",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredProjects = (projects as Project[] || []).filter((project: Project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date | null) => date ? formatTimeAgo(new Date(date)) : 'Unknown';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">Websites.co.in</h1>
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-video" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Websites.co.in</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button onClick={() => handleCreateProject('blank')}>
                <Plus size={16} className="mr-2" />
                New Project
              </Button>
              
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
            <p className="text-gray-600 mt-1">Manage and create stunning websites with ease</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <div className="flex border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="hover:border-blue-500 cursor-pointer transition-colors"
            onClick={() => handleCreateProject('blank')}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Plus size={24} className="text-blue-600" />
              </div>
              <CardTitle>Start from Scratch</CardTitle>
              <CardDescription>Create a new project from a blank canvas</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="hover:border-purple-500 cursor-pointer transition-colors"
            onClick={() => handleCreateProject('template')}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Palette size={24} className="text-purple-600" />
              </div>
              <CardTitle>Start from Template</CardTitle>
              <CardDescription>Choose from our pre-built templates</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="hover:border-green-500 cursor-pointer transition-colors"
            onClick={() => handleCreateProject('import')}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Upload size={24} className="text-green-600" />
              </div>
              <CardTitle>Import Design</CardTitle>
              <CardDescription>Import from Figma or other design files</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Template Selection Modal */}
        <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Choose a Template</DialogTitle>
              <DialogDescription>
                Select a template to start your project with a pre-built design
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    {template.thumbnail ? (
                      <img 
                        src={template.thumbnail} 
                        alt={template.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Projects Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredProjects.map((project: Project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow group">
              {viewMode === 'grid' ? (
                <>
                  <div 
                    className="aspect-video bg-gray-100 relative overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/builder/${project.id}`)}
                  >
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <div className="w-6 h-6 bg-white rounded-sm" />
                          </div>
                          <p className="text-sm text-gray-600">Website</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary">
                        <ExternalLink size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                    
                    {project.description && (
                      <CardDescription className="mb-3">
                        {project.description}
                      </CardDescription>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(project.updatedAt)}
                      </span>
                      <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <CardTitle 
                          className="text-base truncate cursor-pointer"
                          onClick={() => navigate(`/builder/${project.id}`)}
                        >
                          {project.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={project.status === 'published' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      {project.description && (
                        <CardDescription className="truncate">
                          {project.description}
                        </CardDescription>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDate(project.updatedAt)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Link href={`/builder/${project.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteProjectMutation.mutate(project.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Create your first project to get started'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => handleCreateProject('blank')}>
                <Plus size={16} className="mr-2" />
                Create Project
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
