import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabaseClient'
import './CreatePost.css'

const CreatePost = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',      
    title: '',     
    content: '',   
    image: ''      
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Soccer player name is required!')
      return
    }

    if (!formData.title.trim()) {
      alert('Post title is required!')
      return
    }

    if (!formData.content.trim()) {
      alert('Please explain why this player is the GOAT!')
      return
    }

    setLoading(true)
    
    try {
      const postData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        content: formData.content.trim(),
        image: formData.image.trim() || null,
        submit: true,
        likes: 0,
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('Posts')
        .insert([postData])
        .select()

      if (error) throw error

      alert('Post created successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Creating your post...</p>
      </div>
    )
  }

  return (
    <div className="create-post">
      <div className="create-post-container">
        <h1>🏀 Who's Your GOAT?</h1>
        <p>Share your pick for the greatest Basketball player of all time!</p>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="name">Basketball Player Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., LeBron James, Michael Jordan, Kobe Bryant..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Why Steph Curry is the undisputed GOAT"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Why are they the GOAT? *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder='Explain why this player is the greatest of all time. Talk about their achievements, skills, impact on the game.. 
              e.g., Kevin Durant is 6”11 with a 7”6 wingspan who can pull up from 30 that has handles and can average 30 in his sleep. The brutha is special! - Stephen A. Smith'
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Player Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/player-image.jpg"
            />
            <small>Paste a link to an image of the player (optional)</small>
          </div>

          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Player preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/')} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              Share Your GOAT Pick
            </button>
          </div></form></div> </div>)}

export default CreatePost
