import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import WelcomeModal from './components/WelcomeModal'
import HomePage from './pages/HomePage'
import CreatePost from './pages/CreatePost'
import PostDetails from './pages/PostDetails'
import EditPost from './pages/EditPost'

function App() {
  return (
    <>
      <WelcomeModal />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
      </Layout>
    </>
  )
}

export default App
