import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LeapPrediction } from '../../data/leapData';
import { STATUS_COLOURS, STATUS_LABELS } from './leapConstants';

// LeapTimelineCard — expandable card for a single leap showing stormy/sunny phases and skills.
export default function LeapTimelineCard({
  prediction,
  expanded,
  onToggle,
}: {
  prediction: LeapPrediction;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { leap, stormyStart, peakDate, sunnyDate, status } = prediction;
  const isActive = status === 'stormy' || status === 'current';

  return (
    <div
      role="listitem"
      className={`rounded-xl border-2 p-4 transition-all duration-300 ${STATUS_COLOURS[status]} ${
        isActive ? 'shadow-md ring-2 ring-offset-1' : ''
      } ${isActive && status === 'stormy' ? 'ring-amber-300' : ''} ${
        isActive && status === 'current' ? 'ring-emerald-300' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={expanded}
        aria-controls={`leap-detail-${leap.number}`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-lg font-bold shadow-sm">
            {leap.number}
          </span>
          <div>
            <div className="font-bold text-sm">{leap.title}</div>
            <div className="text-xs opacity-80">
              {format(stormyStart, 'd MMM')} – {format(sunnyDate, 'd MMM yyyy')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">{STATUS_LABELS[status]}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div id={`leap-detail-${leap.number}`} className="mt-3 pt-3 border-t border-current/10">
          <p className="text-sm mb-2">{leap.description}</p>
          <div className="text-xs mb-2">
            <strong>Peak:</strong> {format(peakDate, 'd MMM yyyy')}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {leap.skills.map((skill) => (
              <span key={skill} className="rounded-full bg-white/50 px-2.5 py-0.5 text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
          {/* Parental tips (#45) */}
          {leap.parentalTips.length > 0 && (
            <div className="mt-2 rounded-lg bg-white/40 p-3">
              <p className="text-xs font-bold mb-1.5">💡 Parental tips</p>
              <ul className="space-y-1">
                {leap.parentalTips.map((tip, i) => (
                  <li key={i} className="text-xs flex gap-1.5">
                    <span aria-hidden="true">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {leap.resourceLinks && leap.resourceLinks.length > 0 && (
            <div className="mt-2 rounded-lg bg-white/40 p-3">
              <p className="text-xs font-bold mb-1.5">🔗 Trusted resources</p>
              <ul className="space-y-1">
                {leap.resourceLinks.map((link) => (
                  <li key={link.url}>
                    {link.url.startsWith('/') ? (
                      <Link to={link.url} className="text-xs font-medium underline underline-offset-2">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium underline underline-offset-2"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
