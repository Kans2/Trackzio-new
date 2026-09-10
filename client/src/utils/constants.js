export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
  { value: 'original_title.asc', label: 'A-Z' },
];

export const PLACEHOLDER_POSTER = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
    <rect fill="#1a1a2e" width="500" height="750"/>
    <text fill="#4a4a5a" font-family="Inter,sans-serif" font-size="24" x="50%" y="50%" text-anchor="middle" dy=".3em">No Image</text>
  </svg>`
);

export const PLACEHOLDER_BACKDROP = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <rect fill="#1a1a2e" width="1280" height="720"/>
    <text fill="#4a4a5a" font-family="Inter,sans-serif" font-size="32" x="50%" y="50%" text-anchor="middle" dy=".3em">No Backdrop</text>
  </svg>`
);

export const getRatingColor = (rating) => {
  if (rating >= 7) return 'var(--rating-high)';
  if (rating >= 5) return 'var(--rating-medium)';
  return 'var(--rating-low)';
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};
