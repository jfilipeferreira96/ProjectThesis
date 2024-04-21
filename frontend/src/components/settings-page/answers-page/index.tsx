import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { Text, Badge, Button, Group, Center, Grid, Title, TextInput, Flex, Loader, Table, ActionIcon, Tabs, rem, Paper, Tooltip, Radio, List, CheckIcon, Textarea, Modal, Select } from "@mantine/core";
import { IconDatabaseOff } from "@tabler/icons-react";
import { getAnswers } from "@/services/quizz.service";
import { notifications } from "@mantine/notifications";

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

interface AnswersProps {
  quizzes?: {label: string, value: string}[];
}

const Answers: React.FC<AnswersProps> = (props: AnswersProps) => {
  const { quizzes } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuizz, setSelectedQuizz] = useState<string | null>(quizzes && quizzes.length > 0 ? quizzes[0].value : "");
  console.log("selected", selectedQuizz);
  const [state, setState] = useState({
    id: "",
    rows: [],
    type: undefined,
    title: "",
    description: "",
    status: 0,
  });

  useEffect(() => {
    const fetchAnswers = async (quizId: string) => {
      try {
        const response = await getAnswers(quizId);
        console.log(response);
        if (response.status === true) {
          //setQuizzData(response.quiz.questions);
        }

        if (response.status === false) {
          notifications.show({
            title: "Error",
            message: response.message,
            color: "red",
          });
        }
      } catch (error) {
        console.error("Error fetching quizz data:", error);
        notifications.show({
          title: "Error",
          message: "Something went wrong",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (quizzes && quizzes?.length > 0 && selectedQuizz) {
      fetchAnswers(selectedQuizz);
    }
  }, [selectedQuizz]);

  const createRows = (data: DataItem[]) => {
    return data.map((item: DataItem) => (
      <Table.Tr key={item.name}>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Table.Td>

        <Table.Td>
          <Group gap={0} justify="center"></Group>
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
    <Grid.Col span={{ md: 10.5, sm: 10, xs: 12, lg: 11 }}>
      <Paper withBorder shadow="md" p={30} mt={10} radius="md" style={{ flex: 1 }}>
        <Title order={2}>Answers</Title>

        <Text c="dimmed" fw={500}>
          Check your students answers and give them a score
        </Text>

        <Select checkIconPosition="left" data={quizzes} pb={20} c="dimmed" label="Selected Quizz" placeholder="Pick quizz" defaultValue={selectedQuizz} onChange={(value: string | null) => setSelectedQuizz(value)} />

        <StyledTableContainer minWidth={800}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>State</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            {rows.length > 0 && <Table.Tbody>{rows}</Table.Tbody>}
          </Table>

          {rows.length === 0 && (
            <Flex justify={"center"} mt="xl" display="block">
              <ActionIcon size="xl" disabled aria-label="There are no available answers">
                <IconDatabaseOff />
              </ActionIcon>
              <Text c="dimmed" size="sm" ta="center" mt={5}>
                {"There are no available answers"}
              </Text>
            </Flex>
          )}
        </StyledTableContainer>
      </Paper>
    </Grid.Col>
  );
};

export default Answers;
