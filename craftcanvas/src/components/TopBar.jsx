import '../styles/TopBar.css'

const DEVICES = [
  { id: 'desktop', icon: '🖥', label: 'Desktop' },
  { id: 'tablet',  icon: '📱', label: 'Tablet'  },
  { id: 'mobile',  icon: '📲', label: 'Mobile'  },
]

// Add onCodePreview to props
const TopBar = ({
  device, setDevice,
  zoom, setZoom,
  onUndo, onRedo,
  onPreview, onExport,
  onCodePreview,          // ← new prop
  leftCollapsed,  setLeftCollapsed,
  rightCollapsed, setRightCollapsed,
}) => {
  return (
    <div className="topbar">

      <span className="topbar-logo">✦ CraftCanvas</span>

      <div className="topbar-divider" />

      <button
        className="topbar-btn"
        onClick={() => setLeftCollapsed(!leftCollapsed)}
      >
        {leftCollapsed ? '⇥ Show' : '⇤ Hide'}
      </button>

      <div className="topbar-divider" />

      <button className="topbar-btn" onClick={onUndo}>↩ Undo</button>
      <button className="topbar-btn" onClick={onRedo}>↪ Redo</button>

      <div className="topbar-divider" />

      <div className="topbar-device-group">
        {DEVICES.map((d) => (
          <button
            key={d.id}
            className={`device-btn ${device === d.id ? 'active' : ''}`}
            title={d.label}
            onClick={() => setDevice(d.id)}
          >
            {d.icon}
          </button>
        ))}
      </div>

      <div className="topbar-zoom">
        <button onClick={() => setZoom(z => Math.max(25, z - 25))}>−</button>
        <span>{zoom}%</span>
        <button onClick={() => setZoom(z => Math.min(200, z + 25))}>+</button>
      </div>

      <div className="topbar-spacer" />

      {/* ── Code preview icon button ──────────────────
          Uses <> symbol to hint at code.
          title gives a tooltip on hover.
      ────────────────────────────────────────────────── */}
      <button
        className="topbar-btn"
        title="Code Preview (HTML & CSS)"
        onClick={onCodePreview}
      >
        &lt;/&gt;
      </button>

      <div className="topbar-divider" />

      <button className="topbar-btn" onClick={onPreview}>👁 Preview</button>
      <button className="topbar-btn active" onClick={onExport}>⬇ Export</button>

      <div className="topbar-divider" />

      <button
        className="topbar-btn"
        onClick={() => setRightCollapsed(!rightCollapsed)}
      >
        {rightCollapsed ? '⇤ Show' : '⇥ Hide'}
      </button>

    </div>
  )
}

export default TopBar