import React, { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { useTranslation } from 'react-i18next';
import { Table as TableIcon, Grid3X3, Check } from 'lucide-react';
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
import { cn } from '@/utils/cn';

interface InsertTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InsertTableDialog({ open, onOpenChange }: InsertTableDialogProps) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const [hoveredRows, setHoveredRows] = useState(3);
  const [hoveredCols, setHoveredCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const maxGridRows = 6;
  const maxGridCols = 6;

  const handleCellClick = (r: number, c: number) => {
    setRows(r);
    setCols(c);
  };

  const handleInsert = () => {
    const finalRows = Math.max(1, Math.min(30, rows));
    const finalCols = Math.max(1, Math.min(15, cols));

    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: String(finalCols),
      rows: String(finalRows),
      includeHeaders: {
        rows: includeHeaders,
        columns: false,
      },
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-5" requireDoubleClickOutside={false}>
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <TableIcon className="h-4 w-4" />
            <DialogTitle className="text-base font-semibold text-foreground">
              {t('editor.table.dialogTitle', 'Sisipkan Tabel Baru')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {t(
              'editor.table.dialogDesc',
              'Pilih dimensi baris dan kolom yang diinginkan menggunakan kisi interaktif atau input angka.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Interactive Visual Grid */}
          <div className="flex flex-col items-center justify-center p-4 bg-muted/30 border border-border/80 rounded-xl space-y-2">
            <div className="grid grid-cols-6 gap-1.5 p-1 bg-card rounded-lg border border-border/60 shadow-2xs">
              {Array.from({ length: maxGridRows }).map((_, rIndex) =>
                Array.from({ length: maxGridCols }).map((_, cIndex) => {
                  const r = rIndex + 1;
                  const c = cIndex + 1;
                  const isHighlighted = r <= hoveredRows && c <= hoveredCols;
                  const isSelected = r <= rows && c <= cols;

                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onMouseEnter={() => {
                        setHoveredRows(r);
                        setHoveredCols(c);
                      }}
                      onClick={() => handleCellClick(r, c)}
                      className={cn(
                        'w-6 h-6 rounded border transition-all cursor-pointer',
                        isHighlighted
                          ? 'bg-primary/20 border-primary'
                          : isSelected
                            ? 'bg-primary/10 border-primary/50'
                            : 'bg-muted/40 border-border/70 hover:border-border'
                      )}
                    />
                  );
                })
              )}
            </div>
            <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Grid3X3 className="h-3.5 w-3.5 text-primary" />
              <span>
                {hoveredRows} Baris × {hoveredCols} Kolom
              </span>
            </div>
          </div>

          {/* Number Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                {t('editor.table.rows', 'Jumlah Baris')}
              </label>
              <Input
                type="number"
                min={1}
                max={30}
                value={rows}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setRows(val);
                  setHoveredRows(Math.min(maxGridRows, val));
                }}
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">
                {t('editor.table.cols', 'Jumlah Kolom')}
              </label>
              <Input
                type="number"
                min={1}
                max={15}
                value={cols}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setCols(val);
                  setHoveredCols(Math.min(maxGridCols, val));
                }}
                className="text-xs h-8"
              />
            </div>
          </div>

          {/* Header Row Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-foreground bg-muted/20 p-2.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors">
            <input
              type="checkbox"
              checked={includeHeaders}
              onChange={(e) => setIncludeHeaders(e.target.checked)}
              className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
            />
            <div className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-primary" />
              <span>{t('editor.table.includeHeader', 'Gunakan Baris Pertama sebagai Header Judul (<th>)')}</span>
            </div>
          </label>
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2 border-t border-border/80">
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
            onClick={handleInsert}
            className="h-8 text-xs gap-1.5"
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>{t('editor.table.insertBtn', 'Sisipkan Tabel')}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
