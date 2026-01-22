import React, { useEffect, useRef } from 'react';

interface ShadowPreviewProps {
    html: string;
    css: string;
}

export const ShadowPreview: React.FC<ShadowPreviewProps> = ({ html, css }) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const shadowRootRef = useRef<ShadowRoot | null>(null);

    useEffect(() => {
        if (hostRef.current && !shadowRootRef.current) {
            try {
                shadowRootRef.current = hostRef.current.attachShadow({ mode: 'open' });
            } catch (e) {
                console.error("Failed to attach shadow root", e);
            }
        }
    }, []);

    useEffect(() => {
        const shd = shadowRootRef.current;
        if (shd) {
            // Basic reset to make it well-behaved
            shd.innerHTML = `
        <style>
          /* Basic Reset for the isolation */
          :host { 
            display: block; 
            width: 100%; 
            height: 100%; 
            background: white;
            font-family: system-ui, -apple-system, sans-serif;
            color: #333;
            overflow: hidden; /* Host shouldn't scroll, inner div should */
          }
          *, *::before, *::after {
            box-sizing: border-box;
          }
          
          /* User CSS */
          ${css}
        </style>
        
        <div style="padding: 24px; height: 100%; overflow: auto; position: relative;">
            ${html}
        </div>
      `;
        }
    }, [html, css]);

    return (
        <div
            ref={hostRef}
            className="w-full h-full bg-white block"
            data-testid="shadow-host"
        />
    );
};

