import { Button, ScrollArea, Stack, Text } from '@mantine/core';

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
        <Stack gap="xs">
          {items.map((locale) => {
            const isActive = locale === selected;
            const label = locale === allKey ? 'All locales' : locale;
            return (
              <Button
                key={locale}
                onClick={() => onSelect(locale)}
                variant={isActive ? 'filled' : 'light'}
                color={isActive ? 'blue' : 'gray'}
                radius="md"
                size="sm"
                fullWidth
                justify="flex-start"
              >
                {label}
              </Button>
            );
          })}
        </Stack>
      </Stack>
    </ScrollArea>
  );
}

export const DEFAULT_LOCALE = allKey;
