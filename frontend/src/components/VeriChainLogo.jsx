export default function VeriChainLogo({ size = 36, showText = true, showSub = true }) {
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
        <polygon
          points="19,3 34,11.5 34,26.5 19,35 4,26.5 4,11.5"
          fill="none" stroke="#D4A017" strokeWidth="1.5"
        />
        <polygon
          points="19,10 27,14.5 27,23.5 19,28 11,23.5 11,14.5"
          fill="#D4A017" opacity="0.12"
        />
        <circle cx="19" cy="19" r="3.5" fill="#D4A017" />
        <line x1="19" y1="3"  x2="19"   y2="15.5" stroke="#D4A017" strokeWidth="1" opacity="0.6" />
        <line x1="34" y1="11.5" x2="22.5" y2="17.5" stroke="#D4A017" strokeWidth="1" opacity="0.6" />
        <line x1="34" y1="26.5" x2="22.5" y2="20.5" stroke="#D4A017" strokeWidth="1" opacity="0.6" />
        <line x1="19" y1="35" x2="19"   y2="22.5" stroke="#D4A017" strokeWidth="1" opacity="0.6" />
        <line x1="4"  y1="26.5" x2="15.5" y2="20.5" stroke="#D4A017" strokeWidth="1" opacity="0.6" />
        <line x1="4"  y1="11.5" x2="15.5" y2="17.5" stroke="#D4A017" strokeWidth="1" opacity="0.6" />
        <circle cx="19" cy="3"    r="2" fill="#D4A017" />
        <circle cx="34" cy="11.5" r="2" fill="#D4A017" />
        <circle cx="34" cy="26.5" r="2" fill="#D4A017" />
        <circle cx="19" cy="35"   r="2" fill="#D4A017" />
        <circle cx="4"  cy="26.5" r="2" fill="#D4A017" />
        <circle cx="4"  cy="11.5" r="2" fill="#D4A017" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-medium text-[#e8e0cc] tracking-tight">
            Veri<span className="text-gold">Chain</span>
          </span>
          {showSub && (
            <span className="text-[9px] tracking-[2.5px] uppercase text-[#555] mt-1">
              Blockchain Identity
            </span>
          )}
        </div>
      )}
    </div>
  );
}