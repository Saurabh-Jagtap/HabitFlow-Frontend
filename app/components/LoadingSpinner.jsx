const LoadingSpinner = ({ fullScreen = true, size = "lg", message = "Loading..." }) => {
  
  // Map size prop to Tailwind classes
  const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  const spinnerContent = (
    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
      {/* The Spinner */}
      <div className="relative">
        <div className={`loading loading-spinner text-indigo-500 ${sizeClasses[size]}`}></div>
        
        {/* Optional: Add a subtle pulse behind it for extra polish */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse -z-10"></div>
      </div>

      {/* Optional Message */}
      {message && (
        <p className="text-sm font-medium text-base-content/60 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-base-100/50 backdrop-blur-sm fixed inset-0 z-50">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;