import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

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
            // Clear existing content
            shd.innerHTML = '';

            // Create styling safely to prevent CSS breakout attacks
            const styleElement = document.createElement('style');
            styleElement.textContent = `
              /* Basic Reset for the isolation */
              :host { 
                display: block; 
                width: 100%; 
                height: 100%; 
                background: white;
                font-family: system-ui, -apple-system, sans-serif;
                color: #333;
                overflow: hidden; 
                pointer-events: auto;
              }
              /* User CSS */
              ${css}
            `;
            shd.appendChild(styleElement);

            // Create wrapper safely and sanitize HTML input
            const wrapper = document.createElement('div');
            wrapper.style.cssText = "padding: 24px; height: 100%; overflow: auto; position: relative; pointer-events: auto;";
            wrapper.innerHTML = DOMPurify.sanitize(html);
            shd.appendChild(wrapper);
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

