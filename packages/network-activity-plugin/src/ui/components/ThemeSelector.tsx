import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { useTheme } from '../theme/ThemeContext';
import { themes } from '../theme/themeConfig';
import { Palette } from 'lucide-react';
import { cn } from '../utils/cn';

export function ThemeSelector() {
  const { theme, themeName, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-md text-gray-400 hover:text-blue-400">
          <Palette size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(theme.components.dropdown.content)}
      >
        <DropdownMenuRadioGroup
          value={themeName}
          onValueChange={(value: any) => setTheme(value)}
        >
          {Object.entries(themes).map(([key, themeObject]) => (
            <DropdownMenuRadioItem
              key={key}
              value={key}
              className={cn(theme.components.dropdown.item)}
            >
              {themeObject.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}