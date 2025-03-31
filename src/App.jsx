import { useState, useEffect } from "react";
import ItemList from "./components/ItemList";
import axios from "axios";

const API_URI = `http://localhost:8000/doors`;


function App() {
  const [items, setItems] = useState([]);

  // Fetch items on mount
  useEffect(() => {
    axios.get(API_URI)
      .then(response => setItems(response.data))
      .catch(error => console.error("Error fetching items:", error));
  }, []);

  // Handle delete request
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URI}/${id}`);
      setItems(items.filter(item => item.id !== id)); // Update state after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <h1>Doors List</h1>
      <ItemList items={items} onDelete={handleDelete} />
    </div>
  );
}

export default App;