import { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ScrollArea } from '../components/ScrollArea';
import { JsonTree } from '../components/JsonTree';
import { WebSocketMessageType } from '../../shared/websocket-events';
import { WebSocketNetworkEntry } from '../state/model';
import { useWebSocketMessages } from '../state/hooks';
import { useTheme } from '../theme/ThemeContext';

export type MessagesTabProps = {
  selectedRequest: WebSocketNetworkEntry;
};

interface WebSocketMessageRow {
  id: string;
  direction: 'sent' | 'received';
  data: string;
  messageType: 'text' | 'binary';
  timestamp: number;
}

const columnHelper = createColumnHelper<WebSocketMessageRow>();

export const MessagesTab = ({ selectedRequest }: MessagesTabProps) => {
  const { theme } = useTheme();
  const { colors, components } = theme;
  const websocketMessages = useWebSocketMessages(selectedRequest.id);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );

  const selectedMessage = useMemo(() => {
    if (!selectedMessageId) return null;
    return (
      websocketMessages.find((msg) => msg.id === selectedMessageId) || null
    );
  }, [selectedMessageId, websocketMessages]);

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

  const formatData = (data: string, messageType: WebSocketMessageType) => {
    if (messageType === 'binary') {
      return 'Binary message';
    }

    if (typeof data === 'string') {
      try {
        const jsonData = JSON.parse(data);
        return (
          <div
            className={`p-3 rounded border ${components.codeBlock.main}`}
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

    return 'Binary message';
  };

  const getMessageTypeColor = (type: 'sent' | 'received') => {
    return type === 'sent' ? colors.textAccent1 : colors.textAccent2;
  };

  const getMessageTypeIcon = (type: 'sent' | 'received') => {
    return type === 'sent' ? '↑' : '↓';
  };

  const tableData = useMemo(() => {
    return websocketMessages.map(
      (message): WebSocketMessageRow => ({
        id: message.id,
        direction: message.direction,
        data: message.data,
        messageType: message.messageType,
        timestamp: message.timestamp,
      })
    );
  }, [websocketMessages]);

  const formatPreviewData = (
    data: string,
    messageType: WebSocketMessageType
  ) => {
    if (messageType === 'binary') {
      return <span className={colors.textMuted}>Binary message</span>;
    }

    return (
      <span className={`max-w-xs truncate ${colors.textMuted}`}>
        {data.substring(0, 100) + (data.length > 100 ? '...' : '')}
      </span>
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('direction', {
        header: 'Type',
        cell: ({ getValue }) => {
          const direction = getValue();
          return (
            <span
              className={`flex items-center gap-1 ${getMessageTypeColor(
                direction
              )}`}
            >
              <span className="text-xs">{getMessageTypeIcon(direction)}</span>
              <span className="capitalize">{direction}</span>
            </span>
          );
        },
        size: 80,
      }),
      columnHelper.accessor('data', {
        header: 'Data',
        cell: ({ getValue, row }) => {
          const data = getValue();
          const messageType = row.original.messageType;
          return formatPreviewData(data, messageType);
        },
        size: 300,
      }),
      columnHelper.accessor('timestamp', {
        header: 'Timestamp',
        cell: ({ getValue }) => (
          <div className={colors.textMuted}>
            {formatTimestamp(getValue())}
          </div>
        ),
        size: 120,
      }),
    ],
    [colors]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (websocketMessages.length === 0) {
    return (
      <ScrollArea className="h-full min-h-0 p-4">
        <div className={`text-sm ${colors.textMuted}`}>
          No WebSocket messages available for this connection. Messages will
          appear here when the WebSocket connection sends or receives data.
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
                      className={`text-left p-2 font-medium ${colors.textColor}`}
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
                  className={`border-b cursor-pointer ${colors.borderColor} ${
                    colors.hoverBg
                  } ${
                    selectedMessageId === row.original.id
                      ? colors.secondaryBg
                      : ''
                  }`}
                  onClick={() => setSelectedMessageId(row.original.id)}
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
        <div className={`border-t ${colors.borderColor} ${colors.secondaryBg}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-sm font-medium ${colors.textColor}`}>
                Message Details
              </h4>
              <button
                onClick={() => setSelectedMessageId(null)}
                className={`text-sm ${colors.textMuted} hover:${colors.textAccent1}`}
              >
                Close
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={colors.textMuted}>Type: </span>
                  <span
                    className={getMessageTypeColor(selectedMessage.direction)}
                  >
                    {selectedMessage.direction}
                  </span>
                </div>
                <div>
                  <span className={colors.textMuted}>Message Type: </span>
                  <span className={`${colors.textAccent1} capitalize`}>
                    {selectedMessage.messageType}
                  </span>
                </div>
                <div>
                  <span className={colors.textMuted}>Timestamp: </span>
                  <span className={colors.textColor}>
                    {formatTimestamp(selectedMessage.timestamp)}
                  </span>
                </div>
              </div>
              <div>
                <span className={`${colors.textMuted} text-sm`}>
                  Content:
                </span>
                <div className="mt-2 max-h-96 overflow-y-auto">
                  {formatData(
                    selectedMessage.data,
                    selectedMessage.messageType
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
