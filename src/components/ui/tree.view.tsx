import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Copy,
  CheckSquare,
  Square,
  MoreVertical,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Generic Tree Node definition supporting arbitrary business payload `TData`
 */
export interface GenericTreeNode<TData = any> {
  id: string;
  label: string;
  data?: TData;
  children?: GenericTreeNode<TData>[];
  icon?: React.ReactNode | ((isOpen: boolean, isSelected: boolean) => React.ReactNode);
  badge?: React.ReactNode;
  subtitle?: string | React.ReactNode;
  tags?: string[];
  disabled?: boolean;
  droppable?: boolean;
  draggable?: boolean;
  nonEditable?: boolean;
  nonDeletable?: boolean;
  nonDuplicable?: boolean;
}

/**
 * Tree View Context for Compound Components
 */
interface TreeContextValue<TData = any> {
  nodes: GenericTreeNode<TData>[];
  expandedIds: Set<string>;
  toggleExpand: (id: string, e?: React.MouseEvent) => void;
  expandAll: () => void;
  collapseAll: () => void;
  selectedId: string | null;
  selectNode: (node: GenericTreeNode<TData>, e?: React.MouseEvent) => void;
  checkedIds: Set<string>;
  toggleCheck: (node: GenericTreeNode<TData>, e?: React.MouseEvent) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  editable: boolean;
  multiSelect: boolean;
  dragAndDrop: boolean;
  // Mutations
  updateNodeLabel: (id: string, newLabel: string) => void;
  deleteNode: (id: string, e?: React.MouseEvent) => void;
  duplicateNode: (node: GenericTreeNode<TData>, e?: React.MouseEvent) => void;
  addChildNode: (parentId: string, defaultName?: string, defaultData?: any) => void;
  addRootNode: (defaultName?: string, defaultData?: any) => void;
  // Drag drop
  draggedNodeId: string | null;
  setDraggedNodeId: (id: string | null) => void;
  dropTargetId: string | null;
  setDropTargetId: (id: string | null) => void;
  dropPosition: 'inside' | 'before' | 'after' | null;
  setDropPosition: (pos: 'inside' | 'before' | 'after' | null) => void;
  moveNode: (sourceId: string, targetId: string, position: 'inside' | 'before' | 'after') => void;
  // Custom Renderers
  renderNodeContent?: (props: {
    node: GenericTreeNode<TData>;
    depth: number;
    isOpen: boolean;
    isSelected: boolean;
    isChecked: boolean;
    isEditing: boolean;
  }) => React.ReactNode;
  renderActions?: (props: {
    node: GenericTreeNode<TData>;
    depth: number;
    isOpen: boolean;
    isSelected: boolean;
  }) => React.ReactNode;
}

const TreeContext = createContext<TreeContextValue<any> | null>(null);

export function useTreeContext<TData = any>() {
  const ctx = useContext(TreeContext);
  if (!ctx) {
    throw new Error('Tree compound components must be used within a <TreeRoot>');
  }
  return ctx as TreeContextValue<TData>;
}

// Helpers
function getAllFolderIds<T>(nodes: GenericTreeNode<T>[]): string[] {
  let ids: string[] = [];
  for (const n of nodes) {
    if (n.children && n.children.length >= 0) {
      ids.push(n.id);
      ids = ids.concat(getAllFolderIds(n.children));
    }
  }
  return ids;
}

function getAllNodeIds<T>(nodes: GenericTreeNode<T>[]): string[] {
  let ids: string[] = [];
  for (const n of nodes) {
    ids.push(n.id);
    if (n.children) {
      ids = ids.concat(getAllNodeIds(n.children));
    }
  }
  return ids;
}

function filterNodes<T>(nodes: GenericTreeNode<T>[], term: string): GenericTreeNode<T>[] {
  if (!term.trim()) return nodes;
  const lower = term.toLowerCase().trim();

  return nodes
    .map((node) => {
      const matchLabel = node.label.toLowerCase().includes(lower);
      const matchSubtitle = typeof node.subtitle === 'string' && node.subtitle.toLowerCase().includes(lower);
      const matchTags = node.tags && node.tags.some((t) => t.toLowerCase().includes(lower));
      const matchSelf = matchLabel || matchSubtitle || matchTags;

      if (node.children) {
        const filteredChildren = filterNodes(node.children, term);
        if (filteredChildren.length > 0 || matchSelf) {
          return {
            ...node,
            children: filteredChildren,
          };
        }
      }

      return matchSelf ? node : null;
    })
    .filter(Boolean) as GenericTreeNode<T>[];
}

