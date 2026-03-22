import React, { useEffect, useRef, useState } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { db, storage } from '../firebase';
import './UploadMaterials.css';
import {
  formatFileSize,
  getStorageErrorMessage,
  MAX_PDF_SIZE_MB,
  uploadPdfWithProgress,
} from '../utils/storageUpload';

const initialPyqState = {
  courseId: '',
  planId: '',
  title: '',
  year: '',
  file: null,
};

const UploadPYQ = () => {
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [pyq, setPYQ] = useState(initialPyqState);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, 'courses'));
      const courseList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!pyq.courseId) {
        setPlans([]);
        return;
      }

      const plansQuery = query(
        collection(db, 'plans'),
        where('courseId', '==', pyq.courseId)
      );
      const snapshot = await getDocs(plansQuery);
      const filteredPlans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlans(filteredPlans);
    };

    fetchPlans();
  }, [pyq.courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPYQ((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setPYQ((prev) => ({ ...prev, file: null }));
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      e.target.value = '';
      return;
    }

    if (selectedFile.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
      alert(`PDF size must be ${MAX_PDF_SIZE_MB} MB or less.`);
      e.target.value = '';
      return;
    }

    setPYQ((prev) => ({ ...prev, file: selectedFile }));
  };

  const resetForm = () => {
    setPYQ(initialPyqState);
    setUploadProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pyq.courseId || !pyq.file || !pyq.title.trim() || !pyq.planId) {
      alert('Please fill all required fields.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const duplicateQuery = query(
        collection(db, 'pyqs'),
        where('courseId', '==', pyq.courseId),
        where('planId', '==', pyq.planId),
        where('title', '==', pyq.title.trim())
      );
      const existing = await getDocs(duplicateQuery);

      if (!existing.empty) {
        alert('A PYQ with the same title already exists for this course and plan.');
        setUploading(false);
        setUploadProgress(0);
        return;
      }

      const safeName = pyq.file.name.replace(/\s+/g, '_');
      const fileRef = ref(
        storage,
        `pyqs/${pyq.courseId}/${Date.now()}_${safeName}`
      );
      const fileUrl = await uploadPdfWithProgress({
        file: pyq.file,
        fileRef,
        onProgress: setUploadProgress,
      });

      await addDoc(collection(db, 'pyqs'), {
        courseId: pyq.courseId,
        planId: pyq.planId,
        title: pyq.title.trim(),
        year: pyq.year.trim(),
        url: fileUrl,
        createdAt: new Date(),
      });

      alert('PYQ uploaded successfully!');
      resetForm();
    } catch (err) {
      console.error('Upload Error:', err);
      alert(`Failed to upload PYQ. ${getStorageErrorMessage(err, MAX_PDF_SIZE_MB * 1024 * 1024)}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container">
      <h2>Upload PYQ</h2>
      <form onSubmit={handleSubmit} className="material-form">
        <label>Course:</label>
        <select name="courseId" value={pyq.courseId} onChange={handleChange} required>
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        <label>Plan:</label>
        <select name="planId" value={pyq.planId} onChange={handleChange} required>
          <option value="">-- Select Plan --</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} (Rs. {plan.price})
            </option>
          ))}
        </select>

        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={pyq.title}
          onChange={handleChange}
          required
        />

        <label>Exam Year:</label>
        <input
          type="text"
          name="year"
          value={pyq.year}
          onChange={handleChange}
          placeholder="e.g. 2023"
        />

        <label>Upload File:</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          required
        />

        {pyq.file && (
          <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#555' }}>
            Selected: {pyq.file.name} ({formatFileSize(pyq.file.size)}) | Max {MAX_PDF_SIZE_MB} MB
          </p>
        )}

        {uploading && (
          <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#555' }}>
            Upload progress: {uploadProgress}%
          </p>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload PYQ'}
        </button>
      </form>
    </div>
  );
};

export default UploadPYQ;
