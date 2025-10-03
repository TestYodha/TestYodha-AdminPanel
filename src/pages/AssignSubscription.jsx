// ✅ FILE: pages/AssignSubscription.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import './AssignSubscription.css';

const AssignSubscription = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  const [form, setForm] = useState({
    userId: '',
    courseId: '',
    planId: ''
  });

  const [loading, setLoading] = useState(false);

  // Fetch all users, courses, plans on load
  useEffect(() => {
    const fetchData = async () => {
      const userSnap = await getDocs(collection(db, 'users'));
      const courseSnap = await getDocs(collection(db, 'courses'));
      const planSnap = await getDocs(collection(db, 'plans'));

      setUsers(userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCourses(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setPlans(planSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  // Filter plans when course is selected
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const matchedPlans = plans.filter(plan => plan.courseId === courseId);
    setFilteredPlans(matchedPlans);
    setForm({ ...form, courseId, planId: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    const { userId, courseId, planId } = form;
    if (!userId || !courseId || !planId) {
      alert('⚠️ Please complete all fields');
      return;
    }

    setLoading(true);

    try {
      const selectedPlan = plans.find(p => p.id === planId);
      const startDate = new Date();

      // Calculate endDate only if plan has a duration
      let endDate = null;
      if (selectedPlan.durationInMonths) {
        endDate = new Date();
        endDate.setMonth(endDate.getMonth() + selectedPlan.durationInMonths);
      }

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert('❌ User not found!');
        setLoading(false);
        return;
      }

      const subscriptionData = {
        courseId,
        planId,
        planName: selectedPlan.name,
        price: selectedPlan.price,
        durationInMonths: selectedPlan.durationInMonths ?? null,
        startDate,
        endDate,
        createdAt: new Date(),
      };

      await updateDoc(userRef, {
        subscriptions: arrayUnion(subscriptionData),
      });

      alert('✅ Subscription assigned successfully!');
      setForm({ userId: '', courseId: '', planId: '' });
      setFilteredPlans([]);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to assign subscription.');
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Assign Subscription</h2>
      <form className="subscription-form" onSubmit={handleAssign}>
        <label>Select User:</label>
        <select name="userId" value={form.userId} onChange={handleChange} required>
          <option value="">-- Select User --</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName} ({u.email})
            </option>
          ))}
        </select>

        <label>Select Course:</label>
        <select name="courseId" value={form.courseId} onChange={handleCourseChange} required>
          <option value="">-- Select Course --</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <label>Select Plan:</label>
        <select name="planId" value={form.planId} onChange={handleChange} required>
          <option value="">-- Select Plan --</option>
          {filteredPlans.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.durationInMonths ? `${p.durationInMonths} mo` : 'Lifetime'}) - ₹{p.price}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Assigning...' : 'Assign Subscription'}
        </button>
      </form>
    </div>
  );
};

export default AssignSubscription;
