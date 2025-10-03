
import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import "./CarouselManager.css";

const MAX_CARDS = 6;

const CarouselManager = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [previewFiles, setPreviewFiles] = useState({});

  const fetchImages = async () => {
    const q = query(collection(db, "carouselImages"), orderBy("order"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const getImageByOrder = (order) =>
    images.find((img) => img.order === order);

  const handleFileChange = (e, order) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [order]: file }));
      setPreviewFiles((prev) => ({
        ...prev,
        [order]: URL.createObjectURL(file),
      }));
    }
  };

  const handleUpload = async (order) => {
    const file = selectedFiles[order];
    if (!file) return;

    setUploading(true);

    try {
      const filename = `carousel/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const existing = getImageByOrder(order);

      if (existing && existing.id) {
        if (existing.storagePath) {
          try {
            await deleteObject(ref(storage, existing.storagePath));
          } catch (err) {
            console.warn("Old image not found, skipping delete.");
          }
        }

        await updateDoc(doc(db, "carouselImages", existing.id), {
          imageUrl: url,
          storagePath: filename,
          createdAt: serverTimestamp(),
          active: true,
        });
      } else {
        await addDoc(collection(db, "carouselImages"), {
          imageUrl: url,
          storagePath: filename,
          order,
          createdAt: serverTimestamp(),
          active: true,
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }

    setUploading(false);
    setSelectedFiles((prev) => ({ ...prev, [order]: null }));
    setPreviewFiles((prev) => ({ ...prev, [order]: null }));
    fetchImages();
  };

  const handleDelete = async (img) => {
    try {
      if (img?.storagePath) {
        await deleteObject(ref(storage, img.storagePath));
      }
    } catch (err) {
      console.warn("Skipping storage delete:", err.message);
    }

    await deleteDoc(doc(db, "carouselImages", img.id));
    fetchImages();
  };

  return (
    <div className="carousel-wrapper">
      <h2>🖼️ Carousel (Homepage Banners)</h2>
      <div className="card-grid">
        {[...Array(MAX_CARDS)].map((_, i) => {
          const order = i + 1;
          const data = getImageByOrder(order);

          return (
            <div className="carousel-card" key={order}>
              <p className="card-title">Order: {order}</p>

              {previewFiles[order] ? (
                <img src={previewFiles[order]} alt={`preview-${order}`} />
              ) : data?.imageUrl ? (
                <img src={data.imageUrl} alt={`carousel-${order}`} />
              ) : (
                <div className="empty-image">No Image</div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, order)}
              />

              <button
                onClick={() => handleUpload(order)}
                disabled={uploading || !selectedFiles[order]}
              >
                {data?.imageUrl ? "Replace" : "Upload"}
              </button>

              {data?.imageUrl && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(data)}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CarouselManager;
