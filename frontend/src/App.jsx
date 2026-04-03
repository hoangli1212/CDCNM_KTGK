import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    record_date: "",
    weight: "",
    height: "",
    blood_pressure: "",
    note: "",
  });

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/records/");
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/records/", formData);
      setFormData({
        record_date: "",
        weight: "",
        height: "",
        blood_pressure: "",
        note: "",
      });
      fetchRecords();
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  return (
    <div className="container">
      <h1>Health Management App</h1>

      <h2>Thêm bản ghi sức khỏe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="record_date"
          value={formData.record_date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="weight"
          placeholder="Cân nặng"
          value={formData.weight}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="height"
          placeholder="Chiều cao"
          value={formData.height}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="blood_pressure"
          placeholder="Huyết áp"
          value={formData.blood_pressure}
          onChange={handleChange}
        />
        <input
          type="text"
          name="note"
          placeholder="Ghi chú"
          value={formData.note}
          onChange={handleChange}
        />
        <button type="submit">Thêm</button>
      </form>

      <h2>Danh sách bản ghi</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày</th>
            <th>Cân nặng</th>
            <th>Chiều cao</th>
            <th>Huyết áp</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.record_date}</td>
              <td>{record.weight}</td>
              <td>{record.height}</td>
              <td>{record.blood_pressure}</td>
              <td>{record.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
