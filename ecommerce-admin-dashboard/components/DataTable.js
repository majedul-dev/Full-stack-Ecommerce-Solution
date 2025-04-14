// components/DataTable.js
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

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
}) => {
  return (
    <div className="rounded-md border bg-white">
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
                  <div className="flex items-center space-x-3">
                    {actions.map((action) => {
                      const href = typeof action.href === 'function' 
                        ? action.href(item) 
                        : action.href;

                      return (
                        <Button
                          key={action.key}
                          variant="ghost"
                          size="sm"
                          onClick={() => action.onClick?.(item[keyField])}
                          className={action.className}
                          asChild={!!href}
                        >
                          {href ? (
                            <Link href={href}>
                              <action.icon className={`h-4 w-4 ${action.iconClassName}`} />
                            </Link>
                          ) : (
                            <action.icon className={`h-4 w-4 ${action.iconClassName}`} />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;