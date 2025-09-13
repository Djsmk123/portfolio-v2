"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import TypingGame from "./typing-game";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModal({ isOpen, onClose }: GameModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] border-0 bg-background/95 backdrop-blur-md p-0" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <DialogTitle className="text-xl font-bold">Typing Speed Challenge</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          <TypingGame />
        </div>
      </DialogContent>
    </Dialog>
  );
}
