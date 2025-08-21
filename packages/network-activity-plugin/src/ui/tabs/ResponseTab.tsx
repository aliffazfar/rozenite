import { useEffect, useRef } from 'react';
import { ScrollArea } from '../components/ScrollArea';
import { JsonTree } from '../components/JsonTree';
import { HttpNetworkEntry } from '../state/model';
import { Section } from '../components/Section';
import { KeyValueGrid } from '../components/KeyValueGrid';
import { CodeBlock } from '../components/CodeBlock';
import { useTheme } from '../theme/ThemeContext';
import { cn } from '../utils/cn';

export type ResponseTabProps = {
  selectedRequest: HttpNetworkEntry;
  onRequestResponseBody: (requestId: string) => void;
};

const renderResponseBodySection = (children: React.ReactNode) => {
  return (
    <Section title="Response Body" collapsible={false}>
      <div className="space-y-4">{children}</div>
    </Section>
  );
};

export const ResponseTab = ({
  selectedRequest,
  onRequestResponseBody,
}: ResponseTabProps) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const onRequestResponseBodyRef = useRef(onRequestResponseBody);

  useEffect(() => {
    onRequestResponseBodyRef.current = onRequestResponseBody;
  }, [onRequestResponseBody]);

  useEffect(() => {
    if (onRequestResponseBodyRef.current) {
      onRequestResponseBodyRef.current(selectedRequest.id);
    }
  }, [selectedRequest.id]);

  const responseBody = selectedRequest.response?.body;

  const renderResponseBody = () => {
    if (!responseBody || responseBody.data === null) {
      return (
        <div className={cn('text-sm', colors.textColor)}>
          No response body available for this request
        </div>
      );
    }

    const { type, data } = responseBody;

    const contentTypeGrid = (
      <KeyValueGrid
        items={[
          {
            key: 'Content-Type',
            value: type,
            valueClassName: colors.textColor,
          },
        ]}
      />
    );

    if (type === 'application/json') {
      let bodyContent;

      try {
        const jsonData = JSON.parse(data);

        bodyContent = (
          <CodeBlock>
            <JsonTree data={jsonData} />
          </CodeBlock>
        );
      } catch {
        bodyContent = (
          <>
            <CodeBlock>{data}</CodeBlock>
            <div className="text-xs text-gray-500 mt-1">
              ⚠️ Failed to parse as JSON, showing as raw text
            </div>
          </>
        );
      }

      return renderResponseBodySection(
        <>
          {contentTypeGrid}
          {bodyContent}
        </>
      );
    }

    if (
      type.startsWith('text/') ||
      type === 'application/xml' ||
      type === 'application/javascript'
    ) {
      return renderResponseBodySection(
        <>
          {contentTypeGrid}
          <CodeBlock>{data}</CodeBlock>
        </>
      );
    }

    return renderResponseBodySection(
      <>
        {contentTypeGrid}
        <div className={cn('text-sm', colors.textColor)}>
          Binary content not shown - {data.length} bytes
        </div>
      </>
    );
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4">{renderResponseBody()}</div>
    </ScrollArea>
  );
};
