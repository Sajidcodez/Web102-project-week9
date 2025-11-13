import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import './SettingsPanel.css'

const SettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    colorScheme,
    switchColorScheme,
    colorSchemes,
    showPostImages,
    toggleShowPostImages,
    layoutMode,
    toggleLayoutMode
  } = useTheme()

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const closePanel = () => {
    setIsOpen(false)
  }

  return (
    <div className="settings-container">
      {/* Settings Button */}
      <button 
        className="settings-btn"
        onClick={togglePanel}
        title="Open Settings"
      >
        ⚙️
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="settings-panel">
          <div className="settings-header">
            <h3>⚙️ Settings</h3>
            <button className="close-btn" onClick={closePanel}>✕</button>
          </div>

          <div className="settings-content">
            {/* Color Scheme Section */}
            <div className="settings-section">
              <label className="settings-label">Color Scheme:</label>
              <div className="color-scheme-options">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    className={`scheme-btn ${colorScheme.id === scheme.id ? 'active' : ''}`}
                    onClick={() => switchColorScheme(scheme.id)}
                    title={scheme.name}
                    style={{
                      background: `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 100%)`
                    }}
                  >
                    {colorScheme.id === scheme.id && '✓'}
                  </button>
                ))}
            </div>
            <p className="scheme-name">{colorScheme.name}</p>
            </div>

            {/* Show Images Toggle */}
            <div className="settings-section">
              <label className="settings-label">
                <input
                  type="checkbox"
                  checked={showPostImages}
                  onChange={toggleShowPostImages}
                  className="toggle-checkbox"
                />
                <span className="toggle-label">Show Post Images</span>
              </label>
            </div>            {/* Layout Mode Toggle */}
            <div className="settings-section">
              <label className="settings-label">
                <input
                  type="checkbox"
                  checked={layoutMode === 'compact'}
                  onChange={toggleLayoutMode}
                  className="toggle-checkbox"
                />
                <span className="toggle-label">
                  Compact Mode {layoutMode === 'compact' && '(Enabled)'}
                </span>
              </label>
            </div>

            {/* Info Footer */}
            <div className="settings-footer">
              <p>Settings are saved automatically</p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close panel when clicking outside */}
      {isOpen && (
        <div className="settings-overlay" onClick={closePanel}></div>
      )}
    </div>
  )
}

export default SettingsPanel
