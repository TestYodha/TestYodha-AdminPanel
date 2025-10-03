
// import React, { useState, useEffect } from 'react';
// import {
//   collection, getDocs, query, where, deleteDoc, doc
// } from 'firebase/firestore';
// import { db, storage } from '../firebase';
// import { ref, deleteObject, listAll } from 'firebase/storage';

// const DeleteCourse = () => {
//   const [deleteType, setDeleteType] = useState('course'); // course, plan, testSeries, pyqs, materials
//   const [courses, setCourses] = useState([]);
//   const [plans, setPlans] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [filteredPlans, setFilteredPlans] = useState([]);
//   const [selectedPlan, setSelectedPlan] = useState('');
//   const [items, setItems] = useState([]); // For PYQs / Materials / Test Series
//   const [selectedItem, setSelectedItem] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fetchCoursesAndPlans = async () => {
//     const courseSnap = await getDocs(collection(db, 'courses'));
//     setCourses(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

//     const planSnap = await getDocs(collection(db, 'plans'));
//     setPlans(planSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//   };

//   const fetchItems = async () => {
//     if (!selectedPlan) return;

//     let collectionName = '';
//     if (deleteType === 'pyqs') collectionName = 'pyqs';
//     if (deleteType === 'materials') collectionName = 'materials';
//     if (deleteType === 'testSeries') collectionName = 'tests';
//     if (!collectionName) return;

//     const q = query(collection(db, collectionName), where('planId', '==', selectedPlan));
//     const snap = await getDocs(q);
//     const fetchedItems = snap.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setItems(fetchedItems);
//   };

//   useEffect(() => {
//     fetchCoursesAndPlans();
//   }, []);

//   useEffect(() => {
//     if (selectedCourse) {
//       setFilteredPlans(plans.filter(plan => plan.courseId === selectedCourse));
//       setSelectedPlan('');
//       setSelectedItem('');
//       setItems([]);
//     } else {
//       setFilteredPlans([]);
//       setSelectedPlan('');
//       setSelectedItem('');
//       setItems([]);
//     }
//   }, [selectedCourse, plans]);

//   useEffect(() => {
//     if (deleteType === 'pyqs' || deleteType === 'materials' || deleteType === 'testSeries') {
//       fetchItems();
//     }
//   }, [selectedPlan, deleteType]);

//   const deleteFileByUrl = async (url) => {
//     try {
//       const decodedUrl = decodeURIComponent(url.split('?')[0]);
//       const bucketPath = decodedUrl.split('/o/')[1];
//       const storageRef = ref(storage, bucketPath);
//       await deleteObject(storageRef);
//     } catch (err) {
//       console.error('Failed to delete storage file:', err);
//     }
//   };

//   const deleteFolder = async (folderPath) => {
//     try {
//       const folderRef = ref(storage, folderPath);
//       const list = await listAll(folderRef);
//       const deletions = list.items.map(item => deleteObject(item));
//       await Promise.all(deletions);
//     } catch (err) {
//       console.error('Failed to delete folder:', err);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedCourse) {
//       alert('Please select a course.');
//       return;
//     }
//     if ((deleteType === 'plan' || deleteType === 'testSeries' || deleteType === 'pyqs' || deleteType === 'materials') && !selectedPlan) {
//       alert('Please select a plan.');
//       return;
//     }
//     if ((deleteType === 'pyqs' || deleteType === 'materials' || deleteType === 'testSeries') && !selectedItem) {
//       alert('Please select an item to delete.');
//       return;
//     }

//     const confirm = window.confirm(`Are you sure you want to delete this ${deleteType}? This cannot be undone.`);
//     if (!confirm) return;

//     setLoading(true);

//     try {
//       if (deleteType === 'pyqs' || deleteType === 'materials') {
//         const collectionName = deleteType;
//         const docRef = doc(db, collectionName, selectedItem);
//         const itemData = items.find(i => i.id === selectedItem);
//         if (itemData && itemData.url) {
//           await deleteFileByUrl(itemData.url);
//         }
//         await deleteDoc(docRef);
//         alert(`✅ ${deleteType === 'pyqs' ? 'PYQ' : 'Material'} deleted.`);

//       } else if (deleteType === 'testSeries') {
//         const testDoc = doc(db, 'tests', selectedItem);
//         await deleteFolder(`testSeries/${selectedItem}`);
//         await deleteDoc(testDoc);
//         alert('✅ Test Series deleted.');

//       } else if (deleteType === 'plan') {
//         // Delete Plan Document
//         await deleteDoc(doc(db, 'plans', selectedPlan));

