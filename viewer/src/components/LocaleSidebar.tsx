import { ScrollArea, Stack, Text, UnstyledButton } from '@mantine/core';

interface LocaleSidebarProps {
  locales: string[];
  selected: string;
  onSelect: (locale: string) => void;
}

const allKey = 'all';

export function LocaleSidebar({ locales, selected, onSelect }: LocaleSidebarProps) {
  const items = [allKey, ...locales];

  return (
    <ScrollArea h="100%" type="auto" p="sm">
      <Stack gap="xs">
        <Text fw={600} size="sm" c="dimmed">
          Locales
        </Text>
        {items.map((locale) => {
          const isActive = locale === selected;
          const label = locale === allKey ? 'All locales' : locale;
          return (
            <UnstyledButton
              key={locale}
              onClick={() => onSelect(locale)}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--mantine-color-blue-light)',
                      color: 'var(--mantine-color-blue-9)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: 600,
                    }
                  : {
                      padding: '8px 12px',
                      borderRadius: '8px',
                    }
              }
            >
              {label}
            </UnstyledButton>
          );
        })}
      </Stack>
    </ScrollArea>
  );
}

export const DEFAULT_LOCALE = allKey;
