import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function TypingTest() {
  const sentences = [
    'This is a typing test. Start typing now!',
    'Keep up the good work!',
    'You are doing great!',
    'Practice makes perfect!',
    'Almost there, keep going!',
    'You got this!',
    'Well done!'
  ];

  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [keyCount, setKeyCount] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    if (startTime && endTime) {
      const elapsedSeconds = (endTime - startTime) / 1000;
      const words = text.trim().split(' ');
      const numWords = words.length;
      const wpm = Math.floor(numWords / (elapsedSeconds / 60));
      setWpm(wpm);
    }
  }, [startTime, endTime, text]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime && !endTime) {
        const currentKeyCount = keyCount + input.length;
        if (currentKeyCount >= 5 * 60) {
          setEndTime(new Date());
          setInput('');
        }
        setKeyCount(currentKeyCount);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime, endTime, keyCount, input]);

  const handleChange = (e) => {
    const { value } = e.target;
    setInput(value);
    
  };

  const handleStart = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setText(sentences[randomIndex]);
    setInput('');
    setAccuracy(0);
    setStartTime(new Date());
    setEndTime(null);
    setKeyCount(0);
    inputRef.current.focus();
  };

  const handleFinish = () => {
    if (startTime) {
      setEndTime(new Date());
    }

    const words = text.trim().split(' ');
    const typedWords = input.trim().split(' ');

    let correctWords = 0;
    for (let i = 0; i < typedWords.length; i++) {
      if (typedWords[i] === words[i]) {
        correctWords++;
      }
    }

    const accuracyPercentage = (correctWords / words.length) * 100;
    setAccuracy(accuracyPercentage.toFixed(2));
  };

  const getWordClass = (index) => {
    const typedWords = input.trim().split(' ');
    const words = text.trim().split(' ');

    if (typedWords.length <= index) {
      return '';
    }

    return typedWords[index] === words[index] ? 'correct' : 'incorrect';
  };

  return (
    <div className='typing-test-container'>
      <h1 className='heading'> TypingTest </h1>
      <div>{text}</div>
      <textarea className='textarea'
        ref={inputRef}
        value={input}
        onChange={handleChange}
        placeholder="Start typing here..."
        rows={5}
        cols={100}
      />
      <div className='buttons-container'>
      <button className='button' onClick={handleStart}>Start</button>
      <button className='button' onClick={handleFinish}>Finish</button>
      </div>

      {accuracy > 0 && <div>Accuracy: {accuracy}%</div>}
      {wpm > 0 && <div>Words Per Minute (WPM): {wpm}</div>}
      <div className="word-container">
        {text.split(' ').map((word, index) => (
          <span key={index} className={getWordClass(index)}>
            {word}
          </span>
        ))}
      </div> 
      {endTime && (
        <div>Keys Pressed in 5 Minutes: {Math.min(keyCount, 5 * 60)}</div>
      )}
    </div>
  );
}

export default TypingTest;