/* =========================================================================
   1. TREE ROOT CONTAINER (Compound Component Parent)
   ========================================================================= */

export interface TreeRootProps<TData = any> {
  data: GenericTreeNode<TData>[];
  onChange?: (newData: GenericTreeNode<TData>[]) => void;
  selectedId?: string | null;
  onSelect?: (node: GenericTreeNode<TData>) => void;
  selectedIds?: string[];
  onMultiSelectChange?: (selectedIds: string[]) => void;
  defaultExpandedIds?: string[];
  editable?: boolean;
  multiSelect?: boolean;
  dragAndDrop?: boolean;
  renderNodeContent?: TreeContextValue<TData>['renderNodeContent'];
  renderActions?: TreeContextValue<TData>['renderActions'];
  className?: string;
  children?: React.ReactNode;
}

export function TreeRoot<TData = any>({
  data: initialData,
  onChange,
  selectedId: controlledSelectedId,
  onSelect,
  selectedIds = [],
  onMultiSelectChange,
  defaultExpandedIds = [],
  editable = true,
  multiSelect = true,
  dragAndDrop = true,
  renderNodeContent,
  renderActions,
  className,
  children,
}: TreeRootProps<TData>) {
  const [nodes, setNodes] = useState<GenericTreeNode<TData>[]>(initialData);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(selectedIds));
  const [searchTerm, setSearchTerm] = useState('');

  // Drag & drop state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'inside' | 'before' | 'after' | null>(null);

  useEffect(() => {
    setNodes(initialData);
  }, [initialData]);

  useEffect(() => {
    setCheckedIds(new Set(selectedIds));
  }, [selectedIds]);

  const activeSelectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;

  const updateTree = (newNodes: GenericTreeNode<TData>[]) => {
    setNodes(newNodes);
    onChange?.(newNodes);
  };

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(getAllFolderIds(nodes)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const selectNode = (node: GenericTreeNode<TData>, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setInternalSelectedId(node.id);
    onSelect?.(node);
  };

  const toggleCheck = (node: GenericTreeNode<TData>, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newChecked = new Set(checkedIds);
    const nodeIds = getAllNodeIds([node]);
    const isCurrentlyChecked = newChecked.has(node.id);

    if (isCurrentlyChecked) {
      nodeIds.forEach((id) => newChecked.delete(id));
    } else {
      nodeIds.forEach((id) => newChecked.add(id));
    }

    setCheckedIds(newChecked);
    onMultiSelectChange?.(Array.from(newChecked));
  };

  const updateNodeLabel = (id: string, newLabel: string) => {
    const editRecursively = (list: GenericTreeNode<TData>[]): GenericTreeNode<TData>[] => {
      return list.map((item) => {
        if (item.id === id) {
          return { ...item, label: newLabel };
        }
        if (item.children) {
          return { ...item, children: editRecursively(item.children) };
        }
        return item;
      });
    };
    updateTree(editRecursively(nodes));
  };

  const deleteNode = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const removeRecursively = (list: GenericTreeNode<TData>[]): GenericTreeNode<TData>[] => {
      return list
        .filter((n) => n.id !== id)
        .map((n) => ({
          ...n,
          children: n.children ? removeRecursively(n.children) : undefined,
        }));
    };
    updateTree(removeRecursively(nodes));
  };

  const duplicateNode = (node: GenericTreeNode<TData>, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const deepClone = (target: GenericTreeNode<TData>): GenericTreeNode<TData> => {
      const cloneId = `${target.id}-copy-${Date.now().toString().slice(-4)}`;
      return {
        ...target,
        id: cloneId,
        label: target.label.includes('(Copy)') ? target.label : `${target.label} (Copy)`,
        children: target.children ? target.children.map(deepClone) : undefined,
      };
    };

    const clone = deepClone(node);
    const insertRecursively = (list: GenericTreeNode<TData>[]): GenericTreeNode<TData>[] => {
      const res: GenericTreeNode<TData>[] = [];
      for (const item of list) {
        res.push(item);
        if (item.id === node.id) {
          res.push(clone);
        } else if (item.children) {
          res[res.length - 1] = {
            ...item,
            children: insertRecursively(item.children),
          };
        }
      }
      return res;
    };
    updateTree(insertRecursively(nodes));
  };

  const addChildNode = (parentId: string, defaultName = 'Node Baru', defaultData?: any) => {
    const newId = `node-${Date.now()}`;
    const newNode: GenericTreeNode<TData> = {
      id: newId,
      label: defaultName,
      data: defaultData,
      children: [],
    };

    const addRecursively = (list: GenericTreeNode<TData>[]): GenericTreeNode<TData>[] => {
      return list.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newNode],
          };
        }
        if (item.children) {
          return { ...item, children: addRecursively(item.children) };
        }
        return item;
      });
    };

    updateTree(addRecursively(nodes));
    setExpandedIds((prev) => new Set(prev).add(parentId));
  };

  const addRootNode = (defaultName = 'Root Node Baru', defaultData?: any) => {
    const newId = `node-${Date.now()}`;
    const newNode: GenericTreeNode<TData> = {
      id: newId,
      label: defaultName,
      data: defaultData,
      children: [],
    };
    updateTree([...nodes, newNode]);
  };

  const moveNode = (sourceId: string, targetId: string, position: 'inside' | 'before' | 'after') => {
    let sourceNode: GenericTreeNode<TData> | null = null;

    const removeSource = (list: GenericTreeNode<TData>[]): GenericTreeNode<TData>[] => {
      const filtered: GenericTreeNode<TData>[] = [];
      for (const n of list) {
        if (n.id === sourceId) {
          sourceNode = n;
        } else {
          filtered.push({
            ...n,
            children: n.children ? removeSource(n.children) : undefined,
          });
        }
      }
      return filtered;
    };

    const treeWithoutSource = removeSource(nodes);
    if (!sourceNode) return;

    const insertIntoTree = (list: GenericTreeNode<TData>[]): GenericTreeNode<TData>[] => {
      const res: GenericTreeNode<TData>[] = [];
      for (const n of list) {
        if (n.id === targetId) {
          if (position === 'inside') {
            res.push({
              ...n,
              children: [...(n.children || []), sourceNode!],
            });
            setExpandedIds((prev) => new Set(prev).add(targetId));
          } else if (position === 'before') {
            res.push(sourceNode!);
            res.push(n);
          } else {
            res.push(n);
            res.push(sourceNode!);
          }
        } else {
          res.push({
            ...n,
            children: n.children ? insertIntoTree(n.children) : undefined,
          });
        }
      }
      return res;
    };

    const newTree = insertIntoTree(treeWithoutSource);
    updateTree(newTree);
  };

  const contextValue: TreeContextValue<TData> = {
    nodes,
    expandedIds,
    toggleExpand,
    expandAll,
    collapseAll,
    selectedId: activeSelectedId,
    selectNode,
    checkedIds,
    toggleCheck,
    searchTerm,
    setSearchTerm,
    editable,
    multiSelect,
    dragAndDrop,
    updateNodeLabel,
    deleteNode,
    duplicateNode,
    addChildNode,
    addRootNode,
    draggedNodeId,
    setDraggedNodeId,
    dropTargetId,
    setDropTargetId,
    dropPosition,
    setDropPosition,
    moveNode,
    renderNodeContent,
    renderActions,
  };

  return (
    <TreeContext.Provider value={contextValue}>
      <div
        className={cn(
          'rounded-2xl border border-border/70 bg-card flex flex-col shadow-xs overflow-hidden',
          className
        )}
      >
        {children}
      </div>
    </TreeContext.Provider>
  );
}

