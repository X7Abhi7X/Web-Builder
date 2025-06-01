import { CanvasElement } from '@/types/builder';

export const elementTemplates: Record<string, Omit<CanvasElement, 'id'>> = {
  text: {
    type: 'text',
    props: {
      text: 'Your text here',
      style: {
        fontSize: '16px',
        color: '#374151',
        padding: '8px'
      }
    }
  },
  heading: {
    type: 'heading',
    props: {
      text: 'New Heading',
      style: {
        fontSize: '32px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '16px'
      }
    }
  },
  image: {
    type: 'image',
    props: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&w=300&h=200&fit=crop',
      alt: 'Sample Image',
      style: {
        width: '300px',
        height: '200px',
        borderRadius: '8px'
      }
    }
  },
  button: {
    type: 'button',
    props: {
      text: 'Click Me',
      style: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer'
      }
    }
  },
  section: {
    type: 'section',
    props: {
      style: {
        padding: '32px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        minHeight: '200px',
        border: '2px dashed #d1d5db'
      },
      children: []
    }
  },
  container: {
    type: 'container',
    props: {
      style: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px'
      },
      children: []
    }
  },
  video: {
    type: 'video',
    props: {
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      style: {
        width: '100%',
        height: '300px',
        borderRadius: '8px'
      }
    }
  },
  navbar: {
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
  footer: {
    type: 'footer',
    props: {
      style: {
        padding: '32px',
        backgroundColor: '#374151',
        color: '#ffffff',
        textAlign: 'center'
      },
      children: []
    }
  }
};

export const getElementById = (elements: CanvasElement[], id: string): CanvasElement | null => {
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }
    if (element.props.children) {
      const found = getElementById(element.props.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const getAllElements = (elements: CanvasElement[]): CanvasElement[] => {
  const result: CanvasElement[] = [];
  
  const traverse = (elements: CanvasElement[]) => {
    for (const element of elements) {
      result.push(element);
      if (element.props.children) {
        traverse(element.props.children);
      }
    }
  };
  
  traverse(elements);
  return result;
};

export const isDescendant = (elements: CanvasElement[], ancestorId: string, descendantId: string): boolean => {
  const ancestor = getElementById(elements, ancestorId);
  if (!ancestor || !ancestor.props.children) return false;
  
  const descendants = getAllElements(ancestor.props.children);
  return descendants.some(el => el.id === descendantId);
};

export const canDropInside = (elementType: string): boolean => {
  return ['section', 'container', 'navbar', 'footer'].includes(elementType);
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};
