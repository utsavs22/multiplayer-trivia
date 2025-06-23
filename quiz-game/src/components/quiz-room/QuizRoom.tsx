import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

function QuizRoom() {

    const { roomCode } = useParams();
    const location = useLocation();
    const { nickName } = location.state as { nickName: string };

    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const [answerTime, setAnswerTime] = useState<number | null>(null);

    useEffect(() => {
        socket.on('next-question', (question: Question) => {
            setCurrentQuestion(question);
            setSelectedOption('');
            setSubmitted(false);
            setTimeLeft(10);
            setAnswerTime(null);
        });

        return () => {
            socket.off('next-question');
        }
    }, [])

    useEffect(() => {
      if(!submitted && timeLeft > 0) {
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev-1);
            
        }, 1000);
      }
    
      return () => {
        second
      }
    }, [third])
    


    return (
        <div>QuizRoom</div>
    )
}

export default QuizRoom