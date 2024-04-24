import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Text, Badge, Title, Grid } from '@mantine/core';
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
    const [formattedAnswers, setFormattedAnswers] = useState([]);
    const { quizz, selectedUser, answers, isOpen, onClose } = props;
 
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

    return (
        <Modal opened={isOpen} onClose={onClose} size="100%" >
            
            
            <Title size={"h3"} ml={5}>
                {`Review Quizz: ${quizz?.label} - Student: ${selectedUser?.fullname} (${selectedUser?.email})`}
            </Title>
            
            {quizz?.questions && quizz?.questions.length > 0 &&
                quizz?.questions.map((question: IQuestion, index) => {
                    return (
                        <div style={{marginTop: "2rem"}} key={index}>
                            <Quizz
                                questions={[question]}
                                answer={answers && question && Array.isArray(answers) && answers.find(ans => ans._id === question._id)}
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
