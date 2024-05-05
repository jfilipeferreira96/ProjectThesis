import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { User, useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { Text, Badge, Button, Group, Center, Grid, Title, TextInput, Flex, Loader, Table, ActionIcon, Tabs, rem, Paper, Tooltip, Radio, List, CheckIcon, Textarea, Modal, Select, Avatar } from "@mantine/core";
import { IconDatabaseOff, IconEye, IconEyeCheck } from "@tabler/icons-react";
import { EvalutionType, getAnswers, IAnswer, IQuestion } from "@/services/quizz.service";
import { notifications } from "@mantine/notifications";
import AnswersModal from "./modal-answers";

const StyledTableContainer = styled(Table.ScrollContainer)`
  text-align: center;
  th,
  tr {
    text-align: center;
  }
`;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ContentContainer = styled.div`
  text-align: center;
`;
type DataItem = {
  score: number;
  user: User;
  answers: IAnswer;
  reviewed: boolean;
};

interface AnswersProps {
  quizzes?: { label: string; value: string; questions: IQuestion[]; evaluation: EvalutionType.Automatic | EvalutionType.Manual }[];
}

const Answers: React.FC<AnswersProps> = (props: AnswersProps) => {
  const { quizzes } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuizz, setSelectedQuizz] = useState<string | null>(quizzes && quizzes.length > 0 ? quizzes[0].value : null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [state, setState] = useState<DataItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [fetchFlag, setFetchFlag] = useState<number>(0);

  const refreshTable = () => {
    setFetchFlag(fetchFlag + 1);
  };

  useEffect(() => {
    const fetchAnswers = async (quizId: string) => {
      try {
        const response = await getAnswers(quizId);
        
        if (response.status === true && response.data) {
          setState(response.data);
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

    if (selectedQuizz === null) {
      setIsLoading(false);
    }
  }, [selectedQuizz, fetchFlag]);

  const createRows = (data: DataItem[]) => {
    return data.map((item: DataItem) => (
      <Table.Tr key={item.user._id}>
        <Table.Td>
          <Group gap="sm" justify="center">
            <Avatar size={30} src={item.user.avatar} radius={30} />
            <Text fz="sm" fw={500}>
              {item.user.fullname}
            </Text>
          </Group>
        </Table.Td>

        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.user.email}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.user.studentId ? item.user.studentId : "-"}
          </Text>
        </Table.Td>

        <Table.Td>
          <Text fz="sm" fw={500}>
            {item.score}
          </Text>
        </Table.Td>

        <Table.Td>
          <>
            {item.reviewed === true ? (
              <Badge variant="filled" size="md" color={"green"} style={{ minWidth: "110px" }}>
                Already reviewed
              </Badge>
            ) : (
              <Badge variant="filled" size="md" color={"red"} style={{ minWidth: "110px" }}>
                Pending review
              </Badge>
            )}
          </>
        </Table.Td>

        <Table.Td>
          <Tooltip label={"Check and review answers"} withArrow position="top">
            <ActionIcon
              variant="subtle"
              color={item.reviewed === true ? "green" : "red"}
              onClick={() => {
                setSelectedUser(item.user);
                setIsOpen(true);
              }}
            >
              <IconEye style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    ));
  };

  const rows = createRows(state);

  const closeModal = (shouldRefreshTable: boolean = false) => {
    setSelectedUser(null);
    setIsOpen(false);

    if (shouldRefreshTable) {
      refreshTable();
    }
  };

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

        {selectedQuizz === null && (
          <CenteredDiv>
            <ContentContainer>
                <ActionIcon size="xl" disabled aria-label="There are no available quizzes">
                  <IconDatabaseOff />
                </ActionIcon>
              <Text c="dimmed" size="sm" ta="center" mt={5}>
                {"There are no available quizzes"}
              </Text>
            </ContentContainer>
          </CenteredDiv>
        )}
        
        {selectedQuizz !== null && (
          <>
            <Text c="dimmed" fw={500}>
              Review your students responses and assign scores accordingly. If the quiz is set to automatic, validation is not required.
            </Text>

            <Select
              checkIconPosition="left"
              data={quizzes}
              pb={20}
              c="dimmed"
              label="Selected Quizz"
              placeholder="Pick quizz"
              defaultValue={selectedQuizz}
              onChange={(value: string | null) => setSelectedQuizz(value)}
              allowDeselect={false}
            />

            <AnswersModal
              isOpen={isOpen}
              onClose={closeModal}
              selectedUser={selectedUser}
              answers={selectedUser ? state.find((s) => s.user._id === selectedUser._id)?.answers : undefined}
              quizz={quizzes?.find((q) => q.value === selectedQuizz)}
            />

            <StyledTableContainer minWidth={800}>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Student ID</Table.Th>
                    <Table.Th>Score</Table.Th>
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
          </>
        )}
      </Paper>
    </Grid.Col>
  );
};

export default Answers;
