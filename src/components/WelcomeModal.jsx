import { useState, useEffect } from 'react'
import './WelcomeModal.css'

const WelcomeModal = () => {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check if user has seen the welcome modal
    const hasSeenWelcome = localStorage.getItem('basketballhub_welcome_seen')
    
    if (!hasSeenWelcome) {
      setShowModal(true)
    }
  }, [])

  const handleClose = () => {
    setShowModal(false)
    localStorage.setItem('basketballhub_welcome_seen', 'true')
  }

  if (!showModal) return null

  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <button className="welcome-close" onClick={handleClose}>✕</button>
        
        <div className="welcome-content">
          <h1 className="welcome-title">🏀 Welcome to BasketballHub!</h1>
          
          <div className="welcome-description">
            <p>
              BasketballHub is your ultimate platform for debating and celebrating basketball's greatest players!
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Share Your Opinion</h3>
              <p>Create posts to share why you think a player is the GOAT (Greatest of All Time)</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🗳️</div>
              <h3>Vote & Discuss</h3>
              <p>Upvote posts you agree with and comment to join the conversation</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Browse Debates</h3>
              <p>Discover what players your community thinks deserve the GOAT title</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Customize Your Experience</h3>
              <p>Switch between 4 basketball color themes and toggle image visibility</p>
            </div>
          </div>

          <div className="welcome-stats">
            <div className="stat">
              <span className="stat-emoji">🏀</span>
              <span className="stat-text">Debate Basketball</span>
            </div>
            <div className="stat">
              <span className="stat-emoji">💬</span>
              <span className="stat-text">Leave Comments</span>
            </div>
            <div className="stat">
              <span className="stat-emoji">❤️</span>
              <span className="stat-text">Upvote Posts</span>
            </div>
          </div>

          <p className="welcome-footer">
            Start by creating a post about your favorite basketball player or browse existing debates!
          </p>

          <button className="welcome-btn" onClick={handleClose}>
            Let's Get Started! 🚀
          </button>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
