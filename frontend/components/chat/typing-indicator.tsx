import { DenormalizedUser } from '@/lib/dto/message';
import React from 'react';

interface TypingIndicatorProps {
    typingUser: string | null;
    currentUser: DenormalizedUser
}

export function TypingIndicator({ typingUser, currentUser }: TypingIndicatorProps) {
    return typingUser && typingUser !== currentUser.username && (
        <div className="ml-12 mt-2 max-w-fit px-4 py-2 bg-muted text-muted-foreground text-sm italic rounded-2xl shadow-md flex items-center gap-3">
            <span><b>{typingUser}</b> is typing</span>
            <span className="flex h-5 items-end gap-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
        </div>
    );
}
