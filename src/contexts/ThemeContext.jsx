import { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Available color schemes
  const colorSchemes = {
    default: {
      name: 'Basketball Blue & Orange',
      primary: '#0f3460',
      secondary: '#ff6b35',
      accent: '#ff8c42',
      background: 'rgba(0, 0, 0, 0.7)',
      navGradient: 'linear-gradient(90deg, rgba(0, 0, 0, 0.7) 0%, rgba(15, 52, 96, 0.8) 50%, rgba(255, 107, 53, 0.4) 100%)',
      id: 'default'
    },
    lakers: {
      name: 'Lakers Purple & Gold',
      primary: '#552583',
      secondary: '#fdb927',
      accent: '#fdbb30',
      background: 'rgba(85, 37, 131, 0.1)',
      navGradient: 'linear-gradient(90deg, rgba(85, 37, 131, 0.7) 0%, rgba(253, 185, 39, 0.6) 100%)',
      id: 'lakers'
    },
    bulls: {
      name: 'Bulls Red & Black',
      primary: '#ce1141',
      secondary: '#000000',
      accent: '#ff6b35',
      background: 'rgba(206, 17, 65, 0.1)',
      navGradient: 'linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(206, 17, 65, 0.8) 100%)',
      id: 'bulls'
    },
    celtics: {
      name: 'Celtics Green & White',
      primary: '#007a33',
      secondary: '#ffffff',
      accent: '#00d981',
      background: 'rgba(0, 122, 51, 0.1)',
      navGradient: 'linear-gradient(90deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 122, 51, 0.8) 100%)',
      id: 'celtics'
    }
  }

  // Load theme from localStorage or use default
  const [colorScheme, setColorScheme] = useState(() => {
    const saved = localStorage.getItem('basketballhub_colorScheme')
    return saved && colorSchemes[saved] ? colorSchemes[saved] : colorSchemes.default
  })

  const [showPostImages, setShowPostImages] = useState(() => {
    const saved = localStorage.getItem('basketballhub_showImages')
    return saved !== null ? JSON.parse(saved) : true
  })

  const [layoutMode, setLayoutMode] = useState(() => {
    const saved = localStorage.getItem('basketballhub_layoutMode')
    return saved || 'standard'
  })

  // Persist color scheme
  useEffect(() => {
    localStorage.setItem('basketballhub_colorScheme', colorScheme.id)
  }, [colorScheme])

  // Persist image visibility
  useEffect(() => {
    localStorage.setItem('basketballhub_showImages', JSON.stringify(showPostImages))
  }, [showPostImages])

  // Persist layout mode
  useEffect(() => {
    localStorage.setItem('basketballhub_layoutMode', layoutMode)
  }, [layoutMode])

  const switchColorScheme = (schemeId) => {
    if (colorSchemes[schemeId]) {
      setColorScheme(colorSchemes[schemeId])
    }
  }

  const toggleShowPostImages = () => {
    setShowPostImages(!showPostImages)
  }

  const toggleLayoutMode = () => {
    setLayoutMode(layoutMode === 'standard' ? 'compact' : 'standard')
  }

  const value = {
    colorScheme,
    switchColorScheme,
    colorSchemes: Object.values(colorSchemes),
    showPostImages,
    toggleShowPostImages,
    layoutMode,
    toggleLayoutMode
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
