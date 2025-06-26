import React, { useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';

export function DialogueBox() {
  const { state, advanceDialogue, endDialogue } = useGame();
  const { dialogue } = state;

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'z' || event.key === 'Enter') {
      event.preventDefault();
      advanceDialogue();
    } else if (event.key === 'Escape' || event.key === 'x') {
      event.preventDefault();
      endDialogue();
    }
  }, [advanceDialogue, endDialogue]);

  useEffect(() => {
    if (dialogue) {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [dialogue, handleKeyPress]);

  if (!dialogue) return null;

  const currentMessage = dialogue.messages[dialogue.currentMessageIndex];
  const isLastMessage = dialogue.currentMessageIndex === dialogue.messages.length - 1;

  return (
    <div className="fixed inset-0 flex items-end justify-center p-4 z-50">
      <div className="w-full max-w-md text-box slide-down">
        <div className="p-4">
          {/* Speaker name */}
          <div className="pixel-font text-sm mb-2" style={{ color: 'var(--gb-darkest)' }}>
            {dialogue.speaker}
          </div>
          
          {/* Message text */}
          <div className="pixel-font text-sm mb-4" style={{ color: 'var(--gb-darkest)' }}>
            {currentMessage}
          </div>
          
          {/* Continue indicator */}
          <div className="flex justify-end">
            <div className="pixel-font text-xs" style={{ color: 'var(--gb-dark)' }}>
              {isLastMessage ? 'Press SPACE to close' : 'Press SPACE to continue'}
            </div>
          </div>
          
          {/* Choices (if any) */}
          {dialogue.choices && dialogue.currentMessageIndex === dialogue.messages.length - 1 && (
            <div className="mt-4 space-y-2">
              {dialogue.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={choice.action}
                  className="w-full gb-button pixel-font text-sm p-2 text-left"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}