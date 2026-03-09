import { useState } from 'react'
import BLOCKS from '../blocks'
import '../styles/Sidebar.css'
import '../styles/Blocks.css'

const STRIP_ICONS = ['⊞', '☰']

const LeftSidebar = ({ collapsed, setCollapsed, editorRef }) => {
  const [activeTab, setActiveTab] = useState('blocks')

  // ── Drag start ─────────────────────────────────────
  const handleDragStart = (block) => {
    const editor = editorRef.current
    if (!editor) return

    // Tell GrapesJS which block is being dragged
    // It takes over and handles the drop into canvas
    editor.BlockManager.startDrag(
      editor.BlockManager.get(block.id)
    )
  }

  // ── Drag end ───────────────────────────────────────
  const handleDragEnd = () => {
    const editor = editorRef.current
    if (!editor) return

    // Tell GrapesJS drag is finished
    editor.BlockManager.endDrag()
  }

  return (
    <div className={`sidebar left ${collapsed ? 'collapsed' : ''}`}>

      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? '›' : '‹'}
      </button>

      {collapsed && (
        <div className="icon-strip">
          {STRIP_ICONS.map((icon, index) => (
            <div
              key={index}
              className="strip-icon"
              onClick={() => setCollapsed(false)}
            >
              {icon}
            </div>
          ))}
        </div>
      )}

      {!collapsed && (
        <div className="sidebar-content">

          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${activeTab === 'blocks' ? 'active' : ''}`}
              onClick={() => setActiveTab('blocks')}
            >
              Blocks
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'layers' ? 'active' : ''}`}
              onClick={() => setActiveTab('layers')}
            >
              Layers
            </button>
          </div>

          <div className="sidebar-panel">

            {activeTab === 'blocks' && (
              <>
                <div className="section-header">Elements</div>

                <div className="blocks-grid">
                  {BLOCKS.map((block) => (
                    <div
                      key={block.id}
                      className="block-item"
                      draggable                              // makes element draggable
                      onDragStart={() => handleDragStart(block)}  // drag begins
                      onDragEnd={handleDragEnd}             // drag ends
                    >
                      <span className="block-icon">{block.icon}</span>
                      <span className="block-label">{block.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'layers' && (
              <div>
                <div className="section-header">Tree</div>
                <p style={{ color: 'var(--text3)', fontSize: 12 }}>
                  Layers coming soon
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default LeftSidebar