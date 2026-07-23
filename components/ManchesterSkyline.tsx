/**
 * A subtle Manchester skyline silhouette, used as a hero backdrop.
 *
 * Landmarks referenced (left to right, roughly):
 *  - Manchester Town Hall clock tower
 *  - Victorian mills / warehouses
 *  - Georgian terrace (echoing 22 St John Street)
 *  - Beetham Tower (tapered top)
 *  - Deansgate Square towers (four modern towers)
 *  - CIS / NOMA blocks
 *
 * Uses currentColor so it inherits the surrounding text colour and works
 * in both light and dark mode; kept at low opacity to avoid competing
 * with the hero copy.
 */
export function ManchesterSkyline({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1600 500"
      className={className}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <g fill="currentColor">
        {/* far background: soft massing */}
        <g opacity="0.06">
          <rect x="0" y="330" width="120" height="170" />
          <rect x="120" y="300" width="90" height="200" />
          <rect x="210" y="340" width="80" height="160" />
          <rect x="1440" y="310" width="90" height="190" />
          <rect x="1530" y="340" width="70" height="160" />
        </g>

        {/* mid ground */}
        <g opacity="0.11">
          {/* Town Hall block + clock tower */}
          <rect x="60" y="270" width="140" height="230" />
          <rect x="118" y="180" width="26" height="120" />
          <polygon points="118,180 131,150 144,180" />

          {/* Victorian mill with chimney */}
          <rect x="220" y="290" width="130" height="210" />
          <rect x="264" y="220" width="18" height="80" />

          {/* Warehouse row */}
          <rect x="360" y="310" width="90" height="190" />
          <rect x="450" y="300" width="70" height="200" />

          {/* Heritage terrace (echoes 22 St John) */}
          <rect x="520" y="330" width="120" height="170" />
          <polygon points="520,330 580,300 640,330" />

          {/* Cathedral spire */}
          <rect x="650" y="310" width="40" height="190" />
          <polygon points="650,310 670,250 690,310" />

          {/* Modern mid-rises */}
          <rect x="700" y="280" width="60" height="220" />
          <rect x="770" y="260" width="70" height="240" />
          <rect x="840" y="290" width="80" height="210" />

          {/* Deansgate Square towers, four in a row */}
          <rect x="960" y="140" width="52" height="360" />
          <rect x="1020" y="120" width="52" height="380" />
          <rect x="1080" y="150" width="52" height="350" />
          <rect x="1140" y="170" width="52" height="330" />

          {/* NOMA / CIS-style block */}
          <rect x="1220" y="240" width="60" height="260" />
          <rect x="1290" y="270" width="50" height="230" />

          {/* Distant office row */}
          <rect x="1350" y="310" width="90" height="190" />
        </g>

        {/* foreground: Beetham Tower + closer buildings */}
        <g opacity="0.16">
          {/* Beetham Tower: slim slab with distinctive top blade */}
          <rect x="895" y="80" width="56" height="420" />
          <rect x="898" y="60" width="50" height="26" />
          <rect x="920" y="20" width="8" height="60" />

          {/* Podium / bar building next to Beetham */}
          <rect x="820" y="360" width="70" height="140" />

          {/* Foreground warehouse row */}
          <rect x="400" y="380" width="80" height="120" />
          <rect x="480" y="360" width="90" height="140" />
          <rect x="570" y="390" width="70" height="110" />

          {/* Closer terrace */}
          <rect x="1300" y="380" width="100" height="120" />
          <rect x="1400" y="360" width="90" height="140" />
        </g>

        {/* ground line */}
        <rect x="0" y="498" width="1600" height="2" opacity="0.15" />
      </g>
    </svg>
  );
}
