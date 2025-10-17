import { Paper, ScrollArea, Table, Text } from '@mantine/core';
import type { RecommendationEntry } from '@/types/manifest';
import { StatusBadge } from './StatusBadge';

interface RecommendationTableProps {
  entries: RecommendationEntry[];
  emptyMessage: string;
}

export function RecommendationTable({ entries, emptyMessage }: RecommendationTableProps) {
  return (
    <Paper withBorder shadow="xs" p="sm">
      <ScrollArea>
        <Table highlightOnHover striped stickyHeader horizontalSpacing="md" verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Status</Table.Th>
              <Table.Th>Selector / Item</Table.Th>
              <Table.Th>Recommendation</Table.Th>
              <Table.Th>Rationale</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {entries.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text c="dimmed" size="sm" ta="center">
                    {emptyMessage}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              entries.map((entry) => (
                <Table.Tr key={entry.id}>
                  <Table.Td>
                    <StatusBadge status={entry.status} />
                  </Table.Td>
                  <Table.Td fw={500}>{entry.target}</Table.Td>
                  <Table.Td>{entry.recommendation}</Table.Td>
                  <Table.Td c="dimmed">{entry.rationale}</Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
