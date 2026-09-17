import { assetUrl } from '../../api/client.js';
import { getInitials } from '../../utils/format.js';

const SIZES = {
  md: 'h-11 w-11 text-base',
  lg: 'h-24 w-24 text-3xl'
};

// Shows the admin's photo, or their initials on the navy circle when no photo has been uploaded.
export default function Avatar({ name, photoUrl, size = 'md', className = '' }) {
  const sizeClasses = SIZES[size];

  if (photoUrl) {
    return (
      <img
        src={assetUrl(photoUrl)}
        alt={name}
        className={`${sizeClasses} shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${sizeClasses} inline-flex shrink-0 items-center justify-center rounded-full bg-ink font-semibold text-white select-none ${className}`}
    >
      {getInitials(name)}
    </span>
  );
}
