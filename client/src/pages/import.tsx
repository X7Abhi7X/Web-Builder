import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, ArrowLeft } from 'lucide-react';

export default function ImportPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // For now, just show a toast and navigate back
    // TODO: Implement actual file processing
    toast({
      title: "Coming Soon",
      description: "File import functionality will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Projects
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Import Design</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Upload Design File</CardTitle>
              <CardDescription>
                Drag and drop your Figma export or other design files here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop your design file here
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: Figma exports (.fig), Sketch files (.sketch)
                </p>
              </div>

              <div className="mt-6">
                <Button className="w-full" onClick={() => document.getElementById('fileInput')?.click()}>
                  Select File
                </Button>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept=".fig,.sketch"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      // TODO: Implement file processing
                      toast({
                        title: "Coming Soon",
                        description: "File import functionality will be available soon!",
                      });
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 