/* =========================================================================
   2. TREE HEADER / TOOLBAR (Compound Component)
   ========================================================================= */

export interface TreeHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  searchPlaceholder?: string;
  showSearch?: boolean;
  extraActions?: React.ReactNode;
  className?: string;
}

export function TreeHeader({
  title,
  description,
  searchPlaceholder = 'Cari node / hierarki...',
  showSearch = true,
  extraActions,
  className,
}: TreeHeaderProps) {
  const { searchTerm, setSearchTerm, expandAll, collapseAll, addRootNode, editable } =
    useTreeContext();

  return (
    <div
      className={cn(
        'p-3.5 border-b border-border/50 bg-muted/20 flex flex-col gap-2.5',
        className
      )}
    >
      {(title || description) && (
        <div className="flex items-center justify-between">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-xs font-bold text-foreground tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {description && (
              <div className="text-[11px] text-muted-foreground mt-0.5">{description}</div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        {showSearch && (
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-8 pr-7 h-8 text-xs bg-background rounded-lg border-border/80"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="h-8 text-xs px-2.5 rounded-lg border-border/70 cursor-pointer"
          >
            <Maximize2 className="h-3 w-3 mr-1 opacity-70" />
            Buka Semua
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="h-8 text-xs px-2.5 rounded-lg border-border/70 cursor-pointer"
          >
            <Minimize2 className="h-3 w-3 mr-1 opacity-70" />
            Tutup Semua
          </Button>

          {editable && (
            <Button
              size="sm"
              onClick={() => addRootNode('Cabang Baru')}
              className="h-8 text-xs px-3 rounded-lg shadow-2xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah Root
            </Button>
          )}

          {extraActions}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. TREE NODE ROW (Single Interactive Node with Dnd & In-line Edit)
   ========================================================================= */

export interface TreeNodeItemProps {
  node: GenericTreeNode<any>;
  depth?: number;
}

export function TreeNodeItem({ node, depth = 0 }: TreeNodeItemProps) {
  const {
    expandedIds,
    toggleExpand,
    selectedId,
    selectNode,
    checkedIds,
    toggleCheck,
    multiSelect,
    editable,
    dragAndDrop,
    updateNodeLabel,
    deleteNode,
    duplicateNode,
    addChildNode,
    draggedNodeId,
    setDraggedNodeId,
    dropTargetId,
    setDropTargetId,
    dropPosition,
    setDropPosition,
    moveNode,
    renderNodeContent,
    renderActions,
  } = useTreeContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editingLabel, setEditingLabel] = useState(node.label);

  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isBranch = Boolean(node.children !== undefined);
  const isOpen = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isChecked = checkedIds.has(node.id);
  const isDragged = draggedNodeId === node.id;
  const isDropTarget = dropTargetId === node.id;

  const handleSaveEdit = () => {
    if (editingLabel.trim()) {
      updateNodeLabel(node.id, editingLabel.trim());
    }
    setIsEditing(false);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (!dragAndDrop || !editable || isEditing || node.draggable === false) return;
    e.stopPropagation();
    setDraggedNodeId(node.id);
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!dragAndDrop || !editable || !draggedNodeId || draggedNodeId === node.id) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const height = rect.height;

    if (isBranch && node.droppable !== false && offsetY > height * 0.25 && offsetY < height * 0.75) {
      setDropPosition('inside');
    } else if (offsetY <= height * 0.5) {
      setDropPosition('before');
    } else {
      setDropPosition('after');
    }

    setDropTargetId(node.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!dragAndDrop || !editable || !draggedNodeId || draggedNodeId === node.id) {
      setDraggedNodeId(null);
      setDropTargetId(null);
      setDropPosition(null);
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    if (dropPosition) {
      moveNode(draggedNodeId, node.id, dropPosition);
    }

    setDraggedNodeId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  const nodeIcon =
    typeof node.icon === 'function' ? node.icon(isOpen, isSelected) : node.icon;

  return (
    <div className="group/node relative select-none">
      {/* Drop indicator lines */}
      {isDropTarget && dropPosition === 'before' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary z-20 rounded" />
      )}
      {isDropTarget && dropPosition === 'after' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary z-20 rounded" />
      )}

      <div
        draggable={dragAndDrop && editable && !isEditing && node.draggable !== false}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={(e) => {
          if (isBranch) toggleExpand(node.id, e);
          selectNode(node, e);
        }}
        style={{ paddingLeft: `${Math.max(10, depth * 22 + 8)}px` }}
        className={cn(
          'flex items-center justify-between py-1.5 pr-2 rounded-xl text-xs transition-all duration-150 cursor-pointer my-0.5 border border-transparent',
          'hover:bg-accent/60 hover:text-accent-foreground',
          isSelected && 'bg-primary/10 text-primary font-medium border-primary/25 shadow-2xs',
          isDropTarget && dropPosition === 'inside' && 'bg-primary/20 border-dashed border-primary',
          isDragged && 'opacity-30',
          node.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
      >
        {/* Left: Checkbox, Chevron, Icon, Label/Input */}
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          {multiSelect && (
            <button
              type="button"
              onClick={(e) => toggleCheck(node, e)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors shrink-0 cursor-pointer"
            >
              {isChecked ? (
                <CheckSquare className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Square className="h-3.5 w-3.5" />
              )}
            </button>
          )}

          {isBranch ? (
            <button
              type="button"
              onClick={(e) => toggleExpand(node.id, e)}
              className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-transform shrink-0 cursor-pointer"
            >
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-200',
                  isOpen && 'rotate-90'
                )}
              />
            </button>
          ) : (
            <span className="w-4 shrink-0" />
          )}

          {nodeIcon && <span className="shrink-0">{nodeIcon}</span>}

          {/* Custom Content Renderer or Standard In-line edit & Label */}
          {renderNodeContent ? (
            renderNodeContent({
              node,
              depth,
              isOpen,
              isSelected,
              isChecked,
              isEditing,
            })
          ) : isEditing ? (
            <div
              className="flex items-center gap-1 flex-1 min-w-0"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                autoFocus
                value={editingLabel}
                onChange={(e) => setEditingLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="h-6 px-1.5 py-0 text-xs rounded border border-primary bg-background focus:outline-none focus:ring-1 focus:ring-primary w-full max-w-[220px]"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveEdit}
                className="h-6 w-6 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-6 w-6 text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate text-foreground font-normal group-hover/node:text-accent-foreground">
                {node.label}
              </span>

              {node.badge && <div>{node.badge}</div>}

              {node.subtitle && (
                <span className="text-[10px] text-muted-foreground/80 font-mono truncate hidden sm:inline">
                  {node.subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Actions */}
        {renderActions ? (
          renderActions({ node, depth, isOpen, isSelected })
        ) : (
          editable &&
          !isEditing && (
            <div
              className="flex items-center gap-0.5 opacity-0 group-hover/node:opacity-100 transition-opacity shrink-0 bg-background/90 backdrop-blur-xs px-1 rounded-lg border border-border/40"
              onClick={(e) => e.stopPropagation()}
            >
              {isBranch && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => addChildNode(node.id, 'Sub-item Baru')}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Tambah Sub-item"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}

              {!node.nonDuplicable && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => duplicateNode(node, e)}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Duplikat"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}

              {!node.nonEditable && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingLabel(node.label);
                    setIsEditing(true);
                  }}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Ganti Nama"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}

              {!node.nonDeletable && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => deleteNode(node.id, e)}
                  className="h-6 w-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )
        )}
      </div>

      {/* Children Sub-tree with guide line */}
      {isBranch && isOpen && node.children && (
        <div className="relative">
          <div
            className="absolute left-[20px] top-0 bottom-1 w-px bg-border/40 pointer-events-none"
            style={{ left: `${depth * 22 + 20}px` }}
          />
          {node.children.length === 0 ? (
            <div
              style={{ paddingLeft: `${depth * 22 + 38}px` }}
              className="py-1 text-[11px] text-muted-foreground/60 italic"
            >
              Tidak ada sub-item
            </div>
          ) : (
            node.children.map((child) => (
              <TreeNodeItem key={child.id} node={child} depth={depth + 1} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   4. TREE CONTENT (List Container)
   ========================================================================= */

export interface TreeContentProps {
  emptyState?: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

export function TreeContent({
  emptyState,
  className,
  maxHeight = 'max-h-[620px]',
}: TreeContentProps) {
  const { nodes, searchTerm } = useTreeContext();

  const filteredTree = useMemo(() => {
    return filterNodes(nodes, searchTerm);
  }, [nodes, searchTerm]);

  return (
    <div className={cn('p-2 overflow-y-auto min-h-[250px] scrollbar-thin', maxHeight, className)}>
      {filteredTree.length === 0 ? (
        emptyState || (
          <div className="py-12 px-4 text-center">
            <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-xs font-semibold text-foreground">
              {searchTerm ? 'Tidak ada hasil yang cocok' : 'Hierarki data kosong'}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {searchTerm
                ? `Tidak ditemukan elemen untuk pencarian "${searchTerm}"`
                : 'Mulai dengan menambahkan item baru di toolbar atas.'}
            </p>
          </div>
        )
      ) : (
        filteredTree.map((node) => <TreeNodeItem key={node.id} node={node} depth={0} />)
      )}
    </div>
  );
}

/* =========================================================================
   5. TREE FOOTER (Status & Selection Counts)
   ========================================================================= */

export interface TreeFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export function TreeFooter({ children, className }: TreeFooterProps) {
  const { nodes, checkedIds, multiSelect } = useTreeContext();
  const totalCount = getAllNodeIds(nodes).length;

  return (
    <div
      className={cn(
        'px-3.5 py-2 border-t border-border/40 bg-muted/10 flex items-center justify-between text-[11px] text-muted-foreground',
        className
      )}
    >
      {children || (
        <>
          <div className="flex items-center gap-3">
            <span>
              Total item: <strong className="text-foreground font-mono">{totalCount}</strong>
            </span>
            {multiSelect && checkedIds.size > 0 && (
              <span className="text-primary font-medium">{checkedIds.size} item terpilih</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="hidden sm:inline">Drag & Drop Hierarki</span>
            <span className="font-mono text-muted-foreground/60">•</span>
            <span className="hidden sm:inline">In-line Edit</span>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================================
   6. CONVENIENCE WRAPPER: TreeView (For all simple & advanced usage)
   ========================================================================= */

export interface TreeViewProps<TData = any> {
  data: GenericTreeNode<TData>[];
  onChange?: (newData: GenericTreeNode<TData>[]) => void;
  selectedId?: string | null;
  onSelect?: (node: GenericTreeNode<TData>) => void;
  selectedIds?: string[];
  onMultiSelectChange?: (selectedIds: string[]) => void;
  defaultExpandedIds?: string[];
  editable?: boolean;
  multiSelect?: boolean;
  dragAndDrop?: boolean;
  searchable?: boolean;
  filterPlaceholder?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  extraActions?: React.ReactNode;
  emptyState?: React.ReactNode;
  renderNodeContent?: TreeContextValue<TData>['renderNodeContent'];
  renderActions?: TreeContextValue<TData>['renderActions'];
  className?: string;
  maxHeight?: string;
}

export function TreeView<TData = any>({
  data,
  onChange,
  selectedId,
  onSelect,
  selectedIds,
  onMultiSelectChange,
  defaultExpandedIds,
  editable = true,
  multiSelect = true,
  dragAndDrop = true,
  searchable = true,
  filterPlaceholder,
  title,
  description,
  extraActions,
  emptyState,
  renderNodeContent,
  renderActions,
  className,
  maxHeight,
}: TreeViewProps<TData>) {
  return (
    <TreeRoot
      data={data}
      onChange={onChange}
      selectedId={selectedId}
      onSelect={onSelect}
      selectedIds={selectedIds}
      onMultiSelectChange={onMultiSelectChange}
      defaultExpandedIds={defaultExpandedIds}
      editable={editable}
      multiSelect={multiSelect}
      dragAndDrop={dragAndDrop}
      renderNodeContent={renderNodeContent}
      renderActions={renderActions}
      className={className}
    >
      <TreeHeader
        title={title}
        description={description}
        searchPlaceholder={filterPlaceholder}
        showSearch={searchable}
        extraActions={extraActions}
      />
      <TreeContent emptyState={emptyState} maxHeight={maxHeight} />
      <TreeFooter />
    </TreeRoot>
  );
}
