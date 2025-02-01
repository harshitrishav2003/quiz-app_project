
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuizApp.css'; 

const QuizApp = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(600);
  const [timerInterval, setTimerInterval] = useState(null);
  const [submissionTime, setSubmissionTime] = useState(null);

  useEffect(() => {
    if (isQuizStarted) {
      axios
        .get('http://localhost:3001/quiz-data')
        .then((response) => {
          setQuizData(response.data.questions);
        })
        .catch((error) => {
          console.error('Error fetching quiz data:', error);
        });

      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            clearInterval(interval);
            setIsQuizCompleted(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      setTimerInterval(interval);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isQuizStarted]);

  const handleAnswerSelect = (selectedOption) => {
    const currentQuestion = quizData[currentQuestionIndex];
    if (selectedOption.is_correct) {
      setScore(score + 1);
    }
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const startQuiz = () => {
    setIsQuizStarted(true);
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimer(600);
    setIsQuizStarted(false);
    setIsQuizCompleted(false);
    clearInterval(timerInterval);
    setTimerInterval(null);
    setSubmissionTime(null);
  };

  const handleSubmitQuiz = () => {
    clearInterval(timerInterval);
    setIsQuizCompleted(true);
    setSubmissionTime(new Date());
  };

  const skipQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatSubmissionTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const isLowTime = timer <= 60;

  return (
    <div className="quiz-container">
      {!isQuizStarted ? (
        <div className="start-quiz">
          <h1>Welcome to the Quiz</h1>
          <p>Test your knowledge on various topics.</p>
          <button className="btn start-btn" onClick={startQuiz}>Start Quiz</button>
        </div>
      ) : (
        <div className="quiz-content">
          <div className={`timer ${isLowTime ? 'low-time' : ''}`}>
            {formatTime(timer)}
          </div>
          
          {isQuizCompleted ? (
            <div className="quiz-completed">
              <h2>Quiz Completed!</h2>
              <p>Your total score: {score} / {quizData.length}</p>
              <p>You submitted the quiz at {submissionTime && formatSubmissionTime(submissionTime)}</p>
              <button className="btn restart-btn" onClick={restartQuiz}>Restart Quiz</button>
            </div>
          ) : (
            <div className="quiz-question">
              {quizData.length > 0 && currentQuestionIndex < quizData.length ? (
                <div>
                  <div className="question-header">
                  <h2 className="question-text">Question {currentQuestionIndex + 1}</h2>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <h3>{quizData[currentQuestionIndex].description}</h3>
                  {quizData[currentQuestionIndex].options && quizData[currentQuestionIndex].options.length > 0 ? (
                    <div className="options-container">
                      {quizData[currentQuestionIndex].options.map((option) => (
                        <button
                          className="btn option-btn"
                          key={option.id}
                          onClick={() => handleAnswerSelect(option)}
                        >
                          {option.description}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p>No options available for this question.</p>
                  )}
                  {currentQuestionIndex === quizData.length - 1 ? (
                    <button className="btn submit-btn" onClick={handleSubmitQuiz}>
                      Submit Quiz
                    </button>
                  ) : (
                    <button className="btn skip-btn" onClick={skipQuestion}>
                      Skip Question
                    </button>
                  )}
                </div>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizApp;
