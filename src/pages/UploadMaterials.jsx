// // import React, { useEffect, useState } from 'react';
// // import { db, storage } from '../firebase';
// // import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
// // import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// // import './UploadMaterials.css';

// // const UploadMaterials = () => {
// //   const [courses, setCourses] = useState([]);
// //   const [plans, setPlans] = useState([]);
// //   const [material, setMaterial] = useState({
// //     courseId: '',
// //     planId: '',
// //     type: 'pdf',
// //     title: '',
// //     description: '',
// //     file: null,
// //   });
// //   const [uploading, setUploading] = useState(false);

// //   useEffect(() => {
// //     const fetchCourses = async () => {
// //       const snapshot = await getDocs(collection(db, 'courses'));
// //       const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //       setCourses(courseList);
// //     };

// //     fetchCourses();
// //   }, []);

// //   useEffect(() => {
// //     const fetchPlans = async () => {
// //       if (!material.courseId) return setPlans([]);
// //       const q = query(collection(db, 'plans'), where('courseId', '==', material.courseId));
// //       const snapshot = await getDocs(q);
// //       const filteredPlans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //       setPlans(filteredPlans);
// //     };

// //     fetchPlans();
// //   }, [material.courseId]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setMaterial({ ...material, [name]: value });
// //   };

// //   const handleTypeChange = (e) => {
// //     if (e.target.value === 'video') {
// //       alert('🎥 Video upload feature is coming soon!');
// //       setMaterial({ ...material, type: 'pdf' });
// //     } else {
// //       setMaterial({ ...material, type: e.target.value });
// //     }
// //   };

// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files[0];
// //     if (selectedFile?.type !== 'application/pdf') {
// //       alert('Only PDF files are allowed.');
// //       return;
// //     }
// //     setMaterial({ ...material, file: selectedFile });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!material.courseId || !material.file || !material.title || !material.planId) {
// //       alert('Please fill all required fields.');
// //       return;
// //     }

// //     setUploading(true);

// //     try {
// //       console.log('Uploading file:', material.file);
// //       const fileRef = ref(
// //         storage,
// //         `materials/${material.courseId}/${Date.now()}_${material.file.name}`
// //       );
// //       await uploadBytes(fileRef, material.file);
// //       const fileUrl = await getDownloadURL(fileRef);

// //       await addDoc(collection(db, 'materials'), {
// //         courseId: material.courseId,
// //         planId: material.planId,
// //         type: material.type,
// //         title: material.title,
// //         description: material.description,
// //         url: fileUrl,
// //         createdAt: new Date(),
// //       });

// //       alert('✅ Material uploaded successfully!');
// //       setMaterial({
// //         courseId: '',
// //         planId: '',
// //         type: 'pdf',
// //         title: '',
// //         description: '',
// //         file: null,
// //       });
// //     } catch (err) {
// //       console.error('Upload Error:', err);
// //       alert('❌ Failed to upload material.');
// //     }

// //     setUploading(false);
// //   };

// //   return (
// //     <div className="container">
// //       <h2>Upload Course Material</h2>
// //       <form onSubmit={handleSubmit} className="material-form">
// //         <label>Course:</label>
// //         <select name="courseId" value={material.courseId} onChange={handleChange} required>
// //           <option value="">-- Select Course --</option>
// //           {courses.map((c) => (
// //             <option key={c.id} value={c.id}>{c.title}</option>
// //           ))}
// //         </select>

// //         <label>Plan:</label>
// //         <select name="planId" value={material.planId} onChange={handleChange} required>
// //           <option value="">-- Select Plan --</option>
// //           {plans.map((p) => (
// //             <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
// //           ))}
// //         </select>

// //         <label>Material Type:</label>
// //         <select name="type" value={material.type} onChange={handleTypeChange}>
// //           <option value="pdf">PDF</option>
// //           <option value="video">Video</option>
// //         </select>

// //         <label>Title:</label>
// //         <input
// //           type="text"
// //           name="title"
// //           value={material.title}
// //           onChange={handleChange}
// //           required
// //         />

// //         <label>Description (optional):</label>
// //         <textarea
// //           name="description"
// //           value={material.description}
// //           onChange={handleChange}
// //         ></textarea>

// //         <label>Upload File:</label>
// //         <input type="file" accept=".pdf" onChange={handleFileChange} required />

// //         <button type="submit" disabled={uploading}>
// //           {uploading ? 'Uploading...' : 'Upload Material'}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default UploadMaterials;

// // ✅ FILE: pages/UploadMaterials.jsx
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

