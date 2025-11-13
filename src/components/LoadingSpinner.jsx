import './LoadingSpinner.css'

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ball"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  )
}

export default LoadingSpinner
