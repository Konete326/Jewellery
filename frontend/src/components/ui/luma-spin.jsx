export const Component = ({
  className = '',
  size = 65,
  variant = 'default'
} = {}) => {
  const scale = size ? size / 65 : 1;
  const shadowColor = {
    default: 'shadow-gray-800 dark:shadow-gray-100',
    amber: 'shadow-amber-600 dark:shadow-amber-400',
    gold: 'shadow-amber-500/90 dark:shadow-amber-300',
    light: 'shadow-white'
  }[variant] || 'shadow-gray-800 dark:shadow-gray-100';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
      role="status"
      aria-label="Loading"
    >
      <div
        className="relative w-[65px] aspect-square origin-center shrink-0"
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined
        }}
      >
        <span
          className={`absolute rounded-[50px] animate-loaderAnim shadow-[inset_0_0_0_3px] ${shadowColor}`}
        />
        <span
          className={`absolute rounded-[50px] animate-loaderAnim animation-delay shadow-[inset_0_0_0_3px] ${shadowColor}`}
        />
      </div>
      <style>{`
        @keyframes loaderAnim {
          0% {
            inset: 0 35px 35px 0;
          }
          12.5% {
            inset: 0 35px 0 0;
          }
          25% {
            inset: 35px 35px 0 0;
          }
          37.5% {
            inset: 35px 0 0 0;
          }
          50% {
            inset: 35px 0 0 35px;
          }
          62.5% {
            inset: 0 0 0 35px;
          }
          75% {
            inset: 0 0 35px 35px;
          }
          87.5% {
            inset: 0 0 35px 0;
          }
          100% {
            inset: 0 35px 35px 0;
          }
        }
        .animate-loaderAnim {
          animation: loaderAnim 2.5s infinite;
        }
        .animation-delay {
          animation-delay: -1.25s;
        }
      `}</style>
    </div>
  );
};

export const LumaSpin = Component;
export default Component;
