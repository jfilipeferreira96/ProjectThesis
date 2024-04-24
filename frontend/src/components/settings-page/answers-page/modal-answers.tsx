import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Text, Badge, Title } from '@mantine/core';
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
    console.log(quizz)
    console.log(answers, selectedUser)
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
        <Modal opened={isOpen} onClose={onClose} size="100%" title={`Review Quizz: ${quizz?.label} - Student: ${selectedUser?.fullname} (${selectedUser?.email})`} className={classes.modal}>

            {quizz?.questions && quizz?.questions.length > 0 &&
                quizz?.questions.map((question: IQuestion, index) => {
                    return (
                        <div style={{marginTop: "2rem"}} key={index}>
                            <Quizz
                                questions={[question]}
                                reviewMode
                                questionNumber={{total: quizz?.questions.length, atual: index}}
                            /> 
                        </div>
                    )
                })

            }
            {/* <Quizz questions={quizz?.questions} reviewMode /> */}

        </Modal>

    );
}

export default AnswersModal;
