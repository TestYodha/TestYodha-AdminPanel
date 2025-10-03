

// // ✅ FILE: pages/CreatePlan.jsx
// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
// } from 'firebase/firestore';
// import './CreatePlan.css';

// const predefinedPlans = [
//   { name: 'Free', price: 0 },
//   { name: 'Silver', price: 199 },
//   { name: 'Gold', price: 399 },
//   { name: 'Platinum', price: 899 },
// ];

// const durations = [
//   { label: 'Monthly (1 month)', value: 1 },
//   { label: 'Quarterly (3 months)', value: 3 },
//   { label: 'Half-Yearly (6 months)', value: 6 },
//   { label: 'Yearly (12 months)', value: 12 },
// ];

// const CreatePlan = () => {
//   const [courses, setCourses] = useState([]);
//   const [plan, setPlan] = useState({
//     courseId: '',
//     name: 'Free',
//     price: 0,
//     features: '',
//     durationInMonths: 1,
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       const snapshot = await getDocs(collection(db, 'courses'));
//       const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setCourses(courseList);
//     };
//     fetchCourses();
//   }, []);

//   const handlePlanChange = (e) => {
//     const selected = predefinedPlans.find(p => p.name === e.target.value);
//     setPlan(prev => ({
//       ...prev,
//       name: selected.name,
//       price: selected.price,
//       durationInMonths: selected.name === 'Free' ? null : 1,
//     }));
//   };

//   const handleChange = (e) => {
//     setPlan({ ...plan, [e.target.name]: e.target.value });
//   };

//   const handleDurationChange = (e) => {
//     setPlan({ ...plan, durationInMonths: parseInt(e.target.value) });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const q = query(
//         collection(db, 'plans'),
//         where('courseId', '==', plan.courseId),
//         where('name', '==', plan.name.trim())
//       );
//       const existing = await getDocs(q);

//       if (!existing.empty) {
//         alert('⚠️ A plan with this name already exists for the selected course!');
//         setLoading(false);
//         return;
//       }

//       await addDoc(collection(db, 'plans'), {
//         courseId: plan.courseId,
//         name: plan.name.trim(),
//         price: parseFloat(plan.price),
//         features: plan.features.split(',').map(f => f.trim()),
//         durationInMonths: plan.name === 'Free' ? null : parseInt(plan.durationInMonths),
//         createdAt: new Date(),
//       });

//       alert('✅ Plan added successfully!');
//       setPlan({ courseId: '', name: 'Free', price: 0, features: '', durationInMonths: 1 });
//     } catch (err) {
//       alert('❌ Error creating plan');
//       console.error(err);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="plan-container">
//       <h2>Create Subscription Plan</h2>
//       <form onSubmit={handleSubmit} className="plan-form">
//         <label>Course:</label>
//         <select name="courseId" value={plan.courseId} onChange={handleChange} required>
//           <option value="">-- Select Course --</option>
//           {courses.map((c) => (
//             <option key={c.id} value={c.id}>{c.title}</option>
//           ))}
//         </select>

//         <label>Plan:</label>
//         <select name="name" value={plan.name} onChange={handlePlanChange} required>
//           {predefinedPlans.map((p) => (
//             <option key={p.name} value={p.name}>{p.name} (₹{p.price})</option>
//           ))}
//         </select>

//         <label>Price (auto-filled):</label>
//         <input type="number" name="price" value={plan.price} disabled />

//         {plan.name !== 'Free' && (
//           <>
//             <label>Duration:</label>
//             <select
//               name="durationInMonths"
//               value={plan.durationInMonths}
//               onChange={handleDurationChange}
//               required
//             >
//               {durations.map((d) => (
//                 <option key={d.value} value={d.value}>{d.label}</option>
//               ))}
//             </select>
//           </>
//         )}

//         <label>Features (comma separated):</label>
//         <textarea
//           name="features"
//           value={plan.features}
//           onChange={handleChange}
//           placeholder="e.g. Test Series, PYQs, Notes"
//           required
//         ></textarea>

//         <button type="submit" disabled={loading}>
//           {loading ? 'Saving...' : 'Create Plan'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreatePlan;





// ✅ FILE: pages/CreatePlan.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import './CreatePlan.css';

const durations = [
  { label: 'Trial (1 Day)', value: 0.03 },
  { label: '15 Days', value: 0.5 },
  { label: '1 Month', value: 1 },
  { label: '2 Months', value: 2 },
  { label: '3 Months', value: 3 },
  { label: '4 Months', value: 4 },
  { label: '5 Months', value: 5 },
  { label: '6 Months', value: 6 },
  { label: '7 Months', value: 7 },
  { label: '8 Months', value: 8 },
  { label: '9 Months', value: 9 },
  { label: '10 Months', value: 10 },
  { label: '11 Months', value: 11 },
  { label: '1 Year (12 Months)', value: 12 },
  { label: '18 Months', value: 18 },
  { label: '2 Years (24 Months)', value: 24 },
];


const CreatePlan = () => {
  const [courses, setCourses] = useState([]);
  const [plan, setPlan] = useState({
    courseId: '',
    name: '',
    price: '',
    features: '',
    durationInMonths: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, 'courses'));
      const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const q = query(
        collection(db, 'plans'),
        where('courseId', '==', plan.courseId),
        where('name', '==', plan.name.trim())
      );
      const existing = await getDocs(q);

      if (!existing.empty) {
        alert('⚠️ A plan with this name already exists for the selected course!');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'plans'), {
        courseId: plan.courseId,
        name: plan.name.trim(),
        price: parseFloat(plan.price),
        features: plan.features.split(',').map(f => f.trim()),
        durationInMonths: parseInt(plan.durationInMonths),
        createdAt: new Date(),
      });

      alert('✅ Plan added successfully!');
      setPlan({ courseId: '', name: '', price: '', features: '', durationInMonths: '' });
    } catch (err) {
      alert('❌ Error creating plan');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="plan-container">
      <h2>Create Subscription Plan</h2>
      <form onSubmit={handleSubmit} className="plan-form">
        <label>Course:</label>
        <select name="courseId" value={plan.courseId} onChange={handleChange} required>
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <label>Plan Name:</label>
        <input
          type="text"
          name="name"
          value={plan.name}
          onChange={handleChange}
          placeholder="e.g. Silver / Pro / Ultimate"
          required
        />

        <label>Price (₹):</label>
        <input
          type="number"
          name="price"
          value={plan.price}
          onChange={handleChange}
          placeholder="e.g. 199"
          required
        />

        <label>Duration:</label>
        <select
          name="durationInMonths"
          value={plan.durationInMonths}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Duration --</option>
          {durations.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>

        <label>Features (comma separated):</label>
        <textarea
          name="features"
          value={plan.features}
          onChange={handleChange}
          placeholder="e.g. Test Series, PYQs, Notes"
          required
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Create Plan'}
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;
