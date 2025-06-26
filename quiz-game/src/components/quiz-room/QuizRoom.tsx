import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import socket from '../../socket';

interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface Result {
    nickName: string;
    correct: boolean;
    timeTaken: number;
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

    const [results, setResults] = useState<Result[] | null>(null)

    useEffect(() => {
        console.log("Setting up socket listener for next-question");
        socket.on('next-question', (question: Question) => {
            console.log(question);
            setCurrentQuestion(question);
            setSelectedOption('');
            setSubmitted(false);
            setTimeLeft(10);
            setAnswerTime(null);
            setResults(null);
        });

        socket.on('show-results', (scores: Result[]) => {
            console.log('Results received:', scores);
            setResults(scores);
        })

        return () => {
            socket.off('next-question');
            socket.off('show-results');
        }
    }, [])

    useEffect(() => {
        if (!submitted && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            }
        }
    }, [submitted, timeLeft])

    // useEffect(() => {
    //     socket.on('show-results', (scores: { nickName: string; correct: boolean; timeTaken: number }[]) => {
    //         console.log('Results:', scores);
    //         alert(
    //             scores.map((s) => {
    //                 `${s.nickName} — ${s.correct ? '✅ Correct' : '❌ Wrong'} — ${s.timeTaken}s`
    //             })
    //                 .join('\n')
    //         );
    //     })

    //     return () => {
    //         socket.off('show-results');
    //     };
    // }, [])


    const handleSubmit = () => {
        if (!selectedOption || !roomCode || submitted) return;

        const timeTaken = 10 - timeLeft;
        setAnswerTime(timeTaken);
        setSubmitted(true);

        socket.emit('submit-answer', {
            roomCode,
            nickName,
            answer: selectedOption,
            timeTaken
        })
    }

    if (!currentQuestion) return <p style={{ color: 'red' }}>Waiting for question...</p>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 px-4 text-white">
            <h2 className="text-2xl font-bold mb-6">Room: {roomCode}</h2>
            <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>

            <div className="mb-4 text-lg font-semibold">Time Left: {timeLeft}s</div>

            <div className="grid gap-4 w-full max-w-md">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedOption(option)}
                        disabled={submitted}
                        className={`py-3 px-4 rounded-xl text-left border-2 transition-all ${selectedOption === option ? 'bg-green-500 border-green-600' : 'bg-white/10 border-white/20'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {!submitted && (
                <button
                    onClick={handleSubmit}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
                >
                    Submit Answer
                </button>
            )}

            {submitted && <p className="mt-4 text-white/70">Answer submitted in {answerTime}s. Waiting for others...</p>}

            {results && (
                <div className="mt-6 bg-white/10 p-4 rounded-xl w-full max-w-md text-center">
                    <h3 className="text-xl mb-2 font-semibold">Results</h3>
                    <ul className="space-y-2">
                        {results.map((r, i) => (
                            <li key={i} className={`py-2 rounded ${r.correct ? 'text-green-400' : 'text-red-400'}`}>
                                {r.nickName}: {r.correct ? '✅ Correct' : '❌ Wrong'} — {r.timeTaken}s
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-sm text-white/50">Next question coming soon...</p>
                </div>
            )}
        </div>
    )
}

export default QuizRoom