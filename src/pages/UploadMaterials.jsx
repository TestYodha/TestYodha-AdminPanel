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

const SUBJECTS = [
  { label: 'English', value: 'english' },
  { label: 'Maths', value: 'maths' },
  { label: 'Reasoning', value: 'reasoning' },
  { label: 'Geography', value: 'geography' },
  { label: 'History', value: 'history' },
  { label: 'Polity', value: 'polity' },
  { label: 'Economics', value: 'economics' },
  { label: 'Physics', value: 'physics' },
  { label: 'Biology', value: 'biology' },
  { label: 'Chemistry', value: 'chemistry' },
  { label: 'Static GK', value: 'static-gk' },
  { label: 'Current affairs', value: 'current-affairs' },
  { label: 'Hindi', value: 'hindi' },
  { label: 'Computer', value: 'computer' },
];

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
];

const initialMaterialState = {
  courseId: '',
  planId: '',
  type: 'pdf',
  title: '',
  description: '',
  file: null,
  subject: '',
  language: 'en',
};

const UploadMaterials = () => {
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [material, setMaterial] = useState(initialMaterialState);
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
      if (!material.courseId) {
        setPlans([]);
        return;
      }

      const plansQuery = query(
        collection(db, 'plans'),
        where('courseId', '==', material.courseId)
      );
      const snapshot = await getDocs(plansQuery);
      const filteredPlans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlans(filteredPlans);
    };

    fetchPlans();
  }, [material.courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    if (e.target.value === 'video') {
      alert('Video upload feature is coming soon!');
      setMaterial((prev) => ({ ...prev, type: 'pdf' }));
      return;
    }

    setMaterial((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setMaterial((prev) => ({ ...prev, file: null }));
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

    setMaterial((prev) => ({ ...prev, file: selectedFile }));
  };

  const resetForm = () => {
    setMaterial(initialMaterialState);
    setUploadProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !material.courseId ||
      !material.planId ||
      !material.title.trim() ||
      !material.file ||
      !material.subject ||
      !material.language
    ) {
      alert('Please fill all required fields.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const duplicateQuery = query(
        collection(db, 'materials'),
        where('courseId', '==', material.courseId),
        where('planId', '==', material.planId),
        where('title', '==', material.title.trim()),
        where('subject', '==', material.subject),
        where('language', '==', material.language)
      );
      const existing = await getDocs(duplicateQuery);

      if (!existing.empty) {
        alert('Same title already exists for this Course/Plan/Subject/Language.');
        setUploading(false);
        setUploadProgress(0);
        return;
      }

      const safeName = material.file.name.replace(/\s+/g, '_');
      const objectPath = `materials/${material.courseId}/${material.subject}/${material.language}/${Date.now()}_${safeName}`;
      const fileRef = ref(storage, objectPath);
      const fileUrl = await uploadPdfWithProgress({
        file: material.file,
        fileRef,
        onProgress: setUploadProgress,
      });

      await addDoc(collection(db, 'materials'), {
        courseId: material.courseId,
        planId: material.planId,
        type: material.type,
        title: material.title.trim(),
        description: (material.description || '').trim(),
        url: fileUrl,
        subject: material.subject,
        language: material.language,
        createdAt: new Date(),
      });

      alert('Material uploaded successfully!');
      resetForm();
    } catch (err) {
      console.error('Upload Error:', err);
      alert(`Failed to upload material. ${getStorageErrorMessage(err, MAX_PDF_SIZE_MB * 1024 * 1024)}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container" style={{ marginTop: 350 }}>
      <h2>Upload Course Material</h2>

      <form onSubmit={handleSubmit} className="material-form">
        <label>Course:</label>
        <select
          name="courseId"
          value={material.courseId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        <label>Plan:</label>
        <select
          name="planId"
          value={material.planId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Plan --</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} (Rs. {plan.price})
            </option>
          ))}
        </select>

        <label>Subject:</label>
        <select
          name="subject"
          value={material.subject}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Subject --</option>
          {SUBJECTS.map((subject) => (
            <option key={subject.value} value={subject.value}>
              {subject.label}
            </option>
          ))}
        </select>

        <label>Language:</label>
        <select
          name="language"
          value={material.language}
          onChange={handleChange}
          required
        >
          {LANGUAGES.map((language) => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>

        <label>Material Type:</label>
        <select name="type" value={material.type} onChange={handleTypeChange}>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
        </select>

        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={material.title}
          onChange={handleChange}
          required
        />

        <label>Description (optional):</label>
        <textarea
          name="description"
          value={material.description}
          onChange={handleChange}
        />

        <label>Upload File:</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          required
        />

        {material.file && (
          <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#555' }}>
            Selected: {material.file.name} ({formatFileSize(material.file.size)}) | Max {MAX_PDF_SIZE_MB} MB
          </p>
        )}

        {uploading && (
          <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#555' }}>
            Upload progress: {uploadProgress}%
          </p>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Material'}
        </button>
      </form>
    </div>
  );
};

export default UploadMaterials;
