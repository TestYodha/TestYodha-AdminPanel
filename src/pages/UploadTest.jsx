


import React, { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Box, TextField, Button, Typography, Paper, IconButton, CircularProgress,
  MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import { AddCircle, UploadFile } from "@mui/icons-material";
import { useThemeMode } from "../contexts/ThemeContext";
import mammoth from "mammoth";

// ✅ Image Resizer with canvas
const resizeAndUploadImage = async (file, path, targetWidth, targetHeight) => {
  const image = new Image();
  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.onload = e => {
      image.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        const scale = Math.min(targetWidth / image.width, targetHeight / image.height);
        const x = (targetWidth - image.width * scale) / 2;
        const y = (targetHeight - image.height * scale) / 2;

        ctx.drawImage(image, x, y, image.width * scale, image.height * scale);

        canvas.toBlob(async (blob) => {
          const storage = getStorage();
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, blob);
          const url = await getDownloadURL(storageRef);
          resolve(url);
        }, 'image/jpeg');
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const UploadTest = () => {
  const { darkMode } = useThemeMode();
  const [testName, setTestName] = useState("");
  const [duration, setDuration] = useState("");
  const [courseId, setCourseId] = useState("");
  const [planId, setPlanId] = useState("");
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [testId, setTestId] = useState(`test${Date.now()}`);
  const [questions, setQuestions] = useState([
    {
      id: "q1",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: 1,
      questionImageUrl: "",
      optionImageUrls: ["", "", "", ""]
    }
  ]);

  useEffect(() => {
    const fetchMeta = async () => {
      const courseSnap = await getDocs(collection(db, 'courses'));
      const planSnap = await getDocs(collection(db, 'plans'));
      setCourses(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setPlans(planSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    setFilteredPlans(plans.filter(plan => plan.courseId === courseId));
    setPlanId("");
  }, [courseId, plans]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q${questions.length + 1}`,
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1,
        questionImageUrl: "",
        optionImageUrls: ["", "", "", ""]
      }
    ]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setUploading(true);

    try {
      if (selectedFile.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const jsonData = JSON.parse(event.target.result);
          setTestName(jsonData.name || "");
          setDuration(jsonData.duration || "");
          setQuestions(jsonData.questions || []);
          alert("✅ JSON File Loaded!");
          setUploading(false);
        };
        reader.readAsText(selectedFile);
      } else if (selectedFile.name.endsWith(".docx")) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        let currentQuestion = null, parsedQuestions = [];

        lines.forEach(line => {
          if (line.startsWith("Q:")) {
            if (currentQuestion) parsedQuestions.push(currentQuestion);
            currentQuestion = {
              id: `q${parsedQuestions.length + 1}`,
              text: line.slice(2).trim(),
              options: ["", "", "", ""],
              optionImageUrls: ["", "", "", ""],
              correctAnswer: "",
              marks: 1,
              questionImageUrl: ""
            };
          } else if (line.startsWith("A:")) {
            currentQuestion.correctAnswer = line.slice(2).trim();
          } else if (line.startsWith("Option")) {
            const idx = parseInt(line[6]) - 1;
            currentQuestion.options[idx] = line.split(':')[1].trim();
          } else if (line.startsWith("Marks:")) {
            currentQuestion.marks = parseInt(line.split(':')[1].trim());
          } else if (line.startsWith("TestName:")) {
            setTestName(line.split(':')[1].trim());
          } else if (line.startsWith("Duration:")) {
            setDuration(line.split(':')[1].trim());
          }
        });

        if (currentQuestion) parsedQuestions.push(currentQuestion);
        setQuestions(parsedQuestions);
        alert("✅ DOCX Parsed & Loaded!");
      } else {
        alert("❌ Unsupported file type. Upload JSON or DOCX only.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Parsing Failed.");
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!testName || !duration || !courseId || !planId || questions.length === 0) {
      alert("⚠️ Fill all fields.");
      return;
    }

    const testData = { name: testName, duration: Number(duration), questions, courseId, planId };

    try {
      await setDoc(doc(collection(db, "tests"), testId), testData);
      alert("✅ Test Uploaded Successfully!");
      setTestName("");
      setDuration("");
      setCourseId("");
      setPlanId("");
      setQuestions([{
        id: "q1",
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 1,
        questionImageUrl: "",
        optionImageUrls: ["", "", "", ""]
      }]);
      setTestId(`test${Date.now()}`);
    } catch (err) {
      console.error(err);
      alert("❌ Upload Failed!");
    }
  };

  const blackFieldStyle = {
    mb: 2,
    input: { color: "#000" },
    label: { color: "#000" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#000" },
      "&:hover fieldset": { borderColor: "#000" },
      "&.Mui-focused fieldset": { borderColor: "#000" }
    }
  };

  return (
    <Box sx={{ background: darkMode ? "#121212" : "#f4f4f4", minHeight: "100vh", pt: "80px", px: { xs: 2, sm: 3 }, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ width: "100%", maxWidth: "1500px", p: 3, background: darkMode ? "#1e1e1e" : "#fff", color: darkMode ? "#fff" : "#000", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
        <Typography variant="h4" align="center" sx={{ mb: 1 }}>📚 Upload Test Series</Typography>

        <Typography variant="caption" align="center" sx={{ color: "red", mb: 2, display: 'block' }}>
          ⚠️ Upload images in JPEG, JPG, or PNG format only.
        </Typography>

        <TextField fullWidth label="Test Name" value={testName} onChange={e => setTestName(e.target.value)} sx={blackFieldStyle} />
        <TextField fullWidth label="Duration (minutes)" value={duration} onChange={e => setDuration(e.target.value)} sx={blackFieldStyle} />

        <FormControl fullWidth sx={blackFieldStyle}>
          <InputLabel id="course-label">Course</InputLabel>
          <Select labelId="course-label" value={courseId} onChange={(e) => setCourseId(e.target.value)} label="Course">
            {courses.map(course => <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={blackFieldStyle} disabled={!courseId}>
          <InputLabel id="plan-label">Plan</InputLabel>
          <Select labelId="plan-label" value={planId} onChange={(e) => setPlanId(e.target.value)} label="Plan">
            {filteredPlans.map(plan => <MenuItem key={plan.id} value={plan.id}>{plan.name} ({plan.price === 0 ? 'Free' : `₹${plan.price}`})</MenuItem>)}
          </Select>
        </FormControl>

        {questions.map((q, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, background: darkMode ? "#2e2e2e" : "#f9f9f9" }}>
            <Typography variant="subtitle1" sx={{ color: "#000" }}>Question {index + 1}</Typography>

            <TextField fullWidth label="Question Text" value={q.text} onChange={e => handleQuestionChange(index, "text", e.target.value)} sx={blackFieldStyle} />

            <Button variant="outlined" component="label" sx={{ mb: 1 }}>
              Upload Question Image
              <input hidden type="file" accept="image/jpeg,image/jpg,image/png" onChange={async (e) => {
                const file = e.target.files[0];
                e.target.value = "";
                if (!file) return;
                const url = await resizeAndUploadImage(file, `testSeries/${testId}/q${index + 1}/question.jpg`, 400, 250);
                const updated = [...questions];
                updated[index].questionImageUrl = url;
                setQuestions(updated);
              }} />
            </Button>
            {q.questionImageUrl && <img src={q.questionImageUrl} alt="Preview" style={{ maxWidth: '100%', marginBottom: '10px' }} />}

            {q.options.map((opt, i) => (
              <div key={i}>
                <TextField fullWidth label={`Option ${i + 1}`} value={opt} onChange={e => handleOptionChange(index, i, e.target.value)} sx={blackFieldStyle} />
                <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                  Upload Option {i + 1} Image
                  <input hidden type="file" accept="image/jpeg,image/jpg,image/png" onChange={async (e) => {
                    const file = e.target.files[0];
                    e.target.value = "";
                    if (!file) return;
                    const url = await resizeAndUploadImage(file, `testSeries/${testId}/q${index + 1}/option${i + 1}.jpg`, 100, 90);
                    const updated = [...questions];
                    if (!updated[index].optionImageUrls) updated[index].optionImageUrls = ["", "", "", ""];
                    updated[index].optionImageUrls[i] = url;
                    setQuestions(updated);
                  }} />
                </Button>
                {q.optionImageUrls[i] && (
                  <img src={q.optionImageUrls[i]} alt={`Option ${i + 1}`} style={{ maxWidth: '100px', marginBottom: '10px' }} />
                )}
              </div>
            ))}

            <TextField fullWidth label="Correct Answer" value={q.correctAnswer} onChange={e => handleQuestionChange(index, "correctAnswer", e.target.value)} sx={blackFieldStyle} />
            <TextField fullWidth type="number" label="Marks" value={q.marks} onChange={e => handleQuestionChange(index, "marks", e.target.value)} sx={blackFieldStyle} />
          </Paper>
        ))}

        <IconButton onClick={handleAddQuestion} color="primary" sx={{ mb: 2 }}><AddCircle /> Add Question</IconButton>

        <Button component="label" variant="outlined" startIcon={<UploadFile />} sx={{ mb: 2 }}>
          Upload File (JSON/DOCX)
          <input type="file" hidden accept=".json,.docx" onChange={handleFileUpload} />
        </Button>

        {uploading && <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}><CircularProgress size={24} /><Typography sx={{ ml: 1 }}>Processing File...</Typography></Box>}

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Submit Test</Button>
      </Paper>
    </Box>
  );
};

export default UploadTest;
