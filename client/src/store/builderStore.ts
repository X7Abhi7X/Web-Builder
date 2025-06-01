import { create } from 'zustand';
import { CanvasElement, BuilderState } from '@/types/builder';
import { Project } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface BuilderStore extends BuilderState {
  // State
  project: Project | null;
  elements: CanvasElement[];
  selectedElementId: string | null;
  draggedElementType: string | null;
  clipboard: CanvasElement | null;
  history: CanvasElement[][];
  historyIndex: number;
  viewport: 'desktop' | 'tablet' | 'mobile';
  zoom: number;

  // Actions
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: CanvasElement, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setDraggedElementType: (type: string | null) => void;
  moveElement: (id: string, newPosition: { x: number; y: number }) => void;
  setViewport: (viewport: 'desktop' | 'tablet' | 'mobile') => void;
  setZoom: (zoom: number) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  clearHistory: () => void;
  setProject: (project: Project | null) => void;
  getProject: () => Project | null;
  updateProjectOnServer: (updates: Partial<Project>) => Promise<void>;
  toggleElementVisibility: (id: string) => void;
}

const generateId = () => `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  // Initial state
  project: null,
  elements: [],
  selectedElementId: null,
  draggedElementType: null,
  clipboard: null,
  history: [[]],
  historyIndex: 0,
  viewport: 'desktop',
  zoom: 100,

  // Project actions
  setProject: (project) => {
    set({ project });
    if (project?.content?.elements) {
      set({ elements: project.content.elements });
      set({ history: [[...project.content.elements]], historyIndex: 0 });
    }
  },

  getProject: () => get().project,

  updateProjectOnServer: async (updates: Partial<Project>) => {
    const project = get().project;
    if (!project) return;
    
    try {
      await apiRequest<Project>('PUT', `/api/projects/${project.id}`, updates);
      console.log('Project updated successfully');
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  },

  // Actions
  setElements: (elements) => {
    set({ elements });
    get().saveToHistory();
  },

  addElement: (element, parentId) => {
    const newElement: CanvasElement = {
      ...element,
      id: element.id || generateId(),
      parentId
    };

    set((state) => {
      let newElements;
      
      if (parentId) {
        // Add as child to parent element
        newElements = state.elements.map(el => {
          if (el.id === parentId) {
            return {
              ...el,
              props: {
                ...el.props,
                children: [...(el.props.children || []), newElement]
              }
            };
          }
          return el;
        });
      } else {
        // Add as top-level element
        newElements = [...state.elements, newElement];
      }

      return { elements: newElements };
    });
    
    get().saveToHistory();
  },

  updateElement: (id, updates) => {
    set((state) => {
      const newElements = state.elements.map(element => {
        if (element.id === id) {
          return {
            ...element,
            style: {
              ...element.style,
              ...(updates.style || {})
            },
            props: {
              ...element.props,
              ...(updates.props || {})
            }
          };
        }
        return element;
      });
      return { elements: newElements };
    });
    get().saveToHistory();

    // Update project on server
    const store = get();
    store.updateProjectOnServer({
      content: {
        elements: store.elements
      }
    }).catch(console.error);
  },

  deleteElement: (id) => {
    set((state) => ({
      elements: deleteElementRecursive(state.elements, id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
    }));
    get().saveToHistory();
  },

  selectElement: (id) => {
    set({ selectedElementId: id });
  },

  setDraggedElementType: (type) => {
    set({ draggedElementType: type });
  },

  moveElement: (id, newPosition) => {
    set((state) => ({
      elements: updateElementRecursive(state.elements, id, { position: newPosition })
    }));
    get().saveToHistory();
  },

  setViewport: (viewport) => {
    set({ viewport });
  },

  setZoom: (zoom) => {
    set({ zoom });
  },

  saveToHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.elements]);
      
      // Limit history to 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          elements: [...state.history[newIndex]],
          historyIndex: newIndex
        };
      }
      return state;
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          elements: [...state.history[newIndex]],
          historyIndex: newIndex
        };
      }
      return state;
    });
  },

  clearHistory: () => {
    set((state) => ({
      history: [state.elements],
      historyIndex: 0
    }));
  },

  toggleElementVisibility: (id) => {
    set((state) => {
      const newElements = state.elements.map(element => {
        if (element.id === id) {
          return {
            ...element,
            visible: element.visible === false ? true : false
          };
        }
        return element;
      });
      return { elements: newElements };
    });
    get().saveToHistory();
  }
}));

// Helper functions
function updateElementRecursive(elements: CanvasElement[], id: string, updates: Partial<CanvasElement>): CanvasElement[] {
  return elements.map(element => {
    if (element.id === id) {
      return { ...element, ...updates };
    }
    
    if (element.props?.children) {
      return {
        ...element,
        props: {
          ...element.props,
          children: updateElementRecursive(element.props.children, id, updates)
        }
      };
    }
    
    return element;
  });
}

function deleteElementRecursive(elements: CanvasElement[], id: string): CanvasElement[] {
  return elements
    .filter(element => element.id !== id)
    .map(element => {
      if (element.props?.children) {
        return {
          ...element,
          props: {
            ...element.props,
            children: deleteElementRecursive(element.props.children, id)
          }
        };
      }
      return element;
    });
}
