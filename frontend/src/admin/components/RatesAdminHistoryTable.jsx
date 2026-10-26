import React, { useMemo } from 'react';
import { Table20 } from '@/components/ui/table-20';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, MoreHorizontal, Trash2, Copy, History } from 'lucide-react';
import { toast } from 'sonner';

function formatPkr(num) {
  if (!num && num !== 0) return '—';
  return 'Rs. ' + Math.round(num).toLocaleString('en-PK');
}

export function RatesAdminHistoryTable({ history = [], onDeleteLog, onReapplyRate }) {
  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 text-xs font-mono"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Timestamp
          <ArrowUpDown className="ml-1.5 size-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const d = new Date(row.getValue('createdAt'));
        return (
          <span className="font-mono text-xs text-foreground">
            {d.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        );
      }
    },
    {
      accessorKey: 'gold24kTola',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 text-xs font-mono"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          24K Gold / Tola
          <ArrowUpDown className="ml-1.5 size-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono font-medium text-xs text-foreground">
          {formatPkr(row.getValue('gold24kTola'))}
        </span>
      )
    },
    {
      accessorKey: 'silver24kTola',
      header: 'Silver / Tola',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {formatPkr(row.getValue('silver24kTola'))}
        </span>
      )
    },
    {
      accessorKey: 'source',
      header: 'Source & Mode',
      cell: ({ row }) => {
        const isManual = row.original?.isManualOverride;
        const src = row.getValue('source');
        return (
          <Badge variant={isManual ? 'secondary' : 'outline'} className="text-[10px] font-mono capitalize">
            {isManual ? 'Manual Override' : 'Live Sync'}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'updatedBy',
      header: 'Updated By',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono truncate max-w-[120px] block">
          {row.getValue('updatedBy') || 'Admin'}
        </span>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7 cursor-pointer">
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(`Gold 24K: ${row.original.gold24kTola}, Silver: ${row.original.silver24kTola}`);
                  toast.success('Rates copied to clipboard.');
                }}
              >
                <Copy className="size-3.5 mr-2" />
                Copy Rates
              </DropdownMenuItem>
              {onReapplyRate && (
                <DropdownMenuItem
                  className="cursor-pointer text-xs"
                  onClick={() => onReapplyRate(row.original)}
                >
                  <History className="size-3.5 mr-2" />
                  Restore This Rate
                </DropdownMenuItem>
              )}
              {onDeleteLog && (
                <DropdownMenuItem
                  className="cursor-pointer text-xs text-destructive hover:bg-destructive/10"
                  onClick={() => onDeleteLog(row.original._id)}
                >
                  <Trash2 className="size-3.5 mr-2" />
                  Delete Log
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ], [onDeleteLog, onReapplyRate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-light text-foreground">
            Rate Synchronization History
          </h3>
          <p className="text-xs text-muted-foreground font-light">
            Audit trail of all automated syncs and manual atelier rate overrides.
          </p>
        </div>
      </div>

      <Table20
        data={history}
        columns={columns}
        searchPlaceholder="Filter by source or updater..."
        searchColumn="source"
        pageSize={6}
      />
    </div>
  );
}
