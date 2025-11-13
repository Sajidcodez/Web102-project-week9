import './LoadingSpinner.css'

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line" style={{ width: '40%', marginBottom: '16px' }}></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line" style={{ width: '85%' }}></div>
      <div className="skeleton-image"></div>
      <div className="skeleton-line" style={{ width: '70%' }}></div>
      <div className="skeleton-line short"></div>
    </div>
  )
}

export default SkeletonCard
