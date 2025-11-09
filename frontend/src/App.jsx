import React, { useState } from "react";
import './App.css';

function App() {
  const [stream, setStream] = useState("");
  const [district, setDistrict] = useState("");
  const [zscore, setZscore] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [moreAlternatives, setMoreAlternatives] = useState([]);
  const [showMoreAlternatives, setShowMoreAlternatives] = useState(false);
  const [error, setError] = useState("");

  // Stream options for dropdown
  const streamOptions = [
    "Physical ",
    "Biological Science", 
    "Mathematics",
    "Commerce",
    "Arts",
    "IT"
  ];

  // District options for dropdown
  const districtOptions = [
    "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", 
    "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", 
    "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", 
    "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
  ];

  const fetchRecommendations = async () => {
    setError("");
    setRecommendations([]);
    setMoreAlternatives([]);
    setShowMoreAlternatives(false);
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

  const fetchMoreAlternatives = async () => {
  try {
    const resp = await fetch("http://localhost:8000/alternatives/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stream: stream.trim(),
        district: district.trim(),
        zscore: parseFloat(zscore),
      }),
    });
    
    if (!resp.ok) {
      throw new Error("No alternative solutions found.");
    }
    
    const data = await resp.json();
    setMoreAlternatives(data.alternatives);
    setShowMoreAlternatives(true);
  } catch (err) {
    setError("Could not fetch alternative solutions: " + err.message);
  }
};

  const submitHandler = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  return (
    <div className="app-container">
      {/* Main Content - Full Width */}
      <div className="main-content">
        <div className="header">
          <div className="title-container">
            <span className="graduation-cap">🎓</span>
            <h1>Uniguide Expert System</h1>
          </div>
          <p className="subtitle">Your intelligent university guidance companion</p>
        </div>

        <form onSubmit={submitHandler} className="recommendation-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Stream</label>
              <div className="select-container">
                <select 
                  value={stream} 
                  onChange={(e) => setStream(e.target.value)} 
                  required
                  className="form-select"
                >
                  <option value="">Select Stream</option>
                  {streamOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <span className="help-icon">🔗</span>
              </div>
            </div>

            <div className="form-group">
              <label>District</label>
              <div className="select-container">
                <select 
                  value={district} 
                  onChange={(e) => setDistrict(e.target.value)} 
                  required
                  className="form-select"
                >
                  <option value="">Select District</option>
                  {districtOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <span className="help-icon">🔗</span>
              </div>
            </div>

            <div className="form-group">
              <label>Z-score</label>
              <div className="input-container">
                <input
                  type="number"
                  step="0.01"
                  value={zscore}
                  onChange={(e) => setZscore(e.target.value)}
                  required
                  className="form-input"
                  placeholder="1.30"
                />
                <span className="help-icon">?</span>
              </div>
            </div>
          </div>

          <button type="submit" className="get-recommendations-btn">
            <span className="btn-icon">🚀</span>
            Get Recommendations
          </button>
        </form>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="recommendations-container">
            <h3>🎯 Top Recommendations</h3>
            <div className="recommendations-grid">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="recommendation-card">
                  <div className="card-header">
                    <h4 className="course-name">{rec.Course}</h4>
                    <div className="confidence-badge">
                      {rec.Confidence.toFixed(1)}%
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="university-name">🏛️ {rec.University}</p>
                    <p className="cutoff-info">📊 Z Cutoff: <strong>{rec.Z_Cutoff}</strong></p>
                    
                    {/* Add Rule Information Section */}
                    <div className="rule-section">
                      <div className="rule-header">
                        <span className="rule-icon">⚡</span>
                        <span className="rule-title">Fired Rule: {rec.FiredRule?.rule_id}</span>
                      </div>
                      <div className="rule-description">
                        <span className="description-icon">📋</span>
                        <span className="description-text">{rec.FiredRule?.rule_description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!showMoreAlternatives && (
              <div className="more-alternatives-section">
                <button onClick={fetchMoreAlternatives} className="more-alternatives-btn">
                  <span className="btn-icon">🔍</span>
                  For More Alternative Solutions
                </button>
              </div>
            )}
          </div>
        )}

        {showMoreAlternatives && moreAlternatives.length > 0 && (
          <div className="alternatives-container">
            <h3>💡 Alternative Solutions</h3>
            <div className="recommendations-grid">
              {moreAlternatives.map((alt, idx) => (
                <div key={idx} className="recommendation-card alternative-card">
                  <div className="card-header">
                    <h4 className="course-name">{alt.Course}</h4>
                    <div className="confidence-badge alternative-badge">
                      {alt.Confidence.toFixed(1)}%
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="university-name">🏛️ {alt.University}</p>
                    <p className="cutoff-info">📊 Z Cutoff: <strong>{alt.Z_Cutoff}</strong></p>
                    
                    {/* Add Rule Information Section for Alternatives */}
                    <div className="rule-section">
                      <div className="rule-header">
                        <span className="rule-icon">⚡</span>
                        <span className="rule-title">Fired Rule: {alt.FiredRule?.rule_id}</span>
                      </div>
                      <div className="rule-description">
                        <span className="description-icon">📋</span>
                        <span className="description-text">{alt.FiredRule?.rule_description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4><span className="footer-icon">⚙</span> System Information</h4>
            <div className="footer-info">
              <span>🕐 Current Time: {getCurrentTime()}</span>
              <span>📅 Date: {getCurrentDate()}</span>
            </div>
          </div>

          <div className="footer-section">
            <h4>� How to Use</h4>
            <div className="footer-instructions">
              1. Select your stream from the dropdown &nbsp;•&nbsp; 
              2. Choose your district preference &nbsp;•&nbsp; 
              3. Enter your Z-score value &nbsp;•&nbsp; 
              4. Click 'Get Recommendations' for results
            </div>
          </div>

          <div className="footer-section">
            <h4><span className="footer-icon">💡</span> About</h4>
            <p className="footer-about">
              This expert system helps students find suitable universities based on their 
              academic performance and preferences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 

export default App; 
