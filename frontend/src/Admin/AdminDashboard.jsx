import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "" });
  const navigate = useNavigate();

  // ✅ Fetch Dashboard Stats, Stores, and Users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const storesRes = await fetch("http://localhost:5000/api/admin/stores", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const usersRes = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const statsData = await statsRes.json();
        const storesData = await storesRes.json();
        const usersData = await usersRes.json();

        setStats(statsData);
        setStores(storesData);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Handle Store Addition
  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/admin/add-store", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(newStore),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        return;
      }

      const addedStore = await response.json();
      setStores([...stores, addedStore.store]);
      setShowForm(false);
      setNewStore({ name: "", email: "", address: "" });
    } catch (error) {
      console.error("Error adding store:", error);
      alert("Error adding store. Please try again.");
    }
  };

  // ✅ Handle Store Deletion
  const handleDeleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      await fetch(`http://localhost:5000/api/admin/store/${storeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setStores(stores.filter(store => store._id !== storeId));
    } catch (error) {
      console.error("Failed to delete store:", error);
    }
  };

  // ✅ Handle User Deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch(`http://localhost:5000/api/admin/user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // ✅ Filtered Stores and Users
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="admin-stats">
        <div className="stat-box">Total Users: {stats.totalUsers || 0}</div>
        <div className="stat-box">Total Stores: {stats.totalStores || 0}</div>
        <div className="stat-box">Total Ratings: {stats.totalRatings || 0}</div>
      </div>

      {/* ✅ Search Box */}
      <input
        type="text"
        placeholder="Search users or stores..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ✅ Add Store Section */}
      <div className="add-store-section">
        <button className="add-store-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Store"}
        </button>

        {showForm && (
          <form className="add-store-form" onSubmit={handleAddStore}>
            <input
              type="text"
              placeholder="Store Name"
              value={newStore.name}
              onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Store Email"
              value={newStore.email}
              onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
              required
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>

      {/* ✅ Stores List */}
      <h2>Stores</h2>
      <div className="store-grid">
        {filteredStores.map(store => (
          <div className="store-card" key={store._id}>
            <h3>{store.name}</h3>
            <p>Email: {store.email}</p>
            <p className="rating">⭐ {store.ratings?.length || "No Ratings"}</p>
            <button className="delete-btn" onClick={() => handleDeleteStore(store._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* ✅ Normal Users Section */}
      <h2>Users</h2>
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div className="user-card" key={user._id}>
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
