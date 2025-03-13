
import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { 
  Dialog,
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const KeyboardShortcuts = () => {
  const [open, setOpen] = useState(false);
  
  const shortcuts = [
    { key: '/', description: 'Focus search box' },
    { key: '⌘ + /', description: 'Focus search box (alternative)' },
    { key: '↑ / ↓', description: 'Navigate search suggestions' },
    { key: 'Shift + A', description: 'Toggle search analytics panel' },
    { key: 'Esc', description: 'Close search suggestions' },
    { key: 'Enter', description: 'Submit search or select suggestion' }
  ];
  
  // Listen for keyboard shortcut "?" to open the shortcuts dialog
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 bg-background shadow-md"
        onClick={() => setOpen(true)}
        title="Keyboard shortcuts"
      >
        <Keyboard className="h-4 w-4" />
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              These shortcuts can help you navigate the search interface more quickly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="pt-2">
            <ul className="space-y-2">
              {shortcuts.map((shortcut, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-muted rounded font-mono text-sm">
                    {shortcut.key}
                  </kbd>
                </li>
              ))}
            </ul>
            
            <p className="mt-6 text-sm text-muted-foreground">
              Press <kbd className="px-1 bg-muted rounded font-mono text-xs">?</kbd> at any time to view these shortcuts.
            </p>
          </div>
          
          <DialogClose asChild>
            <Button variant="outline" className="mt-4">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};
