import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../config/supabaseClient'
import { useTheme } from '../contexts/ThemeContext'
import SkeletonCard from '../components/SkeletonCard'
import './HomePage.css'

const HomePage = () => {
  const { showPostImages, layoutMode } = useTheme()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('created_at')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('Posts')
        .select('*')
        .eq('submit', true)

      if (sortBy === 'likes') {
        query = query.order('likes', { ascending: false })
      } else if (sortBy === 'name') {
        query = query.order('name', { ascending: true })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query
      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [sortBy])

  const handleLike = async (postId, currentLikes) => {
    try {
      const { error } = await supabase
        .from('Posts')
        .update({ likes: currentLikes + 1 })
        .eq('id', postId)

      if (error) throw error
      
      // Refresh posts to show updated likes
      fetchPosts()
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (loading) {
    return (
      <div className="homepage">
        <div className="homepage-header">
          <h1>🏀 BasketballHub</h1>
          <p>Who do you think is the greatest basketball player of all time?</p>
        </div>
        <div className="posts-feed">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="homepage">
      <div className="homepage-header">
        <h1>🏀 BasketballHub</h1>
        <p>Who do you think is the greatest basketball player of all time?</p>

        <div className="controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by player name or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="created_at">Sort by Recent</option>
              <option value="likes">Sort by Most Upvoted</option>
              <option value="name">Sort by Player Name</option>
            </select>
          </div>
        </div>
      </div>

      <div className="posts-feed">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <p>Share your Basketball🐐!</p>
            <Link to="/create" className="create-first-post">Share Your GOAT!</Link>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-meta">
                  <span className="post-time">{formatTimeAgo(post.created_at)}</span>
                  <span className="player-name">🏆 {post.name}</span>
                  {post.likes >= 5 && <span className="popular-badge">🔥 Popular</span>}
                </div>
                <div className="post-actions">
                  <button 
                    onClick={() => handleLike(post.id, post.likes)}
                    className={`like-btn ${post.likes > 0 ? 'liked' : ''}`}
                  >
                    {post.likes > 0 ? '❤️' : '🤍'} {post.likes} {post.likes === 1 ? 'Upvote' : 'Upvotes'}
                  </button>
                </div>
              </div>
              
              <Link to={`/post/${post.id}`} className="post-link">
                <h3 className="post-title">{post.title}</h3>
                
                <p className="post-preview">
                  {post.content.substring(0, 150)}
                  {post.content.length > 150 && '...'}
                </p>
                
                {post.image && showPostImages && (
                  <div className="post-image-preview">
                    <img src={post.image} alt={post.name} onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </Link>
            </div>
          ))
        )}   </div> </div>
  )
}

export default HomePage
