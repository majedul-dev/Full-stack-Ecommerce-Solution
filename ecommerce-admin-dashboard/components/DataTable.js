'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, EllipsisVertical, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const DataTable = ({
  data,
  columns,
  actions,
  hasSelection = false,
  isAllSelected = true,
  onSelectAll,
  selectedIds = [],
  onSelectItem,
  onSort,
  keyField = '_id',
  iconSize = 'sm',
}) => {
  const iconSizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setShowPopup(selectedIds.length > 0);
  }, [selectedIds.length]);

  return (
    <div>
      <div className={`rounded-md border bg-white`}>
      <Table>
        <TableHeader>
          <TableRow>
            {hasSelection && (
              <TableHead>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                {column.header}
              </TableHead>
            ))}
            {actions?.length > 0 && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item[keyField]} className="hover:bg-gray-50">
              {hasSelection && (
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(item[keyField])}
                    onCheckedChange={() => onSelectItem(item[keyField])}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.renderCell ? column.renderCell(item) : item[column.key]}
                </TableCell>
              ))}
              {actions?.length > 0 && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action) => {
                        const href = typeof action.href === 'function' 
                          ? action.href(item) 
                          : action.href;
                        
                        const sizeClass = action.iconSize 
                          ? iconSizeClasses[action.iconSize] 
                          : iconSizeClasses[iconSize];

                        return (
                          <DropdownMenuItem
                            key={action.key}
                            onClick={() => !href && action.onClick?.(item[keyField])}
                            className="flex items-center gap-2"
                          >
                            {href ? (
                              <Link href={href} className="flex items-center gap-2 w-full">
                                <action.icon className={`${sizeClass} ${action.iconClassName || ''}`} />
                                <span>{action.label}</span>
                              </Link>
                            ) : (
                              <>
                                <action.icon className={`${sizeClass} ${action.iconClassName || ''}`} />
                                <span>{action.label}</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      {showPopup && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-lg border border-primary/50 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span className="font-medium">
                {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSelectAll(false)}
                className="h-8 gap-1 hover:bg-background"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>

              {/* Example bulk action */}
              <Button
                variant="default"
                size="sm"
                className="h-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => console.log('Bulk action on:', selectedIds)}
              >
                <span>Export Selected</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;