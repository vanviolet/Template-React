import React, { useState, useRef, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, NodeKey } from 'lexical';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Trash2,
  Subtitles,
  Check,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface ImageComponentProps {
  src: string;
  altText: string;
  caption?: string;
  width: number | string;
  alignment: 'left' | 'center' | 'right' | 'full';
  nodeKey: NodeKey;
}

export function ImageComponent({
  src,
  altText,
  caption: initialCaption,
  width: initialWidth,
  alignment: initialAlignment,
  nodeKey,
}: ImageComponentProps) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setIsSelected] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [caption, setCaption] = useState(initialCaption || '');
  const [width, setWidth] = useState(initialWidth || '75%');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'full'>(
    initialAlignment || 'center'
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const updateNodeData = useCallback(
    (newWidth?: number | string, newAlign?: 'left' | 'center' | 'right' | 'full', newCaption?: string) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node && 'updateData' in node && typeof (node as any).updateData === 'function') {
          (node as any).updateData({
            width: newWidth ?? width,
            alignment: newAlign ?? alignment,
            caption: newCaption ?? caption,
          });
        }
      });
    },
    [editor, nodeKey, width, alignment, caption]
  );

  const handleAlignmentChange = (newAlign: 'left' | 'center' | 'right' | 'full') => {
    setAlignment(newAlign);
    updateNodeData(width, newAlign, caption);
  };

  const handleSizePreset = (preset: '25%' | '50%' | '75%' | '100%') => {
    setWidth(preset);
    updateNodeData(preset, alignment, caption);
  };

  const handleDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.remove();
      }
    });
  };

  const handleSaveCaption = () => {
    setIsEditingCaption(false);
    updateNodeData(width, alignment, caption);
  };

  // Drag resizer handlers
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    if (containerRef.current) {
      startWidthRef.current = containerRef.current.offsetWidth;
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const deltaX = moveEvent.clientX - startXRef.current;
      const newWidth = Math.max(150, Math.min(800, startWidthRef.current + deltaX));
      setWidth(`${newWidth}px`);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (containerRef.current) {
        updateNodeData(`${containerRef.current.offsetWidth}px`, alignment, caption);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const alignClass =
    alignment === 'left'
      ? 'justify-start'
      : alignment === 'right'
        ? 'justify-end'
        : 'justify-center';

  return (
    <div
      className={cn('flex my-4 w-full select-none group', alignClass)}
      onClick={() => setIsSelected(true)}
      onBlur={() => {
        setTimeout(() => setIsSelected(false), 200);
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: alignment === 'full' ? '100%' : width,
          maxWidth: '100%',
        }}
        className={cn(
          'relative rounded-xl border transition-all duration-150',
          isSelected
            ? 'ring-2 ring-primary border-primary shadow-md'
            : 'border-border/80 hover:border-primary/50'
        )}
      >
        {/* Floating Controls Toolbar */}
        <div
          className={cn(
            'absolute -top-11 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-popover/95 border border-border px-2 py-1 rounded-xl shadow-lg backdrop-blur-sm transition-opacity duration-150',
            isSelected ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
          )}
        >
          {/* Alignment */}
          <div className="flex items-center gap-0.5 border-r border-border pr-1 mr-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAlignmentChange('left');
              }}
              title="Rata Kiri"
              className={cn(
                'p-1 rounded text-xs transition-colors cursor-pointer',
                alignment === 'left' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
              )}
            >
              <AlignLeft className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAlignmentChange('center');
              }}
              title="Rata Tengah"
              className={cn(
                'p-1 rounded text-xs transition-colors cursor-pointer',
                alignment === 'center' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
              )}
            >
              <AlignCenter className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAlignmentChange('right');
              }}
              title="Rata Kanan"
              className={cn(
                'p-1 rounded text-xs transition-colors cursor-pointer',
                alignment === 'right' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
              )}
            >
              <AlignRight className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAlignmentChange('full');
              }}
              title="Lebar Penuh"
              className={cn(
                'p-1 rounded text-xs transition-colors cursor-pointer',
                alignment === 'full' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
              )}
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          </div>

          {/* Size Presets */}
          <div className="flex items-center gap-0.5 border-r border-border pr-1 mr-0.5 text-[10px] font-semibold">
            {(['25%', '50%', '75%', '100%'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSizePreset(preset);
                }}
                className={cn(
                  'px-1.5 py-0.5 rounded transition-colors cursor-pointer',
                  width === preset ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Caption toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingCaption(!isEditingCaption);
            }}
            title="Tambah / Ubah Keterangan"
            className={cn(
              'p-1 rounded text-xs transition-colors cursor-pointer',
              isEditingCaption || caption ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
            )}
          >
            <Subtitles className="h-3 w-3" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            title="Hapus Gambar"
            className="p-1 rounded text-xs text-destructive hover:bg-destructive/10 transition-colors cursor-pointer ml-0.5"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        {/* Image Element */}
        <img
          src={src}
          alt={altText}
          draggable={false}
          className="w-full h-auto rounded-xl object-cover block"
        />

        {/* Resize Handle (bottom-right) */}
        {alignment !== 'full' && (
          <div
            onMouseDown={handleResizeStart}
            className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-primary rounded-full cursor-se-resize border-2 border-background shadow-xs hover:scale-125 transition-transform"
            title="Tarik untuk mengubah ukuran gambar"
          />
        )}

        {/* Caption */}
        {(caption || isEditingCaption) && (
          <div className="p-2 bg-muted/40 rounded-b-xl border-t border-border/70 text-center">
            {isEditingCaption ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Ketik keterangan gambar di sini..."
                  className="w-full text-xs bg-background border border-border px-2 py-1 rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveCaption();
                    }
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveCaption}
                  className="p-1 rounded bg-primary text-primary-foreground text-xs hover:bg-primary/90"
                >
                  <Check className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <p
                onClick={() => setIsEditingCaption(true)}
                className="text-[11px] text-muted-foreground italic cursor-pointer hover:text-foreground transition-colors"
              >
                {caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
