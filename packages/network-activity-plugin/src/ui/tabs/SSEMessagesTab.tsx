import { useState, useMemo } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { themes } from '../theme/themeConfig';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ScrollArea } from '../components/ScrollArea';
import { JsonTree } from '../components/JsonTree';
import { SSENetworkEntry } from '../state/model';

export type SSEMessagesTabProps = {
  selectedRequest: SSENetworkEntry;
};

interface SSEMessageRow {
  id: string;
  type: string;
  data: string;
  timestamp: number;
}

const columnHelper = createColumnHelper<SSEMessageRow>();

const formatPreviewData = (data: string, theme: typeof themes.rozenite) => {
  return (
    <span className={`max-w-xs truncate ${theme.colors.textMuted}`}>
      {data.substring(0, 100) + (data.length > 100 ? '...' : '')}
    </span>
  );
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const timeString = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  return `${timeString}.${milliseconds}`;
};

const getColumns = (theme: typeof themes.rozenite) => [
  columnHelper.accessor('timestamp', {
    header: 'Timestamp',
    cell: ({ getValue }) => (
      <div className={theme.colors.textMuted}>{formatTimestamp(getValue())}</div>
    ),
    size: 120,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: ({ getValue }) => (
      <div className={`${theme.colors.textAccent3} font-medium`}>
        {getValue()}
      </div>
    ),
    size: 100,
  }),
  columnHelper.accessor('data', {
    header: 'Data',
    cell: ({ getValue }) => {
      const data = getValue();
      return formatPreviewData(data, theme);
    },
    size: 300,
  }),
];

export const SSEMessagesTab = ({ selectedRequest }: SSEMessagesTabProps) => {
  const { theme } = useTheme();
  const { components, colors } = theme
  const columns = useMemo(() => getColumns(theme), [theme]);
  // Capture the selected message, so when it gets removed (message limit), it's still displayed
  const [selectedMessage, setSelectedMessage] = useState<SSEMessageRow | null>(
    null
  );

  const formatData = (data: string) => {
    if (typeof data === 'string') {
      try {
        const jsonData = JSON.parse(data);
        return (
          <div
            className={`p-3 rounded ${components.codeBlock.main} border`}
          >
            <JsonTree data={jsonData} />
          </div>
        );
      } catch {
        // Fallback to pre tag if JSON parsing fails
        return (
          <pre
            className={`text-sm font-mono whitespace-pre-wrap p-3 rounded border overflow-x-auto ${components.codeBlock.main}`}
          >
            {data}
          </pre>
        );
      }
    }

    return 'Invalid data';
  };

  const tableData = useMemo(() => {
    return selectedRequest.messages.map(
      (message): SSEMessageRow => ({
        id: message.id,
        type: message.type,
        data: message.data,
        timestamp: message.timestamp,
      })
    );
  }, [selectedRequest.messages]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (selectedRequest.messages.length === 0) {
    return (
      <ScrollArea className="h-full min-h-0 p-4">
        <div className={`text-sm ${colors.textMuted}`}>
          No SSE messages available for this connection. Messages will appear
          here when the SSE connection receives data.
        </div>
      </ScrollArea>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages Table */}
      <div
        className={`flex-1 border rounded overflow-hidden ${colors.borderColor}`}
      >
        <div className="overflow-y-auto h-full">
          <table className="w-full text-sm">
            <thead
              className={`sticky top-0 z-10 border-b ${colors.secondaryBg} ${colors.borderColor}`}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`text-left p-2 font-medium ${colors.textSubtle}`}
                      style={{ width: header.getSize() }}
                    >
                      <div className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b cursor-pointer ${
                    colors.borderColor
                  } ${colors.hoverBg} ${
                    selectedMessage?.id === row.original.id
                      ? colors.secondaryBg
                      : ''
                  }`}
                  onClick={() => setSelectedMessage(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-2"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Details Panel */}
      {selectedMessage && (
        <div
          className={`border-t ${colors.borderColor} ${colors.secondaryBg}`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4
                className={`text-sm font-medium ${colors.textSubtle}`}
              >
                Message Details
              </h4>
              <button
                onClick={() => setSelectedMessage(null)}
                className={`text-sm ${colors.textMuted} hover:${colors.textAccent1}`}
              >
                Close
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={colors.textMuted}>Type: </span>
                  <span className={colors.textAccent3}>
                    {selectedMessage.type}
                  </span>
                </div>
                <div>
                  <span className={colors.textMuted}>Timestamp: </span>
                  <span className={colors.textSubtle}>
                    {formatTimestamp(selectedMessage.timestamp)}
                  </span>
                </div>
              </div>
              <div>
                <span className={`${colors.textMuted} text-sm`}>Content:</span>
                <div className="mt-2 max-h-96 overflow-y-auto">
                  {formatData(selectedMessage.data)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
