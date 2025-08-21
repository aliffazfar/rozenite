import { HTMLProps } from 'react';
import { cn } from '../utils/cn';
import { useTheme } from '../theme/ThemeContext';

export type CodeBlockProps = HTMLProps<HTMLPreElement>;

const baseClassNames =
  'text-sm font-mono whitespace-pre-wrap p-3 rounded overflow-x-auto wrap-anywhere';

export const CodeBlock = ({
  children,
  className,
  ...props
}: CodeBlockProps) => {
  const { theme } = useTheme();
  const { codeBlock } = theme.components;

  return (
    <pre
      className={cn(baseClassNames, codeBlock.main, className)}
      {...props}
    >
      {children}
    </pre>
  );
};
