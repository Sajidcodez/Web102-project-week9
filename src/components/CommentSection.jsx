import { useState, useEffect } from 'react'
import { supabase } from '../config/supabaseClient'
import './CommentSection.css'

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorName, setAuthorName] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Fetch all comments for this post
  const fetchComments = async () => {
    try {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase
        .from('Comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setComments(data || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!authorName.trim() || !commentContent.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      
      const { data, error: submitError } = await supabase
        .from('Comments')
        .insert([
          {
            post_id: postId,
            author_name: authorName.trim(),
            content: commentContent.trim()
          }
        ])
        .select()

      if (submitError) throw submitError

      // Add new comment to the list
      setComments([data[0], ...comments])
      setAuthorName('')
      setCommentContent('')
    } catch (err) {
      console.error('Error submitting comment:', err)
      setError('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="comment-section">
      <h3 className="comments-title">🏀 Comments</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="comment-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Your name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            disabled={submitting}
            className="comment-input"
          />
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Share your thoughts about this GOAT pick..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            disabled={submitting}
            className="comment-textarea"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          disabled={submitting}
          className="submit-comment-btn"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <div className="loading-comments">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              width: '100%'
            }}>
              {[...Array(2)].map((_, i) => (
                <div key={i} style={{
                  height: '80px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  animation: 'shimmer 1.5s infinite'
                }}></div>
              ))}
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="no-comments">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <span className="comment-author">{comment.author_name}</span>
                <span className="comment-time">{formatTimeAgo(comment.created_at)}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection
