import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group, Text, Badge, Title, Grid, NumberInput, Center } from "@mantine/core";
import { useEffect, useState } from "react";
import { editQuizzPontuation, EvalutionType, IAnswer, IQuestion, QuestionType, QuizzData } from "@/services/quizz.service";
import Quizz from "@/components/quizz";
import { User } from "@/providers/SessionProvider";
import classes from "./modal.module.scss";
import ThreeDButton from "@/components/3dbutton";
import { notifications } from "@mantine/notifications";

interface ModalProps {
  selectedUser?: User | null;
  answers: IAnswer | undefined;
  isOpen: boolean;
  onClose: (shouldRefresh?: boolean) => void;
  quizz?: { label: string; value: string; questions: IQuestion[]; evaluation: EvalutionType.Automatic | EvalutionType.Manual } | undefined;
}

function AnswersModal(props: ModalProps) {
  //const [opened, { close, open }] = useDisclosure(false);
  const { quizz, selectedUser, answers, isOpen, onClose } = props;
  const [modifiedAnswers, setModifiedAnswers] = useState<IAnswer[] | undefined>(undefined);
  const totalPontuation = modifiedAnswers?.reduce((total, ans) => {
    if (ans.pontuation !== undefined) {
      return total + ans.pontuation;
    } else {
      return total;
    }
  }, 0);

  const SendAndSavePontuation = async () => {
    if (!selectedUser?._id || !quizz?.value || !modifiedAnswers) {
      return;
    }

    try {
      const response = await editQuizzPontuation(selectedUser?._id, quizz?.value, modifiedAnswers);
      if (response.status) {
      //mesagem de sucesso
        notifications.show({
          title: "Success",
          message: "",
          color: "green",
        });
        
        onClose(true);
      }
      //apresentaçao da mensagem de erro
      else {
        notifications.show({
          title: "Success",
          message: response.message,
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong",
        color: "red",
      });
    }
  };

  const onSave = () => {
    if (checkAllAnswered()) {
      //chama a funçao async que guarda
      SendAndSavePontuation();
    } else {
      notifications.show({
        title: "Error",
        message: "There are answers without pontuation!",
        color: "red",
      });
    }
  };

  const checkAllAnswered = () => {
    if (!modifiedAnswers) {
      return;
    }

    for (const answer of modifiedAnswers) {
      if (answer.pontuation === null || answer.pontuation === undefined) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setModifiedAnswers(Array.isArray(answers) ? answers : undefined);
  }, [answers]);

  const onChangePontuation = (answerId: string, pontuation: number | undefined) => {
    let newAnswers = Array.isArray(modifiedAnswers)
      ? modifiedAnswers.map((answer: IAnswer) => {
          if (answer._id === answerId) {
            return { ...answer, pontuation: pontuation };
          }
          return answer;
        })
      : [];

    setModifiedAnswers(newAnswers);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} size="100%">
      <Group justify="space-between" align="end">
        <Title size={"h3"} ml={5}>
          {`Review Quizz: ${quizz?.label} - Student: ${selectedUser?.fullname} (${selectedUser?.email})`}
        </Title>
        <Title size={"h3"} ml={5}>
          Total pontuation: {totalPontuation ?? 0}
        </Title>
      </Group>

      {quizz?.questions &&
        quizz?.questions.length > 0 &&
        quizz?.questions.map((question: IQuestion, index) => {
          return (
            <div style={{ marginTop: "2rem" }} key={index}>
              <Quizz
                questions={[question]}
                answer={modifiedAnswers && question && Array.isArray(modifiedAnswers) && modifiedAnswers.find((ans) => ans._id === question._id)}
                setAnswerPontuation={onChangePontuation}
                reviewMode
                questionNumber={{ total: quizz?.questions.length, atual: index }}
                user={selectedUser}
                isAutomatic={quizz?.evaluation === EvalutionType.Automatic}
              />
            </div>
          );
        })}

      <Grid justify="center" mt={20} align="center">
        <Grid.Col span={{ md: 3, sm: 6, xs: 12, lg: 3 }}>
          <Center>
            <Title size={"h3"}>Total pontuation: {totalPontuation ?? 0}</Title>
          </Center>
          <ThreeDButton mt="md" color="blue" onClick={onSave}>
            Save
          </ThreeDButton>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}

export default AnswersModal;