// const UploadMaterials = () => {
//   const [courses, setCourses] = useState([]);
//   const [plans, setPlans] = useState([]);
//   const [material, setMaterial] = useState({
//     courseId: '',
//     planId: '',
//     type: 'pdf',
//     title: '',
//     description: '',
//     file: null,
//   });
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       const snapshot = await getDocs(collection(db, 'courses'));
//       const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setCourses(courseList);
//     };
//     fetchCourses();
//   }, []);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       if (!material.courseId) return setPlans([]);
//       const q = query(collection(db, 'plans'), where('courseId', '==', material.courseId));
//       const snapshot = await getDocs(q);
//       const filteredPlans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setPlans(filteredPlans);
//     };
//     fetchPlans();
//   }, [material.courseId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMaterial({ ...material, [name]: value });
//   };

//   const handleTypeChange = (e) => {
//     if (e.target.value === 'video') {
//       alert('🎥 Video upload feature is coming soon!');
//       setMaterial({ ...material, type: 'pdf' });
//     } else {
//       setMaterial({ ...material, type: e.target.value });
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile?.type !== 'application/pdf') {
//       alert('Only PDF files are allowed.');
//       return;
//     }
//     setMaterial({ ...material, file: selectedFile });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!material.courseId || !material.file || !material.title || !material.planId) {
//       alert('Please fill all required fields.');
//       return;
//     }

//     setUploading(true);

//     try {
//       // 🔍 Check for duplicate material (title + course + plan)
//       const q = query(
//         collection(db, 'materials'),
//         where('courseId', '==', material.courseId),
//         where('planId', '==', material.planId),
//         where('title', '==', material.title.trim())
//       );
//       const existing = await getDocs(q);
//       if (!existing.empty) {
//         alert('⚠️ Material with the same title already exists for this course and plan.');
//         setUploading(false);
//         return;
//       }

//       // ✅ Upload to Firebase Storage
//       const fileRef = ref(
//         storage,
//         `materials/${material.courseId}/${Date.now()}_${material.file.name}`
//       );
//       await uploadBytes(fileRef, material.file);
//       const fileUrl = await getDownloadURL(fileRef);

//       // ✅ Add to Firestore
//       await addDoc(collection(db, 'materials'), {
//         courseId: material.courseId,
//         planId: material.planId,
//         type: material.type,
//         title: material.title.trim(),
//         description: material.description.trim(),
//         url: fileUrl,
//         createdAt: new Date(),
//       });

//       alert('✅ Material uploaded successfully!');
//       setMaterial({
//         courseId: '',
//         planId: '',
//         type: 'pdf',
//         title: '',
//         description: '',
//         file: null,
//       });
//     } catch (err) {
//       console.error('Upload Error:', err);
//       alert('❌ Failed to upload material.');
//     }

//     setUploading(false);
//   };

//   return (
//     <div className="container">
//       <h2>Upload Course Material</h2>
//       <form onSubmit={handleSubmit} className="material-form">
//         <label>Course:</label>
//         <select name="courseId" value={material.courseId} onChange={handleChange} required>
//           <option value="">-- Select Course --</option>
//           {courses.map((c) => (
//             <option key={c.id} value={c.id}>{c.title}</option>
//           ))}
//         </select>

//         <label>Plan:</label>
//         <select name="planId" value={material.planId} onChange={handleChange} required>
//           <option value="">-- Select Plan --</option>
//           {plans.map((p) => (
//             <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
//           ))}
//         </select>

//         <label>Material Type:</label>
//         <select name="type" value={material.type} onChange={handleTypeChange}>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//         </select>

//         <label>Title:</label>
//         <input
//           type="text"
//           name="title"
//           value={material.title}
//           onChange={handleChange}
//           required
//         />

//         <label>Description (optional):</label>
//         <textarea
//           name="description"
//           value={material.description}
//           onChange={handleChange}
//         ></textarea>

//         <label>Upload File:</label>
//         <input type="file" accept=".pdf" onChange={handleFileChange} required />

//         <button type="submit" disabled={uploading}>
//           {uploading ? 'Uploading...' : 'Upload Material'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UploadMaterials;



// // ✅ FILE: pages/UploadMaterials.jsx
// import React, { useEffect, useState, useRef } from 'react';
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

// const UploadMaterials = () => {
//   const [courses, setCourses] = useState([]);
//   const [plans, setPlans] = useState([]);
//   const [material, setMaterial] = useState({
//     courseId: '',
//     planId: '',
//     type: 'pdf',
//     title: '',
//     description: '',
//     file: null,
//   });
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       const snapshot = await getDocs(collection(db, 'courses'));
//       const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setCourses(courseList);
//     };
//     fetchCourses();
//   }, []);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       if (!material.courseId) return setPlans([]);
//       const q = query(collection(db, 'plans'), where('courseId', '==', material.courseId));
//       const snapshot = await getDocs(q);
//       const filteredPlans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setPlans(filteredPlans);
//     };
//     fetchPlans();
//   }, [material.courseId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMaterial({ ...material, [name]: value });
//   };

//   const handleTypeChange = (e) => {
//     if (e.target.value === 'video') {
//       alert('🎥 Video upload feature is coming soon!');
//       setMaterial({ ...material, type: 'pdf' });
//     } else {
//       setMaterial({ ...material, type: e.target.value });
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile?.type !== 'application/pdf') {
//       alert('Only PDF files are allowed.');
//       return;
//     }
//     setMaterial({ ...material, file: selectedFile });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!material.courseId || !material.file || !material.title || !material.planId) {
//       alert('Please fill all required fields.');
//       return;
//     }

//     setUploading(true);

//     try {
//       // 🔍 Check for duplicate material (title + course + plan)
//       const q = query(
//         collection(db, 'materials'),
//         where('courseId', '==', material.courseId),
//         where('planId', '==', material.planId),
//         where('title', '==', material.title.trim())
//       );
//       const existing = await getDocs(q);
//       if (!existing.empty) {
//         alert('⚠️ Material with the same title already exists for this course and plan.');
//         setUploading(false);
//         return;
//       }

//       // ✅ Upload to Firebase Storage
//       const fileRef = ref(
//         storage,
//         `materials/${material.courseId}/${Date.now()}_${material.file.name}`
//       );
//       await uploadBytes(fileRef, material.file);
//       const fileUrl = await getDownloadURL(fileRef);

//       // ✅ Add to Firestore
//       await addDoc(collection(db, 'materials'), {
//         courseId: material.courseId,
//         planId: material.planId,
//         type: material.type,
//         title: material.title.trim(),
//         description: material.description.trim(),
//         url: fileUrl,
//         createdAt: new Date(),
//       });

//       alert('✅ Material uploaded successfully!');
//       setMaterial({
//         courseId: '',
//         planId: '',
//         type: 'pdf',
//         title: '',
//         description: '',
//         file: null,
//       });
//       if (fileInputRef.current) fileInputRef.current.value = null;
//     } catch (err) {
//       console.error('Upload Error:', err);
//       alert('❌ Failed to upload material.');
//     }

//     setUploading(false);
//   };

//   return (
//     <div className="container">
//       <h2>Upload Course Material</h2>
//       <form onSubmit={handleSubmit} className="material-form">
//         <label>Course:</label>
//         <select name="courseId" value={material.courseId} onChange={handleChange} required>
//           <option value="">-- Select Course --</option>
//           {courses.map((c) => (
//             <option key={c.id} value={c.id}>{c.title}</option>
//           ))}
//         </select>

//         <label>Plan:</label>
//         <select name="planId" value={material.planId} onChange={handleChange} required>
//           <option value="">-- Select Plan --</option>
//           {plans.map((p) => (
//             <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
//           ))}
//         </select>

//         <label>Material Type:</label>
//         <select name="type" value={material.type} onChange={handleTypeChange}>
//           <option value="pdf">PDF</option>
//           <option value="video">Video</option>
//         </select>

//         <label>Title:</label>
//         <input
//           type="text"
//           name="title"
//           value={material.title}
//           onChange={handleChange}
//           required
//         />

//         <label>Description (optional):</label>
//         <textarea
//           name="description"
//           value={material.description}
//           onChange={handleChange}
//         ></textarea>

//         <label>Upload File:</label>
//         <input type="file" accept=".pdf" onChange={handleFileChange} ref={fileInputRef} required />

//         <button type="submit" disabled={uploading}>
//           {uploading ? 'Uploading...' : 'Upload Material'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UploadMaterials;


// ✅ FILE: pages/UploadMaterials.jsx
import React, { useEffect, useState, useRef } from 'react';
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

/* ---------- Constants ---------- */
const SUBJECTS = [
  { label: 'English',         value: 'english' },
  { label: 'Maths',           value: 'maths' },
  { label: 'Reasoning',       value: 'reasoning' },
  { label: 'Geography',       value: 'geography' },
  { label: 'History',         value: 'history' },
  { label: 'Polity',          value: 'polity' },
  { label: 'Economics',       value: 'economics' },
  { label: 'Physics',         value: 'physics' },
  { label: 'Biology',         value: 'biology' },
  { label: 'Chemistry',       value: 'chemistry' },
  { label: 'Static GK',       value: 'static-gk' },
  { label: 'Current affairs', value: 'current-affairs' },
  { label: 'Hindi',           value: 'hindi' },
  { label: 'Computer',        value: 'computer' },
];

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Hindi',   value: 'hi' },
];

