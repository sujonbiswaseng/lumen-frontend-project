'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableAction<T> {
  icon: LucideIcon;
  label: string;
  onClick: (item: T) => void;
  className?: string;
}

interface ReusableTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  emptyMessage?: string;
  className?: string;
  // Add optional row hover effect
  rowHoverClassName?: string;
}

export function ReusableTable<T extends { id: string }>({
  columns,
  data,
  actions,
  emptyMessage = 'No data found',
  className,
  rowHoverClassName, // We'll override this below to add custom hover logic
}: ReusableTableProps<T>) {
  // Custom hover classes for both bg and text color
  const effectiveRowHoverClass =
    rowHoverClassName ??
    'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]';

  return (
    <section
      className={cn(
        'w-full flex justify-center items-start ',
        className
      )}
      style={{
        maxWidth: '1440px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <div
        className="
          w-full
          overflow-hidden
          rounded-2xl
          border
          shadow-sm
          bg-[var(--card)]
          border-[var(--border)]
          "
      >
        <div className="w-full overflow-x-auto">
          <div className="min-h-[420px]">
            <table className="
              w-full
              min-w-[700px]
              border-separate
              border-spacing-0
              transition
              "
              style={{
                background: 'var(--card)',
                color: 'var(--card-foreground)'
              }}
            >
              {/* HEADER */}
              <thead
                className="sticky top-0 z-10"
                style={{
                  background: 'var(--card)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <tr style={{ height: 52 }}>
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className="px-6 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{
                        color: 'var(--muted-foreground)',
                        background: 'var(--card)',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid var(--border)',
                        paddingTop: '16px',
                        paddingBottom: '16px'
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                  {actions && (
                    <th
                      className="px-6 text-left text-xs font-semibold uppercase tracking-wide"
                      style={{
                        color: 'var(--muted-foreground)',
                        background: 'var(--card)',
                        borderBottom: '1px solid var(--border)',
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                      }}
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (actions ? 1 : 0)}
                      className="px-6 py-16 sm:py-20 text-center"
                      style={{
                        color: 'var(--muted-foreground)',
                        background: 'var(--card)'
                      }}
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={item.id}
                      className={cn(
                        index % 2 === 0
                          ? 'bg-[var(--card)]'
                          : 'bg-[color:var(--background)]/70',
                        'group transition',
                        effectiveRowHoverClass // Add hover effect for both bg and text color
                      )}
                      style={{
                        transition: 'background 0.2s,color 0.2s',
                        cursor: 'pointer',
                      }}
                    >
                      {columns.map((col) => (
                        <td
                          key={String(col.key)}
                          className={cn(
                            'px-6 py-4 text-sm align-middle',
                            col.className
                          )}
                          style={{
                            color: 'inherit', // inherit for hover text color effect
                            borderBottom: '1px solid var(--border)',
                            background: 'inherit',
                          }}
                        >
                          {col.render
                            ? col.render(item)
                            : (item[col.key] as React.ReactNode)}
                        </td>
                      ))}

                      {actions && (
                        <td
                          className="px-6 py-4 align-middle"
                          style={{
                            borderBottom: '1px solid var(--border)',
                            background: 'inherit',
                            color: 'inherit', // for hover text color effect
                          }}
                        >
                          <div className="flex gap-2">
                            {actions.map((action, i) => (
                              <button
                                key={i}
                                onClick={() => action.onClick(item)}
                                type="button"
                                aria-label={action.label}
                                className={cn(
                                  'p-2 rounded-md border transition focus:outline-none',
                                  'focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
                                  'bg-[var(--background)] border-[var(--border)]',
                                  'hover:bg-[var(--accent)] hover:border-[var(--accent)]',
                                  'hover:text-[var(--accent-foreground)]',
                                  'focus-visible:bg-[var(--accent)] focus-visible:border-[var(--accent)]',
                                  action.className
                                )}
                                style={{
                                  color: 'var(--muted-foreground)',
                                  background: 'var(--background)',
                                  borderColor: 'var(--border)',
                                }}
                              >
                                <action.icon className="w-4 h-4" style={{ color: 'inherit' }} />
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}