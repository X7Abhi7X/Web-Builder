import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all projects for demo user (user id = 1)
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByUserId(1);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get specific project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: 1 // Demo user
      });
      
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Update project
  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      // Validate content structure if it's being updated
      if (updates.content) {
        if (!updates.content.elements || !Array.isArray(updates.content.elements)) {
          return res.status(400).json({ message: "Invalid content structure" });
        }
      }
      
      const project = await storage.updateProject(id, updates);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Get available templates
  app.get("/api/templates", async (req, res) => {
    try {
      // Template data with actual content
      const templates = [
        {
          id: 1,
          name: 'Portfolio',
          description: 'Creative portfolio showcase',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzNiODJmNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBvcnRmb2xpbzwvdGV4dD48L3N2Zz4=',
          content: {
            elements: [
              {
                type: 'navbar',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 32px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e5e7eb'
                  },
                  children: []
                }
              },
              {
                type: 'hero',
                props: {
                  title: 'Welcome to My Portfolio',
                  subtitle: 'Showcasing my creative work and projects',
                  style: {
                    textAlign: 'center',
                    padding: '64px 32px'
                  }
                }
              }
            ]
          }
        },
        {
          id: 2,
          name: 'Business',
          description: 'Professional business website',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmZGY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzIyYzU1ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJ1c2luZXNzPC90ZXh0Pjwvc3ZnPg==',
          content: {
            elements: [
              {
                type: 'navbar',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 32px',
                    backgroundColor: '#1a365d',
                    color: '#ffffff'
                  },
                  children: []
                }
              },
              {
                type: 'hero',
                props: {
                  title: 'Your Business Solutions',
                  subtitle: 'Empowering businesses with innovative solutions',
                  style: {
                    textAlign: 'center',
                    padding: '64px 32px',
                    backgroundColor: '#f8fafc'
                  }
                }
              }
            ]
          }
        },
        {
          id: 3,
          name: 'E-commerce',
          description: 'Modern online store',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmRmMGZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2M0MjZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkUtY29tbWVyY2U8L3RleHQ+PC9zdmc+',
          content: {
            elements: [
              {
                type: 'navbar',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 32px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e5e7eb'
                  },
                  children: []
                }
              },
              {
                type: 'hero',
                props: {
                  title: 'Welcome to Our Store',
                  subtitle: 'Discover amazing products at great prices',
                  style: {
                    textAlign: 'center',
                    padding: '64px 32px',
                    backgroundColor: '#f7f7f7'
                  }
                }
              }
            ]
          }
        }
      ];
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
