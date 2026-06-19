import { useState, useRef, useEffect } from "react";
import "./photogallery.css";
 
export default function PhotoGallery({ album, onBack }) {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const handleAddPhotosClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    if (!album?.id) {
      alert("Album ID not found");
      return;
    }

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          `http://localhost:8084/api/photos/upload/${album.id}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.text();

        if (!response.ok) {
          alert("Upload failed: " + result);
          console.log(result);
          return;
        }
      } catch (error) {
        console.error(error);
        alert("Backend connection failed");
        return;
      }
    }

    alert("Photos uploaded successfully");

    await getPhotos();   // important: reload from SQL
    e.target.value = "";
  };

  async function getPhotos() {
    if (!album?.id) {
      console.log("Album ID missing");
      return;
    }

    console.log("Current album id:", album.id);

    try {
      const response = await fetch(
        `http://localhost:8084/api/photos/album/${album.id}`
      );

      if (!response.ok) {
        console.error("Photo fetch failed with status:", response.status);
        return;
      }

      const data = await response.json();
      console.log("Photos from backend:", data);

      const formattedPhotos = Array.isArray(data)
        ? data.map((p) => ({
            id: p.photoId,
            name: p.photoName,
            url: p.filePath,
          }))
        : [];

      setPhotos(formattedPhotos);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    }
  }

  useEffect(() => {
    getPhotos();
  }, [album?.id]);

  return (
    <div className="pg-root">
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      {/* Header */}
      <header className="pg-header">
        <button className="pg-back-btn" onClick={onBack}>
          &larr; Back to Albums
        </button>
        <button className="pg-add-btn" onClick={handleAddPhotosClick}>
          <span className="pg-add-icon">＋</span>
          Add Photos to {album?.name}
        </button>
      </header>

      <div className="pg-divider" />

      {/* Grid */}
      <main className="pg-grid">
        {photos.length === 0 ? (
          <p className="pg-empty">No photos added yet.</p>
        ) : (
          photos.map((photo) => (
            <div className="pg-card" key={photo.id}>
              <div className="pg-thumb">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="pg-thumb-img"
                />
              </div>

              <div className="pg-card-body">
                <p className="pg-album-name">{photo.name}</p>
                <div className="pg-actions">
                  <button
                    className="pg-link-btn"
                    style={{ color: "#ff4d4d" }}
                    onClick={() => {
                      if (window.confirm("Remove this photo from the gallery?")) {
                        setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
                      }
                    }}
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}