const UploadMaterials = () => {
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);

  const [material, setMaterial] = useState({
    courseId: '',
    planId: '',
    type: 'pdf',
    title: '',
    description: '',
    file: null,
    subject: '',      // NEW
    language: 'en',   // NEW (default English)
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  /* -------- fetch courses -------- */
  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, 'courses'));
      const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    };
    fetchCourses();
  }, []);

  /* -------- fetch plans for selected course -------- */
  useEffect(() => {
    const fetchPlans = async () => {
      if (!material.courseId) return setPlans([]);
      const q = query(collection(db, 'plans'), where('courseId', '==', material.courseId));
      const snapshot = await getDocs(q);
      const filteredPlans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlans(filteredPlans);
    };
    fetchPlans();
  }, [material.courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial({ ...material, [name]: value });
  };

  const handleTypeChange = (e) => {
    if (e.target.value === 'video') {
      alert('🎥 Video upload feature is coming soon!');
      setMaterial({ ...material, type: 'pdf' });
    } else {
      setMaterial({ ...material, type: e.target.value });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }
    setMaterial({ ...material, file: selectedFile });
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

    try {
      // 🔍 prevent duplicates for same course+plan+title+subject+language
      const qDup = query(
        collection(db, 'materials'),
        where('courseId', '==', material.courseId),
        where('planId', '==', material.planId),
        where('title', '==', material.title.trim()),
        where('subject', '==', material.subject),
        where('language', '==', material.language)
      );
      const existing = await getDocs(qDup);
      if (!existing.empty) {
        alert('⚠️ Same title already exists for this Course/Plan/Subject/Language.');
        setUploading(false);
        return;
      }

      // ✅ upload to Storage (organized path with subject/language)
      const safeName = material.file.name.replace(/\s+/g, '_');
      const objectPath = `materials/${material.courseId}/${material.subject}/${material.language}/${Date.now()}_${safeName}`;
      const fileRef = ref(storage, objectPath);
      await uploadBytes(fileRef, material.file);
      const fileUrl = await getDownloadURL(fileRef);

      // ✅ add Firestore doc
      await addDoc(collection(db, 'materials'), {
        courseId: material.courseId,
        planId: material.planId,
        type: material.type,                 // 'pdf'
        title: material.title.trim(),
        description: (material.description || '').trim(),
        url: fileUrl,
        subject: material.subject,           // e.g., 'geography'
        language: material.language,         // 'en' | 'hi'
        createdAt: new Date(),
      });

      alert('✅ Material uploaded successfully!');
      setMaterial({
        courseId: '',
        planId: '',
        type: 'pdf',
        title: '',
        description: '',
        file: null,
        subject: '',
        language: 'en',
      });
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error('Upload Error:', err);
      alert('❌ Failed to upload material.');
    }

    setUploading(false);
  };

  return (
    <div className="container" style={{ marginTop:350}} >
      <h2>Upload Course Material</h2>

      <form onSubmit={handleSubmit} className="material-form">
        {/* Course */}
        <label>Course:</label>
        <select
          name="courseId"
          value={material.courseId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        {/* Plan */}
        <label>Plan:</label>
        <select
          name="planId"
          value={material.planId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Plan --</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (₹{p.price})
            </option>
          ))}
        </select>

        {/* Subject (NEW) */}
        <label>Subject:</label>
        <select
          name="subject"
          value={material.subject}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Subject --</option>
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Language (NEW) */}
        <label>Language:</label>
        <select
          name="language"
          value={material.language}
          onChange={handleChange}
          required
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>

        {/* Type */}
        <label>Material Type:</label>
        <select name="type" value={material.type} onChange={handleTypeChange}>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
        </select>

        {/* Title */}
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={material.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <label>Description (optional):</label>
        <textarea
          name="description"
          value={material.description}
          onChange={handleChange}
        />

        {/* File */}
        <label>Upload File:</label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          required
        />

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Material'}
        </button>
      </form>
    </div>
  );
};

export default UploadMaterials;
