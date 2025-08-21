import { JSONTree } from 'react-json-tree';
import { JsonTreeCopyableItem } from './JsonTreeCopyableItem';
import { useTheme } from '../theme/ThemeContext';

export type JsonTreeProps = {
  data: unknown;
  shouldExpandNodeInitially?: () => boolean;
};

export const JsonTree = ({
  data,
  shouldExpandNodeInitially = () => true,
}: JsonTreeProps) => {
  const { theme } = useTheme();
  const { jsonTree } = theme.colors;

  return (
    <JSONTree
      data={data}
      theme={{
        base00: 'transparent',
        base01: jsonTree.base01,
        base02: jsonTree.base02,
        base03: jsonTree.base03,
        base04: jsonTree.base04,
        base05: jsonTree.base05,
        base06: jsonTree.base06,
        base07: jsonTree.base07,
        base08: jsonTree.base08,
        base09: jsonTree.base09,
        base0A: jsonTree.base0A,
        base0B: jsonTree.base0B,
        base0C: jsonTree.base0C,
        base0D: jsonTree.base0D,
        base0E: jsonTree.base0E,
        base0F: jsonTree.base0F,
      }}
      invertTheme={false}
      shouldExpandNodeInitially={shouldExpandNodeInitially}
      // For objects and arrays
      getItemString={(_type, data, itemType, itemString) => (
        <JsonTreeCopyableItem
          getCopyableValue={() => JSON.stringify(data, null, 2)}
        >
          <>
            {itemType} {itemString}
          </>
        </JsonTreeCopyableItem>
      )}
      // For primitives
      valueRenderer={(valueAsString, value) => (
        <JsonTreeCopyableItem
          getCopyableValue={() => String(value)}
          className="ml-2"
        >
          {String(valueAsString)}
        </JsonTreeCopyableItem>
      )}
    />
  );
};