//         // Delete Materials under Plan
//         const matSnap = await getDocs(query(collection(db, 'materials'), where('planId', '==', selectedPlan)));
//         for (const m of matSnap.docs) {
//           const data = m.data();
//           if (data.url) await deleteFileByUrl(data.url);
//           await deleteDoc(doc(db, 'materials', m.id));
//         }

//         // Delete PYQs under Plan
//         const pyqSnap = await getDocs(query(collection(db, 'pyqs'), where('planId', '==', selectedPlan)));
//         for (const p of pyqSnap.docs) {
//           const data = p.data();
//           if (data.url) await deleteFileByUrl(data.url);
//           await deleteDoc(doc(db, 'pyqs', p.id));
//         }

//         // Delete Tests under Plan
//         const testSnap = await getDocs(query(collection(db, 'tests'), where('planId', '==', selectedPlan)));
//         for (const t of testSnap.docs) {
//           await deleteFolder(`testSeries/${t.id}`);
//           await deleteDoc(doc(db, 'tests', t.id));
//         }

//         alert('✅ Plan and all linked content deleted successfully.');
//       } else {
//         alert('🚧 Deletion logic for this type is not implemented yet.');
//       }

//       // Refresh Data After Deletion
//       await fetchCoursesAndPlans();
//       if (selectedPlan) {
//         await fetchItems();
//       }

//       // Reset Selections
//       setSelectedItem('');
//       setSelectedPlan('');
//       setSelectedCourse('');
//     } catch (err) {
//       console.error(err);
//       alert('❌ Deletion failed. Check console.');
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="container">
//       <h2>🗑️ Delete Content</h2>
//       <p className="warn-text">⚠️ Be careful! This action is irreversible.</p>

//       <div style={{ margin: '20px 0' }}>
//         <label><strong>Delete Type:</strong></label><br />
//         <select value={deleteType} onChange={(e) => setDeleteType(e.target.value)}>
//           <option value="course">Entire Course</option>
//           <option value="plan">Only a Plan</option>
//           <option value="testSeries">Test Series</option>
//           <option value="pyqs">PYQs</option>
//           <option value="materials">Materials</option>
//         </select>
//       </div>

//       <div style={{ marginBottom: '20px' }}>
//         <label>Select Course:</label><br />
//         <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
//           <option value="">-- Select Course --</option>
//           {courses.map((c) => (
//             <option key={c.id} value={c.id}>{c.title}</option>
//           ))}
//         </select>
//       </div>

//       {(deleteType !== 'course') && (
//         <div style={{ marginBottom: '20px' }}>
//           <label>Select Plan:</label><br />
//           <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
//             <option value="">-- Select Plan --</option>
//             {filteredPlans.map((p) => (
//               <option key={p.id} value={p.id}>{p.name}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {(deleteType === 'pyqs' || deleteType === 'materials' || deleteType === 'testSeries') && (
//         <div style={{ marginBottom: '20px' }}>
//           <label>Select {deleteType === 'pyqs' ? 'PYQ' : deleteType === 'materials' ? 'Material' : 'Test Series'}:</label><br />
//           <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
//             <option value="">-- Select --</option>
//             {items.map((item) => (
//               <option key={item.id} value={item.id}>{item.title || item.name}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       <button onClick={handleDelete} disabled={loading}>
//         {loading ? 'Deleting...' : 'Delete'}
//       </button>
//     </div>
//   );
// };

// export default DeleteCourse;



import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, query, where, deleteDoc, doc
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, deleteObject, listAll } from 'firebase/storage';

