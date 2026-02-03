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
import React, { useMemo, useState } from 'react';
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
    category: '',
    subCategory: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const normalizeText = (val) =>
    (val || '')
      .toString()
      .toLowerCase()
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const includesAny = (text, needles) => needles.some((n) => text.includes(n));

  const autoMeta = useMemo(() => {
    const tagsText = course.tags || '';
    const text = normalizeText(
      [course.title, course.description, tagsText].filter(Boolean).join(' ')
    );

    const category = includesAny(text, ['ssc', 'cgl', 'cpo', 'chsl', 'mts', 'gd', 'je', 'jht', 'steno'])
      ? 'SSC'
      : includesAny(text, ['nda', 'cds', 'afcat', 'air force', 'airforce', 'navy', 'army', 'ssb', 'defence', 'defense'])
      ? 'Defence'
      : includesAny(text, ['police', 'constable', 'up police', 'delhi police', 'bihar police', 'mp police', 'rj police', 'hr police'])
      ? 'Police'
      : includesAny(text, ['bank', 'banking', 'ibps', 'sbi', 'rbi', 'po', 'clerk'])
      ? 'Bank'
      : includesAny(text, ['railway', 'railways', 'rrb', 'ntpc', 'group d', 'alp'])
      ? 'Railway'
      : 'Other Exam';

    const subCategory =
      category === 'SSC'
        ? (includesAny(text, ['cgl']) && 'CGL') ||
          (includesAny(text, ['cpo']) && 'CPO') ||
          (includesAny(text, ['chsl']) && 'CHSL') ||
          (includesAny(text, ['mts']) && 'MTS') ||
          (includesAny(text, ['gd']) && 'GD') ||
          (includesAny(text, ['je']) && 'JE') ||
          (includesAny(text, ['jht', 'jmt']) && 'JHT') ||
          (includesAny(text, ['steno', 'stenographer']) && 'Stenographer') ||
          'General'
        : category === 'Defence'
        ? (includesAny(text, ['nda']) && 'NDA') ||
          (includesAny(text, ['cds']) && 'CDS') ||
          (includesAny(text, ['afcat']) && 'AFCAT') ||
          (includesAny(text, ['air force', 'airforce']) && 'Air Force') ||
          (includesAny(text, ['navy']) && 'Navy') ||
          (includesAny(text, ['army']) && 'Army') ||
          'General'
        : category === 'Police'
        ? (includesAny(text, ['up police']) && 'UP Police') ||
          (includesAny(text, ['delhi police']) && 'Delhi Police') ||
          (includesAny(text, ['bihar police']) && 'Bihar Police') ||
          (includesAny(text, ['mp police']) && 'MP Police') ||
          (includesAny(text, ['rj police', 'rajasthan police']) && 'RJ Police') ||
          (includesAny(text, ['hr police', 'haryana police']) && 'HR Police') ||
          (includesAny(text, ['constable']) && 'Constable') ||
          'General'
        : category === 'Bank'
        ? (includesAny(text, ['ibps']) && 'IBPS') ||
          (includesAny(text, ['sbi']) && 'SBI') ||
          (includesAny(text, ['rbi']) && 'RBI') ||
          (includesAny(text, ['po']) && 'PO') ||
          (includesAny(text, ['clerk']) && 'Clerk') ||
          'General'
        : category === 'Railway'
        ? (includesAny(text, ['rrb ntpc', 'ntpc']) && 'RRB NTPC') ||
          (includesAny(text, ['group d']) && 'Group D') ||
          (includesAny(text, ['alp']) && 'ALP') ||
          (includesAny(text, ['je']) && 'JE') ||
          (includesAny(text, ['rrb']) && 'RRB') ||
          'General'
        : 'General';

    return { category, subCategory };
  }, [course.title, course.description, course.tags]);

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
        category: course.category || autoMeta.category,
        subCategory: course.subCategory || autoMeta.subCategory,
        thumbnailUrl: url,
        createdAt: new Date(),
      });

      alert('✅ Course added successfully!');
      setCourse({ title: '', description: '', tags: '', category: '', subCategory: '' });
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

        <label>Category:</label>
        <select
          name="category"
          value={course.category}
          onChange={handleChange}
        >
          <option value="">Auto ({autoMeta.category})</option>
          <option value="SSC">SSC</option>
          <option value="Defence">Defence</option>
          <option value="Police">Police</option>
          <option value="Bank">Bank</option>
          <option value="Railway">Railway</option>
          <option value="Other Exam">Other Exam</option>
        </select>

        <label>Sub Category:</label>
        <input
          type="text"
          name="subCategory"
          value={course.subCategory}
          onChange={handleChange}
          placeholder={`Auto (${autoMeta.subCategory})`}
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
