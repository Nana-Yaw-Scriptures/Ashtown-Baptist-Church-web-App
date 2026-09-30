// Embedded map of the church. Uses Google Maps' keyless embed, so there is
// nothing to configure. It searches by the church's name so Google centers
// on its own verified listing (accurate pin + working place info).
const QUERY = "Ashtown Baptist Church, Kumasi, Ghana";

export function ChurchMap() {
  const q = encodeURIComponent(QUERY);
  const embed = `https://www.google.com/maps?q=${q}&z=16&output=embed`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${q}`;

  return (
    <div>
      <div className="overflow-hidden rounded-xl2 border border-mist">
        <iframe
          title="Ashtown Baptist Church location"
          src={embed}
          className="w-full h-[380px]"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={directions}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-dusk-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-dusk-700 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" />
          <circle cx="12" cy="11" r="2" />
        </svg>
        Get directions
      </a>
    </div>
  );
}
