import React from 'react';

// Game Boy palette
const PALETTE = {
  white: '#fff',
  black: '#000',
  lightest: '#e0f8d0',
  darkest: '#081820',
};

export function BattleScreen() {
  return (
    <div className="game-screen gameboy-screen flex flex-col items-center justify-center" style={{ width: 320, height: 288, background: PALETTE.white, border: `8px solid ${PALETTE.black}` }}>
      {/* Top area: Opponent silhouette */}
      <div style={{ width: '100%', height: 90, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 32 }}>
        <div style={{ width: 40, height: 40, background: PALETTE.black, borderRadius: '50%', boxShadow: '0 4px 0 0 #888', marginBottom: 8 }} />
      </div>
      {/* Middle area: Player silhouette */}
      <div style={{ width: '100%', height: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', paddingLeft: 32 }}>
        <div style={{ width: 40, height: 40, background: PALETTE.black, borderRadius: '50%', boxShadow: '0 4px 0 0 #888', marginBottom: 8 }} />
      </div>
      {/* Text box */}
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 320, height: 72, background: PALETTE.white, border: `4px solid ${PALETTE.black}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 8 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 16, color: PALETTE.black, lineHeight: 1.2 }}>
          FISHERMAN sent out STARYU!
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 14, color: PALETTE.black, marginTop: 8 }}>
          Meepo   Lv22   HP: 41/41
        </div>
      </div>
    </div>
  );
}
