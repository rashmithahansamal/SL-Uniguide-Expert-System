import React, { useState } from "react";

function App() {
  const [stream, setStream] = useState("");
  const [district, setDistrict] = useState("");
  const [zscore, setZscore] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    setError("");
    setRecommendations([]);
    try {
      const resp = await fetch("http://localhost:8000/recommendations/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stream: stream.trim(),
          district: district.trim(),
          zscore: parseFloat(zscore),
        }),
      });
      if (!resp.ok) {
        throw new Error("No recommendations found or server error.");
      }
      const data = await resp.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err.message || "Unexpected error");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial" }}>
      <h2>University Course Recommender</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label>Stream: </label>
          <input value={stream} onChange={(e) => setStream(e.target.value)} required />
        </div>
        <div>
          <label>District: </label>
          <input value={district} onChange={(e) => setDistrict(e.target.value)} required />
        </div>
        <div>
          <label>Z-score: </label>
          <input
            type="number"
            step="0.01"
            value={zscore}
            onChange={(e) => setZscore(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>
          Get Recommendations
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
      {recommendations.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Top Recommendations</h3>
          <ul>
            {recommendations.map((rec, idx) => (
              <li key={idx}>
                <b>{rec.Course}</b> at {rec.University} (Z Cutoff: {rec.Z_Cutoff}) - Confidence: {rec.Confidence.toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 

export default App; 
