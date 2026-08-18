import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  Filter,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  TABLE_EMPTY_CELL_CLASSNAME,
  TABLE_EMPTY_MESSAGE,
} from "@/components/shared/TableEmptyRow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableToolbarProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  onAdd?: () => void;
  addLabel?: string;
  renderFilters?: React.ReactNode;
  customAction?: React.ReactNode;
  titleAction?: React.ReactNode;
  hideBorder?: boolean;
  filterPlacement?: "right" | "inline";
  inlineActions?: React.ReactNode;
}

function TableToolbar({
  title,
  description,
  children,
  className,
  onAdd,
  addLabel,
  renderFilters,
  customAction,
  titleAction,
  filterPlacement = "right",
  inlineActions,
}: TableToolbarProps) {
  const [showFilters, setShowFilters] = React.useState(false);

  const filterButton = renderFilters ? (
    <Button
      variant="outline"
      size="sm"
      type="button"
      className={cn(
        "h-9 shrink-0 cursor-pointer text-sm font-semibold bg-white text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all",
        showFilters && "bg-slate-50",
      )}
      onClick={() => setShowFilters(!showFilters)}
    >
      <Filter size={16} className="mr-2 stroke-[2.5px]" />
      Filter
    </Button>
  ) : null;

  return (
    <div className={cn("flex flex-col overflow-x-auto custom-scrollbar")}>
      <div className={cn("flex flex-col gap-6 px-4 py-5", className)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm font-normal text-slate-500">{description}</p>
            )}
          </div>
          {titleAction && (
            <div className="shrink-0 pt-0.5">
              {titleAction}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 w-full">
          <div
            className={cn(
              filterPlacement === "inline"
                ? "flex flex-1 items-center gap-2 min-w-0"
                : "flex-1 min-w-0",
            )}
          >
            {children}
            {filterPlacement === "inline" && filterButton}
            {filterPlacement === "inline" && inlineActions}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {filterPlacement === "right" && filterButton}

            {onAdd && (
              <Button
                onClick={onAdd}
                size="sm"
                className="h-9 cursor-pointer text-sm font-semibold bg-brand-secondary-500 hover:bg-brand-secondary-600 text-white shadow-sm transition-colors"
              >
                <Plus size={18} className="mr-1 stroke-[3px]" />
                {addLabel}
              </Button>
            )}

            {customAction}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          showFilters && renderFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          {renderFilters && (
            <div className="px-4 pb-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                {renderFilters}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative isolate w-full rounded-xl overflow-hidden",
        "border border-brand-primary-200 bg-white",
        "shadow-[0_12px_30px_-10px_rgba(10,35,69,0.24),0_3px_8px_rgba(10,35,69,0.10)]",
        "ring-1 ring-white/80",
        "dark:border-brand-primary-800 dark:bg-[#00091a] dark:ring-brand-primary-900/40",
        "dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.85),0_0_0_1px_rgba(242,194,100,0.12)]",
      )}
    >
      <div className="w-full overflow-x-auto custom-scrollbar pb-1">
        <table
          data-slot="table"
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "bg-brand-primary-500 border-b border-slate-100 dark:bg-slate-900 dark:border-slate-800",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-4 text-left align-middle font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300",
        "bg-brand-primary-100 dark:bg-slate-800/50",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "odd:bg-white even:bg-brand-primary-50 dark:odd:bg-slate-950 dark:even:bg-slate-900/50",
        "hover:bg-slate-50 dark:hover:bg-slate-800/50",
        "last:border-0 last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

interface TableBodyProps extends React.ComponentProps<"tbody"> {
  isEmpty?: boolean;
  emptyContent?: React.ReactNode;
  colSpan?: number;
}

function TableBody({
  className,
  isEmpty,
  emptyContent = TABLE_EMPTY_MESSAGE,
  colSpan = 1,
  children,
  ...props
}: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "divide-y divide-slate-50 dark:divide-slate-800 dark:text-slate-400 group/body",
        className,
      )}
      {...props}
    >
      {isEmpty ? (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={colSpan} className={TABLE_EMPTY_CELL_CLASSNAME}>
            {emptyContent}
          </TableCell>
        </TableRow>
      ) : (
        children
      )}
    </tbody>
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-4 py-5 align-middle whitespace-nowrap text-slate-600 dark:text-slate-400",
        className,
      )}
      {...props}
    />
  );
}

const PaginationButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-30",
      active
        ? "bg-[#D1E9FF] text-[#0070FF] dark:bg-blue-900 dark:text-blue-200 font-bold"
        : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800",
      className,
    )}
    {...props}
  />
));
PaginationButton.displayName = "PaginationButton";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: TablePaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white dark:bg-slate-950">
      <div className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-10 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none">
              {" "}
              <span>{pageSize}</span>
              <ChevronDownIcon className="h-4 w-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[70px]">
            {pageSizeOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                className="cursor-pointer font-medium"
                onClick={() => onPageSizeChange(option)}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <p className="text-sm font-bold text-[#334155] dark:text-white">
          Showing {startItem} - {endItem} of {totalItems} records
        </p>
      </div>
      <div className="flex items-center gap-1">
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2"
        >
          <ChevronLeftIcon className="h-4 w-4 stroke-[3px]" />
        </PaginationButton>

        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
              ...
            </span>
          ) : (
            <PaginationButton
              key={page}
              active={currentPage === page}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </PaginationButton>
          ),
        )}

        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="ml-2"
        >
          <ChevronRightIcon className="h-4 w-4 stroke-[3px]" />
        </PaginationButton>
      </div>
    </div>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
  TableToolbar,
};
