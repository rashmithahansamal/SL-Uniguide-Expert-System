// import React, { useSt  // Additional icons for complete replacement
//   Rocket as RocketIcon,
//   Warning as WarningIcon,
//   GpsFixed as TargetIcon,
//   Subject as SubjectIcon,
//   Link as LinkIcon,
//   QuestionMark as QuestionMarkIcon,
//   Category as CategoryIcon,
//   Public as PublicIcon,
//   BarChart as BarChartIcon,
//   Analytics as AnalyticsIcon,
//   Rule as RuleIcon,
//   Assignment as AssignmentIcon,
//   Bolt as BoltIcon,
//   MenuBook as BookIcon,
//   HowToReg as HowToRegIcon,
//   Groups as GroupsIcon,
//   Business as BusinessIcon,
//   Work as WorkIcon,
//   EmojiObjects as IdeaIcon,
//   AccountBalance as UniversityIcon,
//   AssessmentOutlined as AssessmentIcon,
//   ShowChart as ShowChartIcon,
//   ExpandMore as ExpandMoreIcon,
//   Architecture as ArchitectureIcon
// } from '@mui/icons-material';

// function App() {
//   const [stream, setStream] = useState("");
//   const [district, setDistrict] = useState("");
//   const [zscore, setZscore] = useState("");
//   const [recommendations, setRecommendations] = useState([]);
//   const [moreAlternatives, setMoreAlternatives] = useState([]);
//   const [showMoreAlternatives, setShowMoreAlternatives] = useState(false);
//   const [error, setError] = useState("");
  
//   // Add new states for course details modal
//   const [showCourseDetails, setShowCourseDetails] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [courseDetails, setCourseDetails] = useState("");
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [loadingAnswer, setLoadingAnswer] = useState(false);

//   // Stream options
//   const streamOptions = [
//     "Physical", "Engineering Technology (ET)", "Bio Science", "Technology (IT)"
//   ];

//   // District options  
//   const districtOptions = [
//     "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
//     "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
//     "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee", 
//     "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
//     "Moneragala", "Ratnapura", "Kegalle"
//   ];

//   const fetchRecommendations = async () => {
//     setError("");
//     setRecommendations([]);
    
//     try {
//       const resp = await fetch("http://localhost:8000/recommendations/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           stream: stream.trim(),
//           district: district.trim(),
//           zscore: parseFloat(zscore)
//         }),
//       });
//       if (!resp.ok) {
//         throw new Error("No recommendations found or server error.");
//       }
//       const data = await resp.json();
//       setRecommendations(data.recommendations);
//     } catch (err) {
//       setError(err.message || "Unexpected error");
//     }
//   };

//   const fetchMoreAlternatives = async () => {
//   try {
//     const resp = await fetch("http://localhost:8000/alternatives/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         stream: stream.trim(),
//         district: district.trim(),
//         zscore: parseFloat(zscore)
//       }),
//     });
//     if (!resp.ok) {
//       throw new Error("No alternative solutions found.");
//     }
//     const data = await resp.json();
//     setMoreAlternatives(data.alternatives);
//     setShowMoreAlternatives(true);
//   } catch (err) {
//     setError("Could not fetch alternative solutions: " + err.message);
//   }
// };

//   const submitHandler = (e) => {
//     e.preventDefault();
//     fetchRecommendations();
//   };

//   const getCurrentTime = () => {
//     const now = new Date();
//     return now.toLocaleTimeString('en-US', { hour12: false });
//   };

//   const getCurrentDate = () => {
//     const now = new Date();
//     return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
//   };
  
//   // Add new functions for course details modal
//   const fetchCourseDetails = async (course) => {
//     setLoadingDetails(true);
//     try {
//       const response = await fetch("http://localhost:8000/course-details/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           course_name: course.Course,
//           university: course.University,
//           stream: stream
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to fetch course details");
//       }
      
