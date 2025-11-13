import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabaseClient'
import './EditPost.css'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    image: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const fetchPost = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      setPost(data)
      setFormData({
        name: data.name || '',
        title: data.title || '',
        content: data.content || '',
        image: data.image || ''
      })
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Player name is required'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Post title is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Please explain why this player is the GOAT'
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Please provide a more detailed explanation (at least 10 characters)'
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('Posts')
        .update({
          name: formData.name.trim(),
          title: formData.title.trim(),
          content: formData.content.trim(),
          image: formData.image.trim() || null,
          submit: true
        })
        .eq('id', id)

      if (error) throw error

      navigate(`/post/${id}`)
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Error updating post: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    setSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('Posts')
        .update({
          name: formData.name.trim() || 'Unnamed Player',
          title: formData.title.trim() || 'Untitled Post',
          content: formData.content.trim() || 'No content yet...',
          image: formData.image.trim() || null,
          submit: false
        })
        .eq('id', id)

      if (error) throw error

      alert('Draft saved successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Error saving draft: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="post-not-found">
        <h2>Post not found</h2>
        <p>The post you're trying to edit doesn't exist.</p>
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="edit-post">
      <div className="edit-post-header">
        <h1>✏️ Edit Your GOAT Pick</h1>
        <p>Update your argument for why this player is the greatest</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-post-form">
        <div className="form-group">
          <label htmlFor="name">
            Basketball Player Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., LeBron James, Michael Jordan, Kobe Bryant..."
            className={errors.name ? 'error' : ''}
            maxLength={100}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="title">
            Post Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Why Kevin Durant is the undisputed GOAT"
            className={errors.title ? 'error' : ''}
            maxLength={200}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="content">
            Your GOAT Argument <span className="required">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Explain why you think this player is the greatest of all time. What makes them special? Their achievements, skills, impact on the game..."
            rows={8}
            className={errors.content ? 'error' : ''}
            maxLength={2000}
          />
          <div className="character-count">
            {formData.content.length}/2000 characters
          </div>
          {errors.content && <span className="error-message">{errors.content}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="image">
            Player Image URL (optional)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/player-image.jpg"
            className={errors.image ? 'error' : ''}
          />
          {errors.image && <span className="error-message">{errors.image}</span>}
          {formData.image && !errors.image && (
            <div className="image-preview">
              <img 
                src={formData.image} 
                alt="Preview" 
                onError={(e) => {
                  e.target.style.display = 'none'
                  setErrors(prev => ({ ...prev, image: 'Invalid image URL' }))
                }}
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleSaveDraft}
            className="draft-btn"
            disabled={submitting}
          >
            💾 Save as Draft
          </button>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? '🔄 Updating...' : '✅ Update Post'}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate(`/post/${id}`)}
            className="cancel-btn"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPost
