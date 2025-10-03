

// // ✅ FILE: pages/UploadPYQ.jsx
// import React, { useEffect, useState } from 'react';
// import { db, storage } from '../firebase';
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
// } from 'firebase/firestore';
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
// } from 'firebase/storage';
// import './UploadMaterials.css';

// const UploadPYQ = () => {
//   const [courses, setCourses] = useState([]);
//   const [plans, setPlans] = useState([]);
//   const [pyq, setPYQ] = useState({
//     courseId: '',
//     planId: '',
//     title: '',
//     year: '',
//     file: null,
//   });
//   const [uploading, setUploading] = useState(false);

//   // Fetch all courses
//   useEffect(() => {
//     const fetchCourses = async () => {
//       const snapshot = await getDocs(collection(db, 'courses'));
//       const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setCourses(courseList);
//     };
//     fetchCourses();
//   }, []);

//   // Fetch plans based on course selection
//   useEffect(() => {
//     const fetchPlans = async () => {
//       if (!pyq.courseId) return setPlans([]);
//       const q = query(
//         collection(db, 'plans'),
//         where('courseId', '==', pyq.courseId)
//       );
//       const snapshot = await getDocs(q);
//       const filteredPlans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setPlans(filteredPlans);
//     };
//     fetchPlans();
//   }, [pyq.courseId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPYQ({ ...pyq, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile?.type !== 'application/pdf') {
//       alert('Only PDF files are allowed.');
//       return;
//     }
//     setPYQ({ ...pyq, file: selectedFile });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!pyq.courseId || !pyq.file || !pyq.title || !pyq.planId) {
//       alert('Please fill all required fields.');
//       return;
//     }

//     setUploading(true);

//     try {
//       // 🔍 Duplicate check
//       const q = query(
//         collection(db, 'pyqs'),
//         where('courseId', '==', pyq.courseId),
//         where('planId', '==', pyq.planId),
//         where('title', '==', pyq.title.trim())
//       );
//       const existing = await getDocs(q);
//       if (!existing.empty) {
//         alert('⚠️ A PYQ with the same title already exists for this course and plan.');
//         setUploading(false);
//         return;
//       }

//       // ✅ Upload PDF to Firebase Storage
//       const fileRef = ref(
//         storage,
//         `pyqs/${pyq.courseId}/${Date.now()}_${pyq.file.name}`
//       );
//       await uploadBytes(fileRef, pyq.file);
//       const fileUrl = await getDownloadURL(fileRef);

//       // ✅ Add metadata to Firestore
//       await addDoc(collection(db, 'pyqs'), {
//         courseId: pyq.courseId,
//         planId: pyq.planId,
//         title: pyq.title.trim(),
//         year: pyq.year.trim(),
//         url: fileUrl,
//         createdAt: new Date(),
//       });

//       alert('✅ PYQ uploaded successfully!');
//       setPYQ({ courseId: '', planId: '', title: '', year: '', file: null });
//     } catch (err) {
//       console.error('Upload Error:', err);
//       alert('❌ Failed to upload PYQ.');
//     }

//     setUploading(false);
//   };

//   return (
//     <div className="container">
//       <h2>Upload PYQ</h2>
//       <form onSubmit={handleSubmit} className="material-form">
//         <label>Course:</label>
//         <select name="courseId" value={pyq.courseId} onChange={handleChange} required>
//           <option value="">-- Select Course --</option>
//           {courses.map((c) => (
//             <option key={c.id} value={c.id}>{c.title}</option>
//           ))}
//         </select>

//         <label>Plan:</label>
//         <select name="planId" value={pyq.planId} onChange={handleChange} required>
//           <option value="">-- Select Plan --</option>
//           {plans.map((p) => (
//             <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
//           ))}
//         </select>

//         <label>Title:</label>
//         <input
//           type="text"
//           name="title"
//           value={pyq.title}
//           onChange={handleChange}
//           required
//         />

//         <label>Exam Year:</label>
//         <input
//           type="text"
//           name="year"
//           value={pyq.year}
//           onChange={handleChange}
//           placeholder="e.g. 2023"
//         />

//         <label>Upload File:</label>
//         <input type="file" accept=".pdf" onChange={handleFileChange} required />

//         <button type="submit" disabled={uploading}>
//           {uploading ? 'Uploading...' : 'Upload PYQ'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UploadPYQ;





// ✅ FILE: pages/UploadPYQ.jsx
import React, { useEffect, useState , useRef} from 'react';
import { db, storage } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import './UploadMaterials.css';

const UploadPYQ = () => {
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [pyq, setPYQ] = useState({
    courseId: '',
    planId: '',
    title: '',
    year: '',
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, 'courses'));
      const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    };
    fetchCourses();
  }, []);

  // Fetch plans based on course selection
  useEffect(() => {
    const fetchPlans = async () => {
      if (!pyq.courseId) return setPlans([]);
      const q = query(
        collection(db, 'plans'),
        where('courseId', '==', pyq.courseId)
      );
      const snapshot = await getDocs(q);
      const filteredPlans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlans(filteredPlans);
    };
    fetchPlans();
  }, [pyq.courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPYQ({ ...pyq, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }
    setPYQ({ ...pyq, file: selectedFile });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pyq.courseId || !pyq.file || !pyq.title || !pyq.planId) {
      alert('Please fill all required fields.');
      return;
    }

    setUploading(true);

    try {
      // 🔍 Duplicate check
      const q = query(
        collection(db, 'pyqs'),
        where('courseId', '==', pyq.courseId),
        where('planId', '==', pyq.planId),
        where('title', '==', pyq.title.trim())
      );
      const existing = await getDocs(q);
      if (!existing.empty) {
        alert('⚠️ A PYQ with the same title already exists for this course and plan.');
        setUploading(false);
        return;
      }

      // ✅ Upload PDF to Firebase Storage
      const fileRef = ref(
        storage,
        `pyqs/${pyq.courseId}/${Date.now()}_${pyq.file.name}`
      );
      await uploadBytes(fileRef, pyq.file);
      const fileUrl = await getDownloadURL(fileRef);

      // ✅ Add metadata to Firestore
      await addDoc(collection(db, 'pyqs'), {
        courseId: pyq.courseId,
        planId: pyq.planId,
        title: pyq.title.trim(),
        year: pyq.year.trim(),
        url: fileUrl,
        createdAt: new Date(),
      });

      alert('✅ PYQ uploaded successfully!');
      setPYQ({ courseId: '', planId: '', title: '', year: '', file: null });
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error('Upload Error:', err);
      alert('❌ Failed to upload PYQ.');
    }

    setUploading(false);
  };

  return (
    <div className="container">
      <h2>Upload PYQ</h2>
      <form onSubmit={handleSubmit} className="material-form">
        <label>Course:</label>
        <select name="courseId" value={pyq.courseId} onChange={handleChange} required>
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <label>Plan:</label>
        <select name="planId" value={pyq.planId} onChange={handleChange} required>
          <option value="">-- Select Plan --</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
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
        <input type="file" accept=".pdf" onChange={handleFileChange} ref={fileInputRef} required />

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload PYQ'}
        </button>
      </form>
    </div>
  );
};

export default UploadPYQ;
