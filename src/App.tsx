import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../app/page';
import InterviewPage from '../app/interview/page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/interview" element={<InterviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;