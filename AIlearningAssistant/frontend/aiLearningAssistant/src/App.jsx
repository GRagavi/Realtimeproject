import React from 'react'
import LoginPage from './pages/auth/Loginpage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import DashboardPage from './pages/dashboard/DashboardPage.jsx'
import DocumentListPage from './pages/documents/DocumentListPage.jsx'
import DocumentDetailsPage from './pages/documents/DocumentDetailsPage.jsx'
import FlashCardsListPage from './pages/flashcards/FlashCardsListPage.jsx'
import FlashCardPage from './pages/flashcards/FlashCardPage.jsx'
import QuizTakePage from './pages/quizzes/QuizTakePage.jsx'
import QuizResultPage from './pages/quizzes/QuizResultPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'

const App = () => {
  const isAuthenticated = false;
  const loading = false;
  
  if(loading){
    return (
      <div className="flex justify-center items-center h-screen"  >
       <p>Loading...</p>
      </div>
    );
  }
  
  return (
      <Router>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected Route  */}
        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailsPage />} />
          <Route path="/flashcards" element={<FlashCardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashCardPage/>} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Router>
  );
  
}

export default App
