'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Renders page 1 of a PDF as a <canvas> thumbnail.
 * Uses PDF.js loaded from CDN — no npm install required.
 */
export default function PdfCoverThumb({ pdfUrl, alt, className, style }) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pdfUrl) return;

    let cancelled = false;

    async function render() {
      try {
        // Load PDF.js once from CDN (globally cached after first load)
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
          });
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const pdf   = await window.pdfjsLib.getDocument(pdfUrl).promise;
        if (cancelled) return;
        const page  = await pdf.getPage(1);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 1 });
        const canvas   = canvasRef.current;
        if (!canvas) return;

        // Scale so the canvas is max 400px wide (sharp retina rendering)
        const scale    = 400 / viewport.width;
        const scaled   = page.getViewport({ scale });

        canvas.width  = scaled.width;
        canvas.height = scaled.height;

        await page.render({
          canvasContext: canvas.getContext('2d'),
          viewport: scaled,
        }).promise;

        if (!cancelled) setLoading(false);
      } catch (err) {
        if (!cancelled) { setError(true); setLoading(false); }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [pdfUrl]);

  if (error) {
    // Fallback: plain PDF icon
    return (
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f0f0f0', color: '#999', fontSize: '2rem',
          ...(style || {}),
        }}
        className={className}
        title={alt}
      >
        📄
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div
          style={{
            background: 'linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
            ...(style || {}),
          }}
          className={className}
        />
      )}
      <canvas
        ref={canvasRef}
        title={alt}
        className={className}
        style={{ display: loading ? 'none' : 'block', ...(style || {}) }}
      />
    </>
  );
}
