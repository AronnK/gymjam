"use client";
import * as React from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type FuturePlanEntry = {
  id: number;
  workout: string;
  sets: number;
  weights: string;
  reps: string;
  date: string;
};

export const futurePlanColumns: ColumnDef<FuturePlanEntry>[] = [
  {
    accessorKey: "id",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "workout",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Workout Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("workout")}</div>,
  },
  {
    accessorKey: "sets",
    header: "Sets",
    cell: ({ row }) => <div>{row.getValue("sets")}</div>,
  },
  {
    accessorKey: "weights",
    header: "Weights",
    cell: ({ row }) => <div>{row.getValue("weights")}</div>,
  },
  {
    accessorKey: "reps",
    header: "Reps",
    cell: ({ row }) => <div>{row.getValue("reps")}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
  },
];

interface FuturePlanProps {
  futurePlans: FuturePlanEntry[];
}

export default function FuturePlan({ futurePlans }: FuturePlanProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: futurePlans,
    columns: futurePlanColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className="w-full pt-14 pr-20">
      <div className="rounded-md border">
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={futurePlanColumns.length}
                    className="h-24 text-center"
                  >
                    No future plans found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
