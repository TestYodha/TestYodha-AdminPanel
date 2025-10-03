// // ✅ FILE: pages/AddCourse.jsx
// import React, { useState } from 'react';
// import { db, storage } from '../firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import './CreatePlan.css';

// const AddCourse = () => {
//   const [course, setCourse] = useState({
//     title: '',
//     description: '',
//     tags: '',
//   });
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setCourse({ ...course, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files[0]) setImage(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!image) return alert('Please upload a thumbnail image');
//     setLoading(true);

//     try {
//       const imageRef = ref(storage, `course-thumbnails/${course.title}_${Date.now()}.jpg`);
//       await uploadBytes(imageRef, image);
//       const url = await getDownloadURL(imageRef);

//       await addDoc(collection(db, 'courses'), {
//         ...course,
//         tags: course.tags.split(',').map((t) => t.trim()),
//         thumbnailUrl: url,
//         createdAt: new Date(),
//       });

//       alert('✅ Course added successfully!');
//       setCourse({ title: '', description: '', tags: '' });
//       setImage(null);
//     } catch (err) {
//       console.error(err);
//       alert('❌ Error uploading course');
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="plan-container">
//       <h2>Add New Course</h2>
//       <form onSubmit={handleSubmit} className="plan-form">
//         <label>Course Title:</label>
//         <input
//           type="text"
//           name="title"
//           value={course.title}
//           onChange={handleChange}
//           required
//         />

//         <label>Description:</label>
//         <textarea
//           name="description"
//           value={course.description}
//           onChange={handleChange}
//           placeholder="Enter course details..."
//           required
//         ></textarea>

//         <label>Tags (comma separated):</label>
//         <input
//           type="text"
//           name="tags"
//           value={course.tags}
//           onChange={handleChange}
//           placeholder="e.g. defence, upsc, general"
//           required
//         />

//         <label>Thumbnail Image:</label>
//         <input type="file" accept="image/*" onChange={handleFileChange} required />

//         <button type="submit" disabled={loading}>
//           {loading ? 'Uploading...' : 'Add Course'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddCourse;

// ✅ FILE: pages/AddCourse.jsx
import React, { useState } from 'react';
import { db, storage } from '../firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './CreatePlan.css';

const AddCourse = () => {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    tags: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please upload a thumbnail image');
    setLoading(true);

    try {
      // 🔍 Check if course with same title already exists
      const q = query(
        collection(db, 'courses'),
        where('title', '==', course.title.trim())
      );
      const existing = await getDocs(q);
      if (!existing.empty) {
        alert('⚠️ Course with this title already exists!');
        setLoading(false);
        return;
      }

      // ✅ Upload thumbnail
      const imageRef = ref(
        storage,
        `course-thumbnails/${course.title}_${Date.now()}.jpg`
      );
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);

      // ✅ Add course to Firestore
      await addDoc(collection(db, 'courses'), {
        ...course,
        title: course.title.trim(),
        tags: course.tags.split(',').map((t) => t.trim()),
        thumbnailUrl: url,
        createdAt: new Date(),
      });

      alert('✅ Course added successfully!');
      setCourse({ title: '', description: '', tags: '' });
      setImage(null);
    } catch (err) {
      console.error(err);
      alert('❌ Error uploading course');
    }

    setLoading(false);
  };

  return (
    <div className="plan-container">
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit} className="plan-form">
        <label>Course Title:</label>
        <input
          type="text"
          name="title"
          value={course.title}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={course.description}
          onChange={handleChange}
          placeholder="Enter course details..."
          required
        ></textarea>

        <label>Tags (comma separated):</label>
        <input
          type="text"
          name="tags"
          value={course.tags}
          onChange={handleChange}
          placeholder="e.g. defence, upsc, general"
          required
        />

        <label>Thumbnail Image:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required />

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
