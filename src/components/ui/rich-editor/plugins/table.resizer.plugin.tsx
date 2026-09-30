import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

/**
 * TableResizerPlugin enables interactive click-and-drag column resizing on table headers and cells.
 */
export function TableResizerPlugin() {
  const [editor] = useLexicalComposerContext();
  const activeCellRef = useRef<HTMLTableCellElement | null>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - startXRef.current;
        const newWidth = Math.max(40, startWidthRef.current + deltaX);
        if (activeCellRef.current) {
          activeCellRef.current.style.width = `${newWidth}px`;
          activeCellRef.current.style.minWidth = `${newWidth}px`;
        }
        return;
      }

      const target = e.target as HTMLElement;
      const cell = target.closest('th, td') as HTMLTableCellElement | null;

      if (cell && rootElement.contains(cell)) {
        const rect = cell.getBoundingClientRect();
        // Check if mouse is within 8px of the right border
        const isNearRightEdge = e.clientX >= rect.right - 8 && e.clientX <= rect.right + 2;

        if (isNearRightEdge) {
          cell.style.cursor = 'col-resize';
          cell.dataset.resizeTarget = 'true';
        } else {
          cell.style.cursor = '';
          delete cell.dataset.resizeTarget;
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cell = target.closest('th, td') as HTMLTableCellElement | null;

      if (cell && cell.dataset.resizeTarget === 'true' && rootElement.contains(cell)) {
        e.preventDefault();
        e.stopPropagation();

        isDraggingRef.current = true;
        activeCellRef.current = cell;
        startXRef.current = e.clientX;
        startWidthRef.current = cell.offsetWidth;

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        const handleMouseUp = () => {
          isDraggingRef.current = false;
          activeCellRef.current = null;
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mouseup', handleMouseUp);
      }
    };

    rootElement.addEventListener('mousemove', handleMouseMove);
    rootElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      rootElement.removeEventListener('mousemove', handleMouseMove);
      rootElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [editor]);

  return null;
}
