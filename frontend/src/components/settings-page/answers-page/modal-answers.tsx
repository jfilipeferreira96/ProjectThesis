import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Text, Badge, Title, Grid, NumberInput } from '@mantine/core';
import { useState } from 'react';
import { IAnswer, IQuestion, QuestionType, QuizzData } from '@/services/quizz.service';
import Quizz from '@/components/quizz';
import { User } from '@/providers/SessionProvider';
import classes from "./modal.module.scss";


interface ModalProps{
    selectedUser?: User | null;
    answers: IAnswer | undefined;
    isOpen: boolean;
    onClose: () => void;
    quizz?: { label: string, value: string, questions: IQuestion[] } | undefined
}

function AnswersModal(props: ModalProps) {
    //const [opened, { close, open }] = useDisclosure(false);
    const { quizz, selectedUser, answers, isOpen, onClose } = props;
    const [intialAnswers, setInitialAnswers] = useState<IAnswer[] | undefined>(Array.isArray(answers) ? answers : undefined);
    const [modifiedAnswers, setModifiedAnswers] = useState<IAnswer[] | undefined>(Array.isArray(answers) ? answers : undefined);

   /*  const checkAllAnswered = () => {
        for (const answer of formattedAnswers)
        {
            if (answer.pontuation === null)
            {
                return false;
            }
        }
        return true; 
    }; */

    const onChangePontuation = (answerId: string, pontuation: number) => {
        let newAnswers = Array.isArray(modifiedAnswers) ? modifiedAnswers.map((answer: IAnswer) =>
        {
            if (answer._id === answerId)
            {
                return { ...answer, pontuation: pontuation };
            }
            return answer;
        }) : [];

        setModifiedAnswers(newAnswers);
    }


    return (
        <Modal opened={isOpen} onClose={onClose} size="100%" >
            
            <Group justify="space-between" align="end">

                <Title size={"h3"} ml={5}>
                    {`Review Quizz: ${quizz?.label} - Student: ${selectedUser?.fullname} (${selectedUser?.email})`}
                </Title>
                <Title size={"h3"} ml={5}>
                    Total pontuation: 0
                </Title>
                
            </Group>
            
            {quizz?.questions && quizz?.questions.length > 0 &&
                quizz?.questions.map((question: IQuestion, index) => {
                    return (
                        <div style={{marginTop: "2rem"}} key={index}>
                            <Quizz
                                questions={[question]}
                                answer={answers && question && Array.isArray(answers) && answers.find(ans => ans._id === question._id)}
                                setAnswerPontuation={onChangePontuation}
                                reviewMode
                                questionNumber={{total: quizz?.questions.length, atual: index}}
                            /> 
                        </div>
                    )
                })

            }
        </Modal>

    );
}

export default AnswersModal;
