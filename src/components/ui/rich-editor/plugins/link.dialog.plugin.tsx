import React, { useState, useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useTranslation } from 'react-i18next';
import { Link2, Unlink, ExternalLink, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkDialog({ open, onOpenChange }: LinkDialogProps) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [targetBlank, setTargetBlank] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (open) {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.anchor.getNode();
          const parent = node.getParent();
          if ($isLinkNode(parent)) {
            setUrl(parent.getURL());
            setTargetBlank(parent.getTarget() === '_blank');
            setIsEditMode(true);
          } else if ($isLinkNode(node)) {
            setUrl(node.getURL());
            setTargetBlank(node.getTarget() === '_blank');
            setIsEditMode(true);
          } else {
            setUrl('');
            setTargetBlank(true);
            setIsEditMode(false);
          }
        }
      });
    }
  }, [open, editor]);

  const handleApply = useCallback(() => {
    let formattedUrl = url.trim();
    if (!formattedUrl) return;

    if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('mailto:') && !formattedUrl.startsWith('/')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
      url: formattedUrl,
      target: targetBlank ? '_blank' : undefined,
      rel: targetBlank ? 'noopener noreferrer' : undefined,
    });

    onOpenChange(false);
  }, [editor, url, targetBlank, onOpenChange]);

  const handleRemove = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    onOpenChange(false);
  }, [editor, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5" requireDoubleClickOutside={false}>
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Link2 className="h-4 w-4" />
            <DialogTitle className="text-base font-semibold text-foreground">
              {isEditMode
                ? t('editor.link.editTitle', 'Edit Tautan Hyperlink')
                : t('editor.link.insertTitle', 'Sisipkan Tautan Hyperlink')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {t(
              'editor.link.desc',
              'Masukkan alamat URL tautan web yang ingin Anda sematkan pada teks terpilih.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center justify-between">
              <span>{t('editor.link.urlLabel', 'URL Tujuan')}</span>
              <span className="text-[11px] text-muted-foreground">Contoh: https://example.com</span>
            </label>
            <div className="relative">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://domain.com/artikel"
                className="pr-8 text-xs font-normal"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApply();
                  }
                }}
                autoFocus
              />
              {url && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/60 hover:bg-muted/50 transition-colors">
            <input
              type="checkbox"
              checked={targetBlank}
              onChange={(e) => setTargetBlank(e.target.checked)}
              className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <div className="flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('editor.link.newTab', 'Buka di tab baru (target="_blank")')}</span>
            </div>
          </label>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-2 sm:justify-between pt-2">
          <div>
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="gap-1.5 h-8 text-xs"
              >
                <Unlink className="h-3.5 w-3.5" />
                <span>{t('editor.link.remove', 'Hapus Tautan')}</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              {t('common.cancel', 'Batal')}
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleApply}
              disabled={!url.trim()}
              className="h-8 text-xs gap-1.5"
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>{t('common.save', 'Terapkan')}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
