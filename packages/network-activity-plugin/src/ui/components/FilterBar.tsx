import { Input } from './Input';
import { Button } from './Button';
import { X, Filter, ChevronDown } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './DropdownMenu';

export type FilterState = {
  text: string;
  types: Set<'http' | 'websocket' | 'sse'>;
};

type FilterBarProps = {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
};

export const FilterBar = ({ filter, onFilterChange }: FilterBarProps) => {
  const { theme } = useTheme();
  const { filterBar, dropdown } = theme.components;

  const handleTextChange = (text: string) => {
    onFilterChange({ ...filter, text });
  };

  const toggleType = (type: 'http' | 'websocket' | 'sse') => {
    const newTypes = new Set(filter.types);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    onFilterChange({ ...filter, types: newTypes });
  };

  const clearFilters = () => {
    onFilterChange({
      text: '',
      types: new Set(['http', 'websocket', 'sse']),
    });
  };

  const hasActiveFilters = filter.text !== '' || filter.types.size < 3;
  const isTypeFilterActive = filter.types.size < 3;

  const getTypeLabel = (type: 'http' | 'websocket' | 'sse') => {
    switch (type) {
      case 'http':
        return 'XHR';
      case 'websocket':
        return 'WS';
      case 'sse':
        return 'SSE';
    }
  };

  return (
    <div className={`flex items-center gap-2 p-2 border-b ${filterBar.main}`}>
      {/* Text Filter */}
      <div className="flex-1">
        <Input
          placeholder="Filter requests..."
          value={filter.text}
          onChange={(e) => handleTextChange(e.target.value)}
          className={`h-8 text-sm ${filterBar.input}`}
        />
      </div>

      {/* Request Type Filters Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-3 text-xs transition-all ${
              isTypeFilterActive
                ? dropdown.activeTrigger
                : dropdown.trigger
            }`}
          >
            <Filter className="h-3 w-3 mr-1" />
            Types
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          sideOffset={5}
          className={`space-y-1 ${dropdown.content}`}
        >
          {(['http', 'sse', 'websocket'] as const).map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => toggleType(type)}
              className={
                filter.types.has(type)
                  ? dropdown.activeItem
                  : dropdown.item
              }
            >
              {getTypeLabel(type)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
