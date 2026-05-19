'use client';

import React, { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    let quillInstance = null;

    if (typeof window !== 'undefined' && containerRef.current) {
      // Clear the container to prevent double toolbars in Strict Mode
      containerRef.current.innerHTML = '';
      const editorDiv = document.createElement('div');
      containerRef.current.appendChild(editorDiv);

      import('quill').then((QuillModule) => {
        const Quill = QuillModule.default;
        
        quillInstance = new Quill(editorDiv, {
          theme: 'snow',
          placeholder: placeholder || 'Enter description...',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, 4, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image'],
              ['clean'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
            ],
          },
        });

        quillRef.current = quillInstance;

        // Set initial value
        if (value) {
          quillInstance.root.innerHTML = value;
        }

        // Handle changes
        quillInstance.on('text-change', () => {
          const content = quillInstance.root.innerHTML;
          if (onChange) {
            // Prevent empty paragraph noise
            const cleanContent = content === '<p><br></p>' ? '' : content;
            onChange(cleanContent);
          }
        });
      });
    }

    return () => {
      // Cleanup: Remove references
      quillRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Only run once on mount

  // Update editor if value changes from outside (e.g. initial load in Edit page)
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      const currentContent = quillRef.current.root.innerHTML;
      // Only update if values are truly different
      if (value !== currentContent && !(value === '' && currentContent === '<p><br></p>')) {
        quillRef.current.root.innerHTML = value || '';
      }
    }
  }, [value]);

  return (
    <div className="rich-text-editor-wrapper">
      <div ref={containerRef} style={{ minHeight: '250px' }} />
      <style jsx>{`
        .rich-text-editor-wrapper {
          background: #fff;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #d1d5db;
        }
        :global(.ql-toolbar) {
          background: #f9fafb !important;
          border: none !important;
          border-bottom: 1px solid #d1d5db !important;
        }
        :global(.ql-container) {
          border: none !important;
          font-family: inherit;
        }
        :global(.ql-editor) {
          font-size: 14px;
          min-height: 200px;
          padding: 15px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
