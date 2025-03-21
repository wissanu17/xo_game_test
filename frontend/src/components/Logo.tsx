const Logo = () => {
  return (
    <div>
      <svg
        width="36"
        height="36"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        <rect width="512" height="512" fill="#121212" rx="64" ry="64" />
        <path d="M106,106 L225,225 M106,225 L225,106" stroke="#4ade80" strokeWidth="24" strokeLinecap="round" fill="none" />
        <circle cx="350" cy="350" r="75" stroke="#60a5fa" strokeWidth="24" fill="none" />
        <path stroke="#ffffff" strokeWidth="8" fill="none" opacity="0.3" d="M175,256 L425,256 M256,175 L256,425" />
      </svg>
    </div>
  )
}
export default Logo