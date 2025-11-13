import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../config/supabaseClient'
import { useTheme } from '../contexts/ThemeContext'
import CommentSection from '../components/CommentSection'
import LoadingSpinner from '../components/LoadingSpinner'
import './PostDetails.css'

const PostDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showPostImages } = useTheme()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)

  const fetchPost = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Error fetching post:', error)
      if (error.code === 'PGRST116') {
        navigate('/') 
      }
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleLike = async () => {
    if (!post) return
    
    try {
      const { error } = await supabase
        .from('Posts')
        .update({ likes: post.likes + 1 })
        .eq('id', post.id)

      if (error) throw error
      
      setPost(prev => ({ ...prev, likes: prev.likes + 1 }))
      setShowLikeAnimation(true)
      setTimeout(() => setShowLikeAnimation(false), 600)
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('Posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

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
    return <LoadingSpinner message="Loading post..." />
  }

  if (!post) {
    return (
      <div className="post-not-found">
        <h2>Post not found</h2>
        <p>The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="back-home">← Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="post-details">
      <div className="post-header">
        <div className="post-breadcrumb">
          <Link to="/" className="breadcrumb-link">← Back to Feed</Link>
        </div>
        
        <div className="post-meta">
          <span className="post-time">{formatTimeAgo(post.created_at)}</span>
        </div>
      </div>

      <div className="post-content">
        <div className="player-badge">
          <span className="badge">🏆 GOAT Pick</span>
          {post.likes >= 5 && <span className="popular-badge">🔥 Popular</span>}
          <h1 className="player-name">{post.name}</h1>
        </div>

        <h2 className="post-title">{post.title}</h2>

        {post.image && showPostImages && (
          <div className="post-image">
            <img 
              src={post.image} 
              alt={post.name}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <div className="image-error" style={{display: 'none'}}>
              <p>🖼️ Image could not be loaded</p>
            </div>
          </div>
        )}

        <div className="post-content-text">
          <h3>Why {post.name} is the GOAT:</h3>
          <p>{post.content}</p>
        </div>

        <div className="post-actions">
          <button 
            onClick={handleLike}
            className={`like-btn ${post.likes > 0 ? 'liked' : ''} ${showLikeAnimation ? 'animate' : ''}`}
          >
            {post.likes > 0 ? '❤️' : '🤍'} {post.likes} {post.likes === 1 ? 'Upvote' : 'Upvotes'}
          </button>

          <div className="admin-actions">
            <Link to={`/edit/${post.id}`} className="edit-btn">
              ✏️ Edit Post
            </Link>
            <button onClick={handleDelete} className="delete-btn">
              🗑️ Delete Post
            </button>
          </div>
        </div>
      </div>

      <div className="post-stats">
        <div className="stat-item">
          <span className="stat-label">Player:</span>
          <span className="stat-value">{post.name}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Status:</span>
          <span className="stat-value">{post.submit ? '✅ Published' : '📝 Draft'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Upvotes:</span>
          <span className="stat-value">{post.likes === 0 ? '🤍 No votes yet' : `❤️ ${post.likes}`}</span>
        </div>
      </div>

      <CommentSection postId={post.id} />

      <div className="navigation-suggestions">
        <h3>Continue the debate:</h3>
        <div className="suggestion-buttons">
          <Link to="/create" className="suggestion-btn">
            🏀 Share Your GOAT Pick
          </Link>
          <Link to="/" className="suggestion-btn">
            🏟️ See All Debates
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PostDetails
