// import React, { useState } from 'react';
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig';
// import { useThemeMode } from '../contexts/ThemeContext';

// const UploadTest = () => {
//   const { mode } = useThemeMode();
//   const [testName, setTestName] = useState('');
//   const [duration, setDuration] = useState('');
//   const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }]);

//   const handleAddQuestion = () => {
//     setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }]);
//   };

//   const handleQuestionChange = (index, field, value) => {
//     const updated = [...questions];
//     updated[index][field] = value;
//     setQuestions(updated);
//   };

//   const handleSubmit = async () => {
//     if (!testName || !duration || questions.length === 0) {
//       alert("Fill all fields!");
//       return;
//     }
//     try {
//       const newTest = { name: testName, duration: Number(duration), questions };
//       await addDoc(collection(db, "tests"), newTest);
//       alert("Test series uploaded successfully!");
//       setTestName(''); setDuration(''); setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }]);
//     } catch (error) {
//       console.error("Upload Error:", error);
//       alert("Upload failed!");
//     }
//   };

//   return (
//     <div style={{ padding: '20px', color: mode === 'dark' ? '#fff' : '#000' }}>
//       <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Upload Test Series</h1>
//       <input type="text" placeholder="Test Name" value={testName} onChange={(e) => setTestName(e.target.value)} style={inputStyle} />
//       <input type="number" placeholder="Duration (minutes)" value={duration} onChange={(e) => setDuration(e.target.value)} style={inputStyle} />

//       {questions.map((q, idx) => (
//         <div key={idx} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
//           <input type="text" placeholder={`Question ${idx + 1}`} value={q.text} onChange={e => handleQuestionChange(idx, 'text', e.target.value)} style={inputStyle} />
//           {q.options.map((opt, i) => (
//             <input key={i} type="text" placeholder={`Option ${i + 1}`} value={opt} onChange={e => {
//               const updated = [...questions];
//               updated[idx].options[i] = e.target.value;
//               setQuestions(updated);
//             }} style={inputStyle} />
//           ))}
//           <input type="text" placeholder="Correct Answer" value={q.correctAnswer} onChange={e => handleQuestionChange(idx, 'correctAnswer', e.target.value)} style={inputStyle} />
//           <input type="number" placeholder="Marks" value={q.marks} onChange={e => handleQuestionChange(idx, 'marks', e.target.value)} style={inputStyle} />
//         </div>
//       ))}

//       <button onClick={handleAddQuestion} style={buttonStyle}>Add Another Question</button>
//       <button onClick={handleSubmit} style={buttonStyle}>Upload Test Series</button>
//     </div>
//   );
// };

// const inputStyle = { display: 'block', margin: '10px auto', padding: '10px', width: '90%' };
// const buttonStyle = { margin: '10px', padding: '10px 20px', cursor: 'pointer' };

// export default UploadTest;


import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useThemeMode } from '../contexts/ThemeContext';

const UploadTest = () => {
  const { mode } = useThemeMode();
  const [testName, setTestName] = useState('');
  const [duration, setDuration] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!testName || !duration || questions.length === 0) {
      alert('Fill all fields!');
      return;
    }
    try {
      const newTest = {
        name: testName,
        duration: Number(duration),
        questions
      };
      await addDoc(collection(db, 'tests'), newTest);
      alert('Test series uploaded successfully!');
      setTestName('');
      setDuration('');
      setQuestions([
        { text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }
      ]);
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Upload failed!');
    }
  };

  return (
    <div
      className="page-content-container"
      style={{
        height: 'calc(100vh - 70px)',
        overflowY: 'auto',
        padding: '20px',
        scrollBehavior: 'smooth',
       
        transform: translateZ(0),
        color: mode === 'dark' ? '#fff' : '#000',
        boxSizing: 'border-box'
      }}
    >
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>
        Upload Test Series
      </h1>

      <input
        type="text"
        placeholder="Test Name"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        style={inputStyle}
      />

      {questions.map((q, idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid #ccc',
            margin: '10px 0',
            padding: '10px'
          }}
        >
          <input
            type="text"
            placeholder={`Question ${idx + 1}`}
            value={q.text}
            onChange={(e) =>
              handleQuestionChange(idx, 'text', e.target.value)
            }
            style={inputStyle}
          />
          {q.options.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => {
                const updated = [...questions];
                updated[idx].options[i] = e.target.value;
                setQuestions(updated);
              }}
              style={inputStyle}
            />
          ))}
          <input
            type="text"
            placeholder="Correct Answer"
            value={q.correctAnswer}
            onChange={(e) =>
              handleQuestionChange(idx, 'correctAnswer', e.target.value)
            }
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Marks"
            value={q.marks}
            onChange={(e) =>
              handleQuestionChange(idx, 'marks', e.target.value)
            }
            style={inputStyle}
          />
        </div>
      ))}

      <button onClick={handleAddQuestion} style={buttonStyle}>
        Add Another Question
      </button>
      <button onClick={handleSubmit} style={buttonStyle}>
        Upload Test Series
      </button>
    </div>
  );
};

const inputStyle = {
  display: 'block',
  margin: '10px auto',
  padding: '10px',
  width: '90%'
};

const buttonStyle = {
  margin: '10px',
  padding: '10px 20px',
  cursor: 'pointer'
};

export default UploadTest;

