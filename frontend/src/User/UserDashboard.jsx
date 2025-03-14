import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stores", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStores(data || []);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    };

    fetchStores();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setShowModal(true);
    setRating(0); 
  };

  const submitRating = async () => {
    if (!selectedStore || rating < 1 || rating > 5) {
      alert("Invalid rating. Please select a value between 1 and 5.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/ratings/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ storeId: selectedStore._id, rating }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit rating");
      }
  
      alert("Rating submitted successfully!");
      setShowModal(false); 
      setRating(0); 
    } catch (error) {
      console.error("Error submitting rating:", error.message);
    }
  };
  
  return (
    <div className="user-container">
      <div className="header">
        <h1>User Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h2>Available Stores</h2>
      <div className="store-grid">
        {stores.map((store) => (
          <div className="store-card" key={store._id}>
            <h3>{store.name}</h3>
            <p>Email: {store.email}</p>
            <p className="rating">⭐ {store.ratings?.length || "No Ratings"}</p>
            <button className="rate-btn" onClick={() => openRatingModal(store)}>Rate</button>
          </div>
        ))}
      </div>

      {showModal && selectedStore && (
        <div className="modal">
          <div className="modal-content">
            <h2>Rate {selectedStore.name}</h2>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value="0">Select Rating</option>
              <option value="1">⭐</option>
              <option value="2">⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
            </select>
            <button onClick={submitRating}>Submit Rating</button>
<button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>

          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