const DeleteCourse = () => {
  const [deleteType, setDeleteType] = useState('course'); // course, plan, testSeries, pyqs, materials
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [items, setItems] = useState([]); // For PYQs / Materials / Test Series
  const [selectedItem, setSelectedItem] = useState('');
  const [loading, setLoading] = useState(false);

  // ---------- Fetchers ----------
  const fetchCoursesAndPlans = async () => {
    const courseSnap = await getDocs(collection(db, 'courses'));
    setCourses(courseSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    const planSnap = await getDocs(collection(db, 'plans'));
    setPlans(planSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchItems = async () => {
    if (!selectedPlan) return;

    let collectionName = '';
    if (deleteType === 'pyqs') collectionName = 'pyqs';
    if (deleteType === 'materials') collectionName = 'materials';
    if (deleteType === 'testSeries') collectionName = 'tests';
    if (!collectionName) return;

    const qy = query(collection(db, collectionName), where('planId', '==', selectedPlan));
    const snap = await getDocs(qy);
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchCoursesAndPlans(); }, []);

  useEffect(() => {
    if (selectedCourse) {
      setFilteredPlans(plans.filter(plan => plan.courseId === selectedCourse));
      setSelectedPlan('');
      setSelectedItem('');
      setItems([]);
    } else {
      setFilteredPlans([]);
      setSelectedPlan('');
      setSelectedItem('');
      setItems([]);
    }
  }, [selectedCourse, plans]);

  useEffect(() => {
    if (deleteType === 'pyqs' || deleteType === 'materials' || deleteType === 'testSeries') {
      fetchItems();
    }
  }, [selectedPlan, deleteType]);

  // ---------- Storage Helpers ----------
  const deleteFileByUrl = async (url) => {
    if (!url) return;
    try {
      const decodedUrl = decodeURIComponent(url.split('?')[0]); // strip token
      const bucketPath = decodedUrl.split('/o/')[1]; // path with %2F
      if (!bucketPath) return;
      const storageRef = ref(storage, bucketPath);
      await deleteObject(storageRef);
    } catch (err) {
      console.error('Failed to delete storage file:', err);
    }
  };

  // Recursively delete a folder and all nested prefixes/items
  const deleteFolderRecursive = async (folderPath) => {
    try {
      const folderRef = ref(storage, folderPath);
      const listing = await listAll(folderRef);

      // delete items in parallel
      await Promise.all(
        listing.items.map(itemRef => deleteObject(itemRef).catch(err => {
          console.error('deleteObject failed:', itemRef.fullPath, err);
        }))
      );

      // delete all subfolders (prefixes)
      await Promise.all(
        listing.prefixes.map(prefixRef => deleteFolderRecursive(prefixRef.fullPath))
      );
    } catch (err) {
      console.error('Failed to delete folder:', folderPath, err);
    }
  };

  // ---------- Cascade helpers ----------
  const deleteTestsForPlan = async (planId) => {
    const testSnap = await getDocs(query(collection(db, 'tests'), where('planId', '==', planId)));
    await Promise.all(testSnap.docs.map(async (t) => {
      const testId = t.id;

      // OPTIONAL: delete subcollection "userAttempts" if present
      try {
        const uaSnap = await getDocs(collection(db, 'tests', testId, 'userAttempts'));
        await Promise.all(uaSnap.docs.map(ua => deleteDoc(doc(db, 'tests', testId, 'userAttempts', ua.id))));
      } catch (e) {
        // ignore if subcollection doesn't exist or rules restrict; log for visibility
        console.warn(`userAttempts cleanup skipped for test ${testId}:`, e?.message || e);
      }

      // If you store any assets per test in Storage:
      await deleteFolderRecursive(`testSeries/${testId}`);

      await deleteDoc(doc(db, 'tests', testId));
    }));
  };

  const deleteMaterialsForPlan = async (planId) => {
    const matSnap = await getDocs(query(collection(db, 'materials'), where('planId', '==', planId)));
    await Promise.all(matSnap.docs.map(async (m) => {
      const data = m.data();
      if (data?.url) await deleteFileByUrl(data.url);
      await deleteDoc(doc(db, 'materials', m.id));
    }));
  };

  const deletePyqsForPlan = async (planId) => {
    const pyqSnap = await getDocs(query(collection(db, 'pyqs'), where('planId', '==', planId)));
    await Promise.all(pyqSnap.docs.map(async (p) => {
      const data = p.data();
      if (data?.url) await deleteFileByUrl(data.url);
      await deleteDoc(doc(db, 'pyqs', p.id));
    }));
  };

  const deletePlanCascade = async (planId) => {
    // delete children first
    await Promise.all([
      deleteMaterialsForPlan(planId),
      deletePyqsForPlan(planId),
      deleteTestsForPlan(planId),
    ]);

    // finally remove plan doc
    await deleteDoc(doc(db, 'plans', planId));
  };

  const deleteCourseCascade = async (courseId) => {
    // 1) delete all plans under this course (and all their children)
    const planSnap = await getDocs(query(collection(db, 'plans'), where('courseId', '==', courseId)));
    await Promise.all(planSnap.docs.map(async (p) => {
      await deletePlanCascade(p.id);
    }));

    // 2) (Optional safety) clean up any stray children directly linked by courseId
    //    in case any doc was created without planId or plan was removed earlier.
    //    These should usually be empty with good data hygiene, but safe to keep.
    const strayCollections = ['materials', 'pyqs', 'tests'];
    for (const coll of strayCollections) {
      const snap = await getDocs(query(collection(db, coll), where('courseId', '==', courseId)));
      await Promise.all(snap.docs.map(async (d) => {
        if (coll === 'materials' || coll === 'pyqs') {
          const data = d.data();
          if (data?.url) await deleteFileByUrl(data.url);
        }
        if (coll === 'tests') {
          // clean subcollection + storage
          try {
            const uaSnap = await getDocs(collection(db, 'tests', d.id, 'userAttempts'));
            await Promise.all(uaSnap.docs.map(ua => deleteDoc(doc(db, 'tests', d.id, 'userAttempts', ua.id))));
          } catch {}
          await deleteFolderRecursive(`testSeries/${d.id}`);
        }
        await deleteDoc(doc(db, coll, d.id));
      }));
    }

    // 3) delete course thumbnail from storage (if stored as URL in doc)
    try {
      const cDoc = doc(db, 'courses', courseId);
      const courseDataSnap = await getDocs(query(collection(db, 'courses'), where('__name__', '==', courseId)));
      const dataDoc = courseDataSnap.docs[0]?.data();
      if (dataDoc?.thumbnailUrl) {
        await deleteFileByUrl(dataDoc.thumbnailUrl);
      }
      // 4) finally delete the course doc
      await deleteDoc(cDoc);
    } catch (e) {
      // if lookup by query fails (rules etc.), just attempt direct delete
      console.warn('Course thumbnail cleanup skipped:', e?.message || e);
      await deleteDoc(doc(db, 'courses', courseId));
    }

    // 5) If you maintain any course-level storage folders, clean here
    // e.g. await deleteFolderRecursive(`courses/${courseId}`);
  };

  // ---------- UI action ----------
  const handleDelete = async () => {
    if (!selectedCourse) {
      alert('Please select a course.');
      return;
    }
    if ((deleteType === 'plan' || deleteType === 'testSeries' || deleteType === 'pyqs' || deleteType === 'materials') && !selectedPlan) {
      alert('Please select a plan.');
      return;
    }
    if ((deleteType === 'pyqs' || deleteType === 'materials' || deleteType === 'testSeries') && !selectedItem) {
      alert('Please select an item to delete.');
      return;
    }

    const ok = window.confirm(`Are you sure you want to delete this ${deleteType}? This cannot be undone.`);
    if (!ok) return;

    setLoading(true);

    try {
      if (deleteType === 'pyqs' || deleteType === 'materials') {
        const collectionName = deleteType;
        const docRef = doc(db, collectionName, selectedItem);
        const itemData = items.find(i => i.id === selectedItem);
        if (itemData?.url) await deleteFileByUrl(itemData.url);
        await deleteDoc(docRef);
        alert(`✅ ${deleteType === 'pyqs' ? 'PYQ' : 'Material'} deleted.`);

      } else if (deleteType === 'testSeries') {
        // delete subcollection (if any) + storage + doc
        try {
          const uaSnap = await getDocs(collection(db, 'tests', selectedItem, 'userAttempts'));
          await Promise.all(uaSnap.docs.map(ua => deleteDoc(doc(db, 'tests', selectedItem, 'userAttempts', ua.id))));
        } catch {}
        await deleteFolderRecursive(`testSeries/${selectedItem}`);
        await deleteDoc(doc(db, 'tests', selectedItem));
        alert('✅ Test Series deleted.');

      } else if (deleteType === 'plan') {
        await deletePlanCascade(selectedPlan);
        alert('✅ Plan and all linked content deleted successfully.');

      } else if (deleteType === 'course') {
        await deleteCourseCascade(selectedCourse);
        alert('✅ Course and everything under it deleted successfully.');
      } else {
        alert('🚧 Deletion logic for this type is not implemented yet.');
      }

      // Refresh Data After Deletion
      await fetchCoursesAndPlans();
      if (selectedPlan) await fetchItems();

      // Reset Selections
      setSelectedItem('');
      setSelectedPlan('');
      setSelectedCourse('');
    } catch (err) {
      console.error(err);
      alert('❌ Deletion failed. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>🗑️ Delete Content</h2>
      <p className="warn-text">⚠️ Be careful! This action is irreversible.</p>

      <div style={{ margin: '20px 0' }}>
        <label><strong>Delete Type:</strong></label><br />
        <select value={deleteType} onChange={(e) => setDeleteType(e.target.value)}>
          <option value="course">Entire Course</option>
          <option value="plan">Only a Plan</option>
          <option value="testSeries">Test Series</option>
          <option value="pyqs">PYQs</option>
          <option value="materials">Materials</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Course:</label><br />
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {(deleteType !== 'course') && (
        <div style={{ marginBottom: '20px' }}>
          <label>Select Plan:</label><br />
          <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
            <option value="">-- Select Plan --</option>
            {filteredPlans.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {(deleteType === 'pyqs' || deleteType === 'materials' || deleteType === 'testSeries') && (
        <div style={{ marginBottom: '20px' }}>
          <label>
            Select {deleteType === 'pyqs' ? 'PYQ' : deleteType === 'materials' ? 'Material' : 'Test Series'}:
          </label><br />
          <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
            <option value="">-- Select --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>{item.title || item.name}</option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
};

export default DeleteCourse;
