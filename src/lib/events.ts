// Simple event emitter for cross-component communication
type Listener = () => void;

const listeners: Record<string, Listener[]> = {};

export const appEvents = {
  on(event: string, listener: Listener) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(listener);
    return () => {
      listeners[event] = listeners[event].filter(l => l !== listener);
    };
  },
  emit(event: string) {
    listeners[event]?.forEach(l => l());
  },
};

export const PROJECT_CREATED = 'project:created';
export const OPEN_NEW_PROJECT_MODAL = 'modal:new-project';
