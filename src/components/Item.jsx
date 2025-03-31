const Item = ({ item, onDelete }) => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", border: "1px solid #ddd", padding: "10px" }}>
        <span>{item.name}</span>
        <div>
          <button onClick={() => onDelete(item.id)} style={{ marginRight: "10px" }}>Delete</button>
          <button>Edit</button>
        </div>
      </div>
    );
  };
  
  export default Item;
  