//       const data = await response.json();
//       setCourseDetails(data.course_details);
//       setSelectedCourse(course);
//       setShowCourseDetails(true);
//       setChatHistory([]); // Reset chat history for new course
//     } catch (err) {
//       setError("Failed to load course details: " + err.message);
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   const askCourseQuestion = async () => {
//     if (!currentQuestion.trim()) return;
    
//     setLoadingAnswer(true);
//     const userMessage = { role: "user", content: currentQuestion };
//     const newChatHistory = [...chatHistory, userMessage];
//     setChatHistory(newChatHistory);
//     setCurrentQuestion("");
    
//     try {
//       const response = await fetch("http://localhost:8000/course-question/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           course_name: selectedCourse.Course,
//           university: selectedCourse.University,
//           stream: stream,
//           question: currentQuestion,
//           chat_history: newChatHistory
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to get answer");
//       }
      
//       const data = await response.json();
//       const assistantMessage = { role: "assistant", content: data.answer };
//       setChatHistory([...newChatHistory, assistantMessage]);
//     } catch (err) {
//       setError("Failed to get answer: " + err.message);
//     } finally {
//       setLoadingAnswer(false);
//     }
//   };

//   const closeCourseDetails = () => {
//     setShowCourseDetails(false);
//     setSelectedCourse(null);
//     setCourseDetails("");
//     setChatHistory([]);
//     setCurrentQuestion("");
//   };

//   return (
//     <div className="app-container">
//       {/* Main Content - Full Width */}
//       <div className="main-content">
//         <div className="header">
//           <div className="title-container">
//             <SchoolIcon className="graduation-cap" sx={{ fontSize: 48, color: '#A94442' }} />
//             <h1>Uniguide Expert System</h1>
//           </div>
//           <p className="subtitle">
//             <BrainIcon sx={{ fontSize: 20, marginRight: 1, verticalAlign: 'middle' }} />
//             Your intelligent university guidance companion
//           </p>
//         </div>

//         <form onSubmit={submitHandler} className="recommendation-form">
//           <div className="form-grid">
//             <div className="form-group">
//               <label>Stream</label>
//               <div className="select-container">
//                 <select 
//                   value={stream} 
//                   onChange={(e) => setStream(e.target.value)} 
//                   required
//                   className="form-select"
//                 >
//                   <option value="">Select Stream</option>
//                   {streamOptions.map((option) => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </select>
//                 <CategoryIcon className="help-icon" sx={{ fontSize: 20, color: '#A94442' }} />
//               </div>
//             </div>

//             <div className="form-group">
//               <label>District</label>
//               <div className="select-container">
//                 <select 
//                   value={district} 
//                   onChange={(e) => setDistrict(e.target.value)} 
//                   required
//                   className="form-select"
//                 >
//                   <option value="">Select District</option>
//                   {districtOptions.map((option) => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </select>
//                 <LocationIcon className="help-icon" sx={{ fontSize: 20, color: '#A94442' }} />
//               </div>
//             </div>

//             <div className="form-group">
//               <label>Z-score</label>
//               <div className="input-container">
//                 <input
//                   type="number"
//                   step="0.01"
//                   value={zscore}
//                   onChange={(e) => setZscore(e.target.value)}
//                   required
//                   className="form-input"
//                   placeholder="1.30"
//                 />
//                 <TrendingUpIcon className="help-icon" sx={{ fontSize: 20, color: '#A94442' }} />
//               </div>
//             </div>
//           </div>

//           <button type="submit" className="get-recommendations-btn">
//             <RocketIcon className="btn-icon" sx={{ fontSize: 20, marginRight: 1 }} />
//             Get Recommendations
//           </button>
//         </form>

//         {error && (
//           <div className="error-message">
//             <span className="error-icon">⚠️</span>
//             {error}
//           </div>
//         )}

//         {recommendations.length > 0 && (
//           <div className="recommendations-container">
//             <h3>
//               <TargetIcon sx={{ fontSize: 28, marginRight: 1, verticalAlign: 'middle', color: '#A94442' }} />
//               Top Recommendations
//             </h3>
//             <div className="recommendations-grid">
//               {recommendations.map((rec, idx) => (
//                 <div key={idx} className="recommendation-card">
//                   <div className="card-header">
//                     <h4 className="course-name">{rec.Course}</h4>
//                     <div className="confidence-badge">
//                       {rec.Confidence.toFixed(1)}%
//                     </div>
//                   </div>
//                   <div className="card-body">
//                     <p className="university-name">
//                       <UniversityIcon sx={{ fontSize: 18, marginRight: 0.5, verticalAlign: 'middle', color: '#A94442' }} />
//                       {rec.University}
//                     </p>
//                     <p className="cutoff-info">
//                       <BarChartIcon sx={{ fontSize: 18, marginRight: 0.5, verticalAlign: 'middle', color: '#A94442' }} />
//                       Z Cutoff: <strong>{rec.Z_Cutoff}</strong>
//                     </p>
                    
//                     {/* Add Rule Information Section */}
//                     <div className="rule-section">
//                       <div className="rule-header">
//                         <BoltIcon className="rule-icon" sx={{ fontSize: 18, color: '#A94442' }} />
//                         <span className="rule-title">Fired Rule: {rec.FiredRule?.rule_id}</span>
//                       </div>
//                       <div className="rule-description">
//                         <AssignmentIcon className="description-icon" sx={{ fontSize: 16, color: '#A94442' }} />
//                         <span className="description-text">{rec.FiredRule?.rule_description}</span>
//                       </div>
//                     </div>
                    
//                     {/* Add More Details Button */}
//                     <div className="card-actions">
//                       <button 
//                         onClick={() => fetchCourseDetails(rec)}
//                         className="more-details-btn"
//                         disabled={loadingDetails}
//                       >
//                         {loadingDetails ? 
//                           <SparkleIcon sx={{ fontSize: 18, animation: 'spin 2s linear infinite' }} /> :
//                           <InfoIcon sx={{ fontSize: 18 }} />
//                         }
//                         {loadingDetails ? "Loading..." : "More Details"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {!showMoreAlternatives && (
//               <div className="more-alternatives-section">
//                 <button onClick={fetchMoreAlternatives} className="more-alternatives-btn">
//                   <ExpandMoreIcon className="btn-icon" sx={{ fontSize: 20, marginRight: 1 }} />
//                   For More Alternative Solutions
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {showMoreAlternatives && moreAlternatives.length > 0 && (
//           <div className="alternatives-container">
//             <h3>
//               <LightbulbIcon sx={{ fontSize: 28, marginRight: 1, verticalAlign: 'middle', color: '#A94442' }} />
//               Alternative Solutions
//             </h3>
//             <div className="recommendations-grid">
//               {moreAlternatives.map((alt, idx) => (
//                 <div key={idx} className="recommendation-card alternative-card">
//                   <div className="card-header">
//                     <h4 className="course-name">{alt.Course}</h4>
//                     <div className="confidence-badge alternative-badge">
//                       {alt.Confidence.toFixed(1)}%
//                     </div>
//                   </div>
//                   <div className="card-body">
//                     <p className="university-name">
//                       <UniversityIcon sx={{ fontSize: 18, marginRight: 0.5, verticalAlign: 'middle', color: '#A94442' }} />
//                       {alt.University}
//                     </p>
//                     <p className="cutoff-info">
//                       <BarChartIcon sx={{ fontSize: 18, marginRight: 0.5, verticalAlign: 'middle', color: '#A94442' }} />
//                       Z Cutoff: <strong>{alt.Z_Cutoff}</strong>
//                     </p>
                    
//                     {/* Add Rule Information Section for Alternatives */}
//                     <div className="rule-section">
//                       <div className="rule-header">
//                         <BoltIcon className="rule-icon" sx={{ fontSize: 18, color: '#A94442' }} />
//                         <span className="rule-title">Fired Rule: {alt.FiredRule?.rule_id}</span>
//                       </div>
//                       <div className="rule-description">
//                         <AssignmentIcon className="description-icon" sx={{ fontSize: 16, color: '#A94442' }} />
//                         <span className="description-text">{alt.FiredRule?.rule_description}</span>
//                       </div>
//                     </div>
                    
//                     {/* Add More Details Button for alternatives */}
//                     <div className="card-actions">
//                       <button 
//                         onClick={() => fetchCourseDetails(alt)}
//                         className="more-details-btn alternative-details-btn"
//                         disabled={loadingDetails}
//                       >
//                         {loadingDetails ? 
//                           <SparkleIcon sx={{ fontSize: 18, animation: 'spin 2s linear infinite' }} /> :
//                           <InfoIcon sx={{ fontSize: 18 }} />
//                         }
//                         {loadingDetails ? "Loading..." : "More Details"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Course Details Modal */}
//       {showCourseDetails && (
//         <div className="modal-overlay" onClick={closeCourseDetails}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <div className="modal-title-section">
//                 <h2 className="modal-title">
//                   <DescriptionIcon sx={{ fontSize: 28, marginRight: 1 }} />
//                   {selectedCourse?.Course}
//                 </h2>
//                 <p className="modal-university">
//                   <SchoolIcon sx={{ fontSize: 20, marginRight: 0.5 }} />
//                   {selectedCourse?.University}
//                 </p>
//               </div>
//               <button className="modal-close" onClick={closeCourseDetails}>
//                 <CloseIcon />
//               </button>
//             </div>
            
//             <div className="modal-body">
//               <div className="course-details-section">
//                 <div className="section-header">
//                   <InfoIcon sx={{ fontSize: 24, color: '#A94442', marginRight: 1 }} />
//                   <h3>Course Details</h3>
//                 </div>
//                 {loadingDetails ? (
//                   <div className="loading-details">
//                     <SparkleIcon sx={{ fontSize: 20, animation: 'spin 2s linear infinite' }} />
//                     <span>Generating course information...</span>
//                   </div>
//                 ) : (
//                   <div className="course-details">
//                     <p>{courseDetails}</p>
//                   </div>
//                 )}
//               </div>
              
//               <div className="chat-section">
//                 <div className="chat-header">
//                   <ChatIcon sx={{ fontSize: 24, color: 'white', marginRight: 1 }} />
//                   <span>Ask AI Assistant</span>
//                 </div>
                
//                 <div className="chat-messages">
//                   {chatHistory.length === 0 ? (
//                     <div className="chat-placeholder">
//                       <BrainIcon sx={{ fontSize: 48, color: '#A94442', opacity: 0.5 }} />
//                       <p>Ask me anything about this course!</p>
//                       <div className="suggested-questions">
//                         <div 
//                           className="suggestion-chip"
//                           onClick={() => setCurrentQuestion("What career opportunities are available?")}
//                         >
//                           💼 Career prospects
//                         </div>
//                         <div 
//                           className="suggestion-chip"
//                           onClick={() => setCurrentQuestion("What subjects will I study?")}
//                         >
//                           📚 Course subjects
//                         </div>
//                         <div 
//                           className="suggestion-chip"
//                           onClick={() => setCurrentQuestion("What skills will I develop?")}
//                         >
//                           🎯 Skills gained
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     chatHistory.map((chat, idx) => (
//                       <div key={idx} className={`chat-message ${chat.role}`}>
//                         <div className="message-avatar">
//                           {chat.role === 'user' ? 
//                             <UserIcon sx={{ fontSize: 20, color: 'white' }} /> : 
//                             <BotIcon sx={{ fontSize: 20, color: '#A94442' }} />
//                           }
//                         </div>
//                         <div className="message-content">
//                           <div className="message-text">{chat.content}</div>
//                           <div className="message-time">
//                             {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
                  
//                   {loadingAnswer && (
//                     <div className="chat-message assistant">
//                       <div className="message-avatar">
//                         <BotIcon sx={{ fontSize: 20, color: '#A94442' }} />
//                       </div>
//                       <div className="message-content">
//                         <div className="typing-indicator">
//                           <div className="typing-dots">
//                             <span></span>
//                             <span></span>
//                             <span></span>
//                           </div>
//                           <span className="typing-text">AI is thinking...</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="chat-input-container">
//                   <div className="input-wrapper">
//                     <HelpIcon sx={{ fontSize: 20, color: '#A94442', marginRight: 1 }} />
//                     <input
//                       type="text"
//                       value={currentQuestion}
//                       onChange={(e) => setCurrentQuestion(e.target.value)}
//                       placeholder="Type your question here..."
//                       onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && askCourseQuestion()}
//                       disabled={loadingAnswer}
//                       className="chat-input"
//                     />
//                   </div>
//                   <button 
//                     onClick={askCourseQuestion}
//                     disabled={loadingAnswer || !currentQuestion.trim()}
//                     className="chat-send-btn"
//                   >
//                     {loadingAnswer ? 
//                       <SparkleIcon sx={{ fontSize: 20, animation: 'spin 2s linear infinite' }} /> : 
//                       <SendIcon sx={{ fontSize: 20 }} />
//                     }
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="footer">
//         <div className="footer-container">
//           <div className="footer-section">
//             <h4>
//               <SettingsIcon className="footer-icon" sx={{ fontSize: 20, marginRight: 0.5 }} />
//               System Information
//             </h4>
//             <div className="footer-info">
//               <span>
//                 <TimeIcon sx={{ fontSize: 16, marginRight: 0.5, verticalAlign: 'middle' }} />
//                 Current Time: {getCurrentTime()}
//               </span>
//               <span>
//                 <CalendarIcon sx={{ fontSize: 16, marginRight: 0.5, verticalAlign: 'middle' }} />
//                 Date: {getCurrentDate()}
//               </span>
//             </div>
//           </div>

//           <div className="footer-section">
//             <h4>
//               <HelpIcon sx={{ fontSize: 20, marginRight: 0.5 }} />
//               How to Use
//             </h4>
//             <div className="footer-instructions">
//               1. Select your stream from the dropdown &nbsp;•&nbsp; 
//               2. Choose your district preference &nbsp;•&nbsp; 
//               3. Enter your Z-score value &nbsp;•&nbsp; 
//               4. Click 'Get Recommendations' for results
//             </div>
//           </div>

//           <div className="footer-section">
//             <h4>
//               <LightbulbIcon className="footer-icon" sx={{ fontSize: 20, marginRight: 0.5 }} />
//               About
//             </h4>
//             <p className="footer-about">
//               This expert system helps students find suitable universities based on their 
//               academic performance and preferences.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }ct";
// import './App.css';
// // MUI Icons
// import {
//   Send as SendIcon,
//   Close as CloseIcon,
//   SmartToy as BotIcon,
//   Person as UserIcon,
//   Help as HelpIcon,
//   School as SchoolIcon,
//   LocationOn as LocationIcon,
//   TrendingUp as TrendingUpIcon,
//   Description as DescriptionIcon,
//   Chat as ChatIcon,
//   Info as InfoIcon,
//   Lightbulb as LightbulbIcon,
//   AccessTime as TimeIcon,
//   CalendarToday as CalendarIcon,
//   Settings as SettingsIcon,
//   AutoAwesome as SparkleIcon,
//   Psychology as BrainIcon,
//   // Additional icons for complete replacement
//   Ro            <h4>
//               <SettingsIcon className="footer-icon" sx={{ fontSize: 20, marginRight: 0.5 }} />
//               System Information
//             </h4>
//             <div className="footer-info">
//               <span>
//                 <TimeIcon sx={{ fontSize: 16, marginRight: 0.5, verticalAlign: 'middle' }} />
//                 Current Time: {getCurrentTime()}
//               </span>
//               <span>
//                 <CalendarIcon sx={{ fontSize: 16, marginRight: 0.5, verticalAlign: 'middle' }} />
//                 Date: {getCurrentDate()}
//               </span>
//             </div>
//           </div>

//           <div className="footer-section">
//             <h4>
//               <HelpIcon sx={{ fontSize: 20, marginRight: 0.5 }} />
//               How to Use
//             </h4>ocketIcon,
//   Warning as WarningIcon,
//   GpsFixed as TargetIcon,
//   Subject as SubjectIcon,
//   Link as LinkIcon,
//   QuestionMark as QuestionMarkIcon,
//   Category as CategoryIcon,
//   Public as PublicIcon,
//   BarChart as BarChartIcon,
//   Analytics as AnalyticsIcon,
//   Rule as RuleIcon,
//   Assignment as AssignmentIcon,
//   Bolt as BoltIcon,
//   MenuBook as BookIcon,
//   HowToReg as HowToRegIcon,
//   Groups as GroupsIcon,
//   Business as BusinessIcon,
//   Work as WorkIcon,
//   EmojiObjects as IdeaIcon,
//   AccountBalance as UniversityIcon,
//   AssessmentOutlined as AssessmentIcon,
//   ShowChart as ShowChartIcon,
//   ExpandMore as ExpandMoreIcon,
//   Architecture as ArchitectureIcon
// } from '@mui/icons-material';

// function App() {
//   const [stream, setStream] = useState("");
//   const [district, setDistrict] = useState("");
//   const [zscore, setZscore] = useState("");
//   const [recommendations, setRecommendations] = useState([]);
//   const [moreAlternatives, setMoreAlternatives] = useState([]);
//   const [showMoreAlternatives, setShowMoreAlternatives] = useState(false);
//   const [error, setError] = useState("");
  
//   // Add new states for course details modal
//   const [showCourseDetails, setShowCourseDetails] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [courseDetails, setCourseDetails] = useState("");
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [loadingAnswer, setLoadingAnswer] = useState(false);

//   // Stream options for dropdown
//   const streamOptions = [
//     "Physical ",
//     "Biological Science", 
//     "Mathematics",
//     "Commerce",
//     "Arts",
//     "IT"
//   ];

//   // District options for dropdown
//   const districtOptions = [
//     "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", 
//     "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", 
//     "Mannar", "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", 
//     "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
//   ];

//   const fetchRecommendations = async () => {
//     setError("");
//     setRecommendations([]);
//     setMoreAlternatives([]);
//     setShowMoreAlternatives(false);
//     try {
//       const resp = await fetch("http://localhost:8000/recommendations/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           stream: stream.trim(),
//           district: district.trim(),
//           zscore: parseFloat(zscore),
//         }),
//       });
//       if (!resp.ok) {
//         throw new Error("No recommendations found or server error.");
//       }
//       const data = await resp.json();
//       setRecommendations(data.recommendations);
//     } catch (err) {
//       setError(err.message || "Unexpected error");
//     }
//   };

//   const fetchMoreAlternatives = async () => {
//   try {
//     const resp = await fetch("http://localhost:8000/alternatives/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         stream: stream.trim(),
//         district: district.trim(),
//         zscore: parseFloat(zscore),
//       }),
//     });
    
//     if (!resp.ok) {
//       throw new Error("No alternative solutions found.");
//     }
    
//     const data = await resp.json();
//     setMoreAlternatives(data.alternatives);
//     setShowMoreAlternatives(true);
//   } catch (err) {
//     setError("Could not fetch alternative solutions: " + err.message);
//   }
// };

//   const submitHandler = (e) => {
//     e.preventDefault();
//     fetchRecommendations();
//   };

//   const getCurrentTime = () => {
//     const now = new Date();
//     return now.toLocaleTimeString('en-US', { hour12: false });
//   };

//   const getCurrentDate = () => {
//     const now = new Date();
//     return now.toISOString().split('T')[0];
//   };

//   // New function to fetch course details
//   const fetchCourseDetails = async (course) => {
//     setLoadingDetails(true);
//     try {
//       const response = await fetch("http://localhost:8000/course-details/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           course_name: course.Course,
//           university: course.University,
//           stream: stream
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to fetch course details");
//       }
      
//       const data = await response.json();
//       setCourseDetails(data.course_details);
//       setSelectedCourse(course);
//       setShowCourseDetails(true);
//       setChatHistory([]);
//     } catch (err) {
//       setError("Could not fetch course details: " + err.message);
//     }
//     setLoadingDetails(false);
//   };

//   // New function to ask questions about the course
//   const askCourseQuestion = async () => {
//     if (!currentQuestion.trim()) return;
    
//     setLoadingAnswer(true);
//     const question = currentQuestion;
//     setCurrentQuestion("");
    
//     // Add user question to chat history
//     const newChatHistory = [...chatHistory, { role: "user", content: question }];
//     setChatHistory(newChatHistory);
    
//     try {
//       const response = await fetch("http://localhost:8000/course-question/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           course_name: selectedCourse.Course,
//           university: selectedCourse.University,
//           stream: stream,
//           question: question,
//           chat_history: chatHistory
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error("Failed to get answer");
//       }
      
//       const data = await response.json();
      
//       // Add AI response to chat history
//       setChatHistory([...newChatHistory, { role: "assistant", content: data.answer }]);
//     } catch (err) {
//       setError("Could not get answer: " + err.message);
//     }
//     setLoadingAnswer(false);
//   };

//   const closeCourseDetails = () => {
//     setShowCourseDetails(false);
//     setSelectedCourse(null);
//     setCourseDetails("");
//     setChatHistory([]);
//     setCurrentQuestion("");
//   };

//   return (
//     <div className="app-container">
//       {/* Main Content - Full Width */}
//       <div className="main-content">
//         <div className="header">
//           <div className="title-container">
//             <SchoolIcon className="graduation-cap" sx={{ fontSize: 48, color: '#A94442' }} />
//             <h1>Uniguide Expert System</h1>
//           </div>
//           <p className="subtitle">
//             <BrainIcon sx={{ fontSize: 20, marginRight: 1, verticalAlign: 'middle' }} />
//             Your intelligent university guidance companion
//           </p>
//         </div>

//         <form onSubmit={submitHandler} className="recommendation-form">
//           <div className="form-grid">
//             <div className="form-group">
//               <label>Stream</label>
//               <div className="select-container">
//                 <select 
//                   value={stream} 
//                   onChange={(e) => setStream(e.target.value)} 
//                   required
//                   className="form-select"
//                 >
//                   <option value="">Select Stream</option>
//                   {streamOptions.map((option) => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </select>
//                 <CategoryIcon className="help-icon" sx={{ fontSize: 20, color: '#A94442' }} />
//               </div>
//             </div>

//             <div className="form-group">
//               <label>District</label>
//               <div className="select-container">
//                 <select 
//                   value={district} 
//                   onChange={(e) => setDistrict(e.target.value)} 
//                   required
//                   className="form-select"
//                 >
//                   <option value="">Select District</option>
//                   {districtOptions.map((option) => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </select>
//                 <LocationIcon className="help-icon" sx={{ fontSize: 20, color: '#A94442' }} />
//               </div>
//             </div>

//             <div className="form-group">
//               <label>Z-score</label>
//               <div className="input-container">
//                 <input
//                   type="number"
//                   step="0.01"
//                   value={zscore}
//                   onChange={(e) => setZscore(e.target.value)}
//                   required
//                   className="form-input"
//                   placeholder="1.30"
//                 />
//                 <TrendingUpIcon className="help-icon" sx={{ fontSize: 20, color: '#A94442' }} />
//               </div>
//             </div>
//           </div>

//           <button type="submit" className="get-recommendations-btn">
//             <RocketIcon className="btn-icon" sx={{ fontSize: 20, marginRight: 1 }} />
//             Get Recommendations
//           </button>
//         </form>

//         {error && (
//           <div className="error-message">
//             <span className="error-icon">⚠️</span>
//             {error}
//           </div>
//         )}

//         {recommendations.length > 0 && (
//           <div className="recommendations-container">
//             <h3>
//               <TargetIcon sx={{ fontSize: 28, marginRight: 1, verticalAlign: 'middle', color: '#A94442' }} />
//               Top Recommendations
//             </h3>
//             <div className="recommendations-grid">
//               {recommendations.map((rec, idx) => (
//                 <div key={idx} className="recommendation-card">
//                   <div className="card-header">
//                     <h4 className="course-name">{rec.Course}</h4>
//                     <div className="confidence-badge">
//                       {rec.Confidence.toFixed(1)}%
//                     </div>
//                   </div>
//                   <div className="card-body">
//                     <p className="university-name">
//                       <UniversityIcon sx={{ fontSize: 18, marginRight: 0.5, verticalAlign: 'middle', color: '#A94442' }} />
//                       {rec.University}
//                     </p>
//                     <p className="cutoff-info">
//                       <BarChartIcon sx={{ fontSize: 18, marginRight: 0.5, verticalAlign: 'middle', color: '#A94442' }} />
//                       Z Cutoff: <strong>{rec.Z_Cutoff}</strong>
//                     </p>
                    
//                     {/* Add Rule Information Section */}
//                     <div className="rule-section">
//                       <div className="rule-header">
//                         <BoltIcon className="rule-icon" sx={{ fontSize: 18, color: '#A94442' }} />
//                         <span className="rule-title">Fired Rule: {rec.FiredRule?.rule_id}</span>
//                       </div>
//                       <div className="rule-description">
//                         <AssignmentIcon className="description-icon" sx={{ fontSize: 16, color: '#A94442' }} />
//                         <span className="description-text">{rec.FiredRule?.rule_description}</span>
//                       </div>
//                     </div>
                    
//                     {/* Add More Details Button */}
//                     <div className="card-actions">
//                       <button 
//                         onClick={() => fetchCourseDetails(rec)}
//                         className="more-details-btn"
//                         disabled={loadingDetails}
//                       >
//                         {loadingDetails ? 
//                           <SparkleIcon sx={{ fontSize: 18, animation: 'spin 2s linear infinite' }} /> :
//                           <InfoIcon sx={{ fontSize: 18 }} />
//                         }
//                         {loadingDetails ? "Loading..." : "More Details"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {!showMoreAlternatives && (
//               <div className="more-alternatives-section">
//                 <button onClick={fetchMoreAlternatives} className="more-alternatives-btn">
//                   <ExpandMoreIcon className="btn-icon" sx={{ fontSize: 20, marginRight: 1 }} />
//                   For More Alternative Solutions
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {showMoreAlternatives && moreAlternatives.length > 0 && (
//           <div className="alternatives-container">
//             <h3>
//               <LightbulbIcon sx={{ fontSize: 28, marginRight: 1, verticalAlign: 'middle', color: '#A94442' }} />
//               Alternative Solutions
//             </h3>
//             <div className="recommendations-grid">
//               {moreAlternatives.map((alt, idx) => (
//                 <div key={idx} className="recommendation-card alternative-card">
//                   <div className="card-header">
//                     <h4 className="course-name">{alt.Course}</h4>
//                     <div className="confidence-badge alternative-badge">
//                       {alt.Confidence.toFixed(1)}%
//                     </div>
//                   </div>
//                   <div className="card-body">
//                     <p className="university-name">
//                       <UniversityIcon sx={{ fontSize: 18, marginRight: 0.5, verticalAlign: 'middle', color: '#A94442' }} />
//                       {alt.University}
//                     </p>
//                     <p className="cutoff-info">
//                       <BarChartIcon sx={{ fontSize: 18, marginRight: 0.5, verticalAlign: 'middle', color: '#A94442' }} />
//                       Z Cutoff: <strong>{alt.Z_Cutoff}</strong>
//                     </p>
                    
//                     {/* Add Rule Information Section for Alternatives */}
//                     <div className="rule-section">
//                       <div className="rule-header">
//                         <BoltIcon className="rule-icon" sx={{ fontSize: 18, color: '#A94442' }} />
//                         <span className="rule-title">Fired Rule: {alt.FiredRule?.rule_id}</span>
//                       </div>
//                       <div className="rule-description">
//                         <AssignmentIcon className="description-icon" sx={{ fontSize: 16, color: '#A94442' }} />
//                         <span className="description-text">{alt.FiredRule?.rule_description}</span>
//                       </div>
//                     </div>
                    
//                     {/* Add More Details Button for alternatives */}
//                     <div className="card-actions">
//                       <button 
//                         onClick={() => fetchCourseDetails(alt)}
//                         className="more-details-btn alternative-details-btn"
//                         disabled={loadingDetails}
//                       >
//                         {loadingDetails ? 
//                           <SparkleIcon sx={{ fontSize: 18, animation: 'spin 2s linear infinite' }} /> :
//                           <InfoIcon sx={{ fontSize: 18 }} />
//                         }
//                         {loadingDetails ? "Loading..." : "More Details"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Course Details Modal */}
//       {showCourseDetails && (
//         <div className="modal-overlay" onClick={closeCourseDetails}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <div className="modal-title-section">
//                 <h2 className="modal-title">
//                   <DescriptionIcon sx={{ fontSize: 28, marginRight: 1 }} />
//                   {selectedCourse?.Course}
//                 </h2>
//                 <p className="modal-university">
//                   <SchoolIcon sx={{ fontSize: 20, marginRight: 0.5 }} />
//                   {selectedCourse?.University}
//                 </p>
//               </div>
//               <button className="modal-close" onClick={closeCourseDetails}>
//                 <CloseIcon />
//               </button>
//             </div>
            
//             <div className="modal-body">
//               <div className="course-details-section">
//                 <div className="section-header">
//                   <InfoIcon sx={{ fontSize: 24, color: '#A94442', marginRight: 1 }} />
//                   <h3>Course Details</h3>
//                 </div>
//                 {loadingDetails ? (
//                   <div className="loading-details">
//                     <SparkleIcon sx={{ fontSize: 20, animation: 'spin 2s linear infinite' }} />
//                     <span>Generating course information...</span>
//                   </div>
//                 ) : (
//                   <div className="course-details">
//                     <p>{courseDetails}</p>
//                   </div>
//                 )}
//               </div>
              
//               <div className="chat-section">
//                 <div className="chat-header">
//                   <ChatIcon sx={{ fontSize: 24, color: 'white', marginRight: 1 }} />
//                   <span>Ask AI Assistant</span>
//                 </div>
                
//                 <div className="chat-messages">
//                   {chatHistory.length === 0 ? (
//                     <div className="chat-placeholder">
//                       <BrainIcon sx={{ fontSize: 48, color: '#A94442', opacity: 0.5 }} />
//                       <p>Ask me anything about this course!</p>
//                       <div className="suggested-questions">
//                         <div 
//                           className="suggestion-chip"
//                           onClick={() => setCurrentQuestion("What career opportunities are available?")}
//                         >
//                           💼 Career prospects
//                         </div>
//                         <div 
//                           className="suggestion-chip"
//                           onClick={() => setCurrentQuestion("What subjects will I study?")}
//                         >
//                           📚 Course subjects
//                         </div>
//                         <div 
//                           className="suggestion-chip"
//                           onClick={() => setCurrentQuestion("What skills will I develop?")}
//                         >
//                           🎯 Skills gained
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     chatHistory.map((chat, idx) => (
//                       <div key={idx} className={`chat-message ${chat.role}`}>
//                         <div className="message-avatar">
//                           {chat.role === 'user' ? 
//                             <UserIcon sx={{ fontSize: 20, color: 'white' }} /> : 
//                             <BotIcon sx={{ fontSize: 20, color: '#A94442' }} />
//                           }
//                         </div>
//                         <div className="message-content">
//                           <div className="message-text">{chat.content}</div>
//                           <div className="message-time">
//                             {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
                  
//                   {loadingAnswer && (
//                     <div className="chat-message assistant">
//                       <div className="message-avatar">
//                         <BotIcon sx={{ fontSize: 20, color: '#A94442' }} />
//                       </div>
//                       <div className="message-content">
//                         <div className="typing-indicator">
//                           <div className="typing-dots">
//                             <span></span>
//                             <span></span>
//                             <span></span>
//                           </div>
//                           <span className="typing-text">AI is thinking...</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="chat-input-container">
//                   <div className="input-wrapper">
//                     <HelpIcon sx={{ fontSize: 20, color: '#A94442', marginRight: 1 }} />
//                     <input
//                       type="text"
//                       value={currentQuestion}
//                       onChange={(e) => setCurrentQuestion(e.target.value)}
//                       placeholder="Type your question here..."
//                       onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && askCourseQuestion()}
//                       disabled={loadingAnswer}
//                       className="chat-input"
//                     />
//                   </div>
//                   <button 
//                     onClick={askCourseQuestion}
//                     disabled={loadingAnswer || !currentQuestion.trim()}
//                     className="chat-send-btn"
//                   >
//                     {loadingAnswer ? 
//                       <SparkleIcon sx={{ fontSize: 20, animation: 'spin 2s linear infinite' }} /> : 
//                       <SendIcon sx={{ fontSize: 20 }} />
//                     }
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="footer">
//         <div className="footer-container">
//           <div className="footer-section">
//             <h4><span className="footer-icon">⚙</span> System Information</h4>
//             <div className="footer-info">
//               <span>🕐 Current Time: {getCurrentTime()}</span>
//               <span>📅 Date: {getCurrentDate()}</span>
//             </div>
//           </div>

//           <div className="footer-section">
//             <h4>� How to Use</h4>
//             <div className="footer-instructions">
//               1. Select your stream from the dropdown &nbsp;•&nbsp; 
//               2. Choose your district preference &nbsp;•&nbsp; 
//               3. Enter your Z-score value &nbsp;•&nbsp; 
//               4. Click 'Get Recommendations' for results
//             </div>
//           </div>

//           <div className="footer-section">
//             <h4><span className="footer-icon">💡</span> About</h4>
//             <p className="footer-about">
//               This expert system helps students find suitable universities based on their 
//               academic performance and preferences.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// } 

// export default App; 
