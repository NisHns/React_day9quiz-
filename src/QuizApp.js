import React, { useState, useEffect, useRef } from 'react';

const QuizApp = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5);
    const [timerRunning, setTimerRunning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        fetchQuestions();
    });

    const fetchQuestions = async () => {
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10');
            const data = await response.json();
            setQuestions(data.results);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    useEffect(() => {
        if (timerRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
            }, 1000);
            return () => clearInterval(timerRef.current);
        }
    });

    useEffect(() => {
        if (timeLeft === 0) {
            handleNextQuestion();
        }
    });

    const handleAnswer = (selectedAnswer) => {
        if (selectedAnswer === getCurrentQuestion()?.correct_answer) {
            setScore((prevScore) => prevScore + 1);
        }
        handleNextQuestion();
    };

    const handleNextQuestion = () => {
        clearInterval(timerRef.current);
        setTimeLeft(5);
        setTimerRunning(false);
        if (currentQuestionIndex < (questions?.length || 0) - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            // End of quiz
            alert(`Quiz ended! Your final score is: ${score}/${questions.length}`);
        }
    };

    const handleSkipQuestion = () => {
        handleNextQuestion();
    };

    const getCurrentQuestion = () => {
        if (!questions || questions.length === 0 || currentQuestionIndex >= questions.length) {
            return null;
        }
        return questions[currentQuestionIndex];
    };

    const currentQuestion = getCurrentQuestion();

    if (!currentQuestion) {
        return <div>Loading...</div>; // or any other loading indicator
    }

    return (
        <div>
            <h2>{currentQuestion.question}</h2>
            <ul>
                {[...currentQuestion.incorrect_answers, currentQuestion.correct_answer].map((answer, index) => (
                    <li key={index}>
                        <button onClick={() => handleAnswer(answer)} disabled={timerRunning}>
                            {answer}
                        </button>
                    </li>
                ))}
            </ul>
            <p>Time left: {timeLeft} seconds</p>
            <button onClick={handleSkipQuestion} disabled={timerRunning}>
                Skip Question
            </button>
        </div>
    );
};

export default QuizApp;
