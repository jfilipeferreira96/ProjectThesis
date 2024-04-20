import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { Text, Badge, Button, Group, Center, Grid, Title, TextInput, Flex, Loader, Table, ActionIcon, Tabs, rem, Paper, Tooltip, Radio, List, CheckIcon, Textarea, Modal, Select } from "@mantine/core";
import { IconDatabaseOff } from "@tabler/icons-react";

const StyledTableContainer = styled(Table.ScrollContainer)`
  text-align: center;
  th,
  tr {
    text-align: center;
  }
`;

type DataItem = {
  _id: string;
  name: string;
  questions: string[];
  status: number;
  startDate: string;
  endDate: string;
};

interface AnswersProps {}

const Answers: React.FC<AnswersProps> = (props: AnswersProps) => {
  const {} = props;
  const [isLoading, setIsLoading] = useState(false);

  const [state, setState] = useState({
    id: "",
    rows: [],
    type: undefined,
    title: "",
    description: "",
    status: 0,
  });

  const createRows = (data: DataItem[]) => {
    return data.map((item: DataItem) => (
      <Table.Tr key={item.name}>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Table.Td>

        <Table.Td>
          <Group gap={0} justify="center">
         
          </Group>
        </Table.Td>
      </Table.Tr>
    ));
  };

  const rows = createRows(state.rows);

  if (isLoading) {
    return (
      <Center mt={100} mih={"50vh"}>
        <Loader color="blue" />
      </Center>
    );
  }

  return (
    <Paper withBorder shadow="md" p={30} mt={10} radius="md" style={{ flex: 1 }}>
      <Title order={2}>Quizzes</Title>
      {rows.length === 0 && (
        <Text c="dimmed" fw={500}>
          To get started, add a
          <Text span c="red" fw={700} inherit>
            quizz
          </Text>
          so your students can participate
        </Text>
      )}
      <StyledTableContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>No. Questions</Table.Th>
              <Table.Th>Start Date</Table.Th>
              <Table.Th>End Date</Table.Th>
              <Table.Th>State</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          {rows.length > 0 && <Table.Tbody>{rows}</Table.Tbody>}
        </Table>

        {rows.length === 0 && (
          <Flex justify={"center"} mt="xl" display="block">
            <ActionIcon size="xl" disabled aria-label="No records found">
              <IconDatabaseOff />
            </ActionIcon>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
              {"No records found"}
            </Text>
          </Flex>
        )}
      </StyledTableContainer>
    </Paper>
  );
};

export default Answers;
