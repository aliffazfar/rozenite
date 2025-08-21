export type ThemeName = 'rozenite' | 'classic';

export const themes = {
  rozenite: {
    name: 'rozenite',
    colors: {
      primaryBg: 'bg-gray-900',
      secondaryBg: 'bg-gray-800',
      tertiaryBg: 'bg-gray-700',
      textColor: 'text-gray-100',
      textMuted: 'text-gray-400',
      textSubtle: 'text-gray-300',
      textAccent1: 'text-blue-400',
      textAccent2: 'text-green-400',
      textAccent3: 'text-purple-400',
      borderColor: 'border-gray-700',
      hoverBg: 'hover:bg-gray-700',
      selectedBg: 'bg-blue-900/30',
      selectedText: 'text-blue-300',
      dataContainerBg: 'bg-gray-800',
      jsonTree: {
        base00: 'transparent',
        base01: '#374151', // bg-gray-700
        base02: '#4b5563', // bg-gray-600
        base03: '#6b7280', // text-gray-500
        base04: '#9ca3af', // text-gray-400
        base05: '#d1d5db', // text-gray-300
        base06: '#e5e7eb', // text-gray-200
        base07: '#f9fafb', // text-gray-100
        base08: '#ef4444', // text-red-500
        base09: '#f59e0b', // text-yellow-500
        base0A: '#10b981', // text-green-500
        base0B: '#3b82f6', // text-blue-500
        base0C: '#06b6d4', // text-cyan-500
        base0D: '#8b5cf6', // text-purple-500
        base0E: '#ec4899', // text-pink-500
        base0F: '#f97316', // text-orange-500
      },
    },
    components: {
      inspectorView: {
        main: 'bg-gray-900 text-gray-100',
      },
      toolbar: {
        main: 'bg-gray-800 border-gray-700',
      },
      filterBar: {
        main: 'bg-gray-800 border-gray-700',
        input:
          'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400',
      },
      requestList: {
        header: 'bg-gray-800 border-b border-gray-700',
        headerText: 'text-gray-400',
        headerSortable: 'cursor-pointer select-none hover:bg-gray-700',
        sortIcon: 'text-gray-500',
        row: 'hover:bg-gray-800 border-b border-gray-800',
        selectedRow: 'bg-blue-900/30',
        cell: 'text-gray-300',
      },
      sidePanel: {
        main: 'bg-gray-900',
        header: 'bg-gray-800 border-gray-700',
        headerText: 'text-gray-100',
        tabTriggerActive: 'data-[state=active]:bg-gray-700',
        tabTriggerHover: 'hover:bg-gray-700',
        tabTriggerText: 'text-gray-300',
        tabsList: 'bg-gray-800 border-gray-700',
      },
      dropdown: {
        content: 'bg-gray-800 border-gray-700 text-gray-100',
        item: 'text-gray-300 hover:bg-gray-700 hover:text-gray-100',
        activeItem: 'bg-blue-600 text-white',
        trigger: 'text-gray-300 hover:text-gray-100 hover:bg-gray-700',
        activeTrigger:
          'bg-blue-600/20 border border-blue-500/50 text-blue-300 hover:bg-blue-600/30',
      },
      codeBlock: {
        main: 'bg-gray-800 border-gray-700 text-gray-300',
      },
    },
  },
  classic: {
    name: 'classic',
    colors: {
      primaryBg: '#202020',
      secondaryBg: '#282828',
      tertiaryBg: '#3d3d3c',
      textColor: 'text-gray-100',
      textMuted: 'text-gray-400',
      textSubtle: 'text-gray-300',
      textAccent1: 'text-blue-400',
      textAccent2: 'text-green-400',
      textAccent3: 'text-purple-400',
      borderColor: 'border-gray-700',
      hoverBg: 'hover:bg-[#3d3d3c]',
      selectedBg: 'bg-blue-900/30',
      selectedText: 'text-blue-300',
      dataContainerBg: '#3d3d3c',
      jsonTree: {
        base00: 'transparent',
        base01: '#282828',
        base02: '#3d3d3c',
        base03: '#E0E0E0',
        base04: '#A0A0A0',
        base05: '#9CDCFE',
        base06: '#CE9178',
        base07: '#569CD6',
        base08: '#F44747',
        base09: '#D7BA7D',
        base0A: '#6A9955',
        base0B: '#569CD6',
        base0C: '#4EC9B0',
        base0D: '#C586C0',
        base0E: '#C586C0',
        base0F: '#F97316',
      },
    },
    components: {
      inspectorView: {
        main: 'bg-[#202020] text-gray-100',
      },
      toolbar: {
        main: 'bg-[#282828] border-gray-700',
      },
      filterBar: {
        main: 'bg-[#282828] border-gray-700',
        input:
          'bg-[#3d3d3c] border-gray-600 text-gray-100 placeholder:text-gray-400',
      },
      requestList: {
        header: 'bg-[#282828] border-b border-gray-700',
        headerText: 'text-gray-400',
        headerSortable: 'cursor-pointer select-none hover:bg-[#3d3d3c]',
        sortIcon: 'text-gray-500',
        row: 'hover:bg-[#3d3d3c] border-b border-[#202020]',
        selectedRow: 'bg-[#3d3d3c]',
        cell: 'text-gray-300',
      },
      sidePanel: {
        main: 'bg-[#202020]',
        header: 'bg-[#282828] border-gray-700',
        headerText: 'text-gray-100',
        tabTriggerActive:
          'data-[state=active]:bg-[#3d3d3c] data-[state=active]:text-gray-100',
        tabTriggerHover: 'hover:bg-[#3d3d3c]',
        tabTriggerText: 'text-gray-300',
        tabsList: 'bg-[#282828] border-gray-700',
      },
      dropdown: {
        content: 'bg-[#282828] border-gray-700 text-gray-100',
        item: 'text-gray-300 hover:bg-[#3d3d3c] hover:text-gray-100',
        activeItem: 'bg-[#3d3d3c] text-white',
        trigger: 'text-gray-300 hover:text-gray-100 hover:bg-[#3d3d3c]',
        activeTrigger:
          'bg-[#3d3d3c]/20 border border-[#282828]/50 text-white hover:bg-[#3d3d3c]/30',
      },
      codeBlock: {
        main: 'bg-[#3d3d3c] border-gray-700 text-gray-300',
      },
    },
  },
};
