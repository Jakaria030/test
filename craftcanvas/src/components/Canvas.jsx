import { useEffect, useRef } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import BLOCKS from '../blocks'
import '../styles/Canvas.css'

const RULER_MARKS = Array.from({ length: 20 }, (_, i) => i * 50)

const DEVICE_SIZES = {
  desktop: { width: '100%',  height: '100%'  },
  tablet:  { width: '768px', height: '700px' },
  mobile:  { width: '390px', height: '720px' },
}

// Add selectedTag to props
const Canvas = ({ editorRef, device, zoom, selectedTag }) => {
  const hasInit = useRef(false)

  useEffect(() => {
    if (hasInit.current) return
    hasInit.current = true

    const editor = grapesjs.init({
      container: '#gjs',
      height: '100%',
      width: '100%',
      storageManager: false,
      richTextEditor: { actions: [] },
      panels: { defaults: [] },
      blockManager: { blocks: [] },
      styleManager:  { appendTo: null, sectors: [] },
      layerManager:  { appendTo: null },
      traitManager:  { appendTo: null },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: ''      },
          { name: 'Tablet',  width: '768px' },
          { name: 'Mobile',  width: '390px' },
        ]
      },
      components: `
        <section style="
          padding: 80px 40px;
          background: linear-gradient(135deg, #5b6cff, #ff5b8d);
          color: #fff;
          text-align: center;
        ">
          <h1 style="font-size:2.5rem;font-weight:800;margin-bottom:16px">
            Welcome to CraftCanvas
          </h1>
          <p style="font-size:1rem;opacity:0.85;margin-bottom:28px">
            Drag blocks from the left panel and start building.
          </p>
          <a href="#" style="
            display: inline-block;
            padding: 12px 28px;
            background: #fff;
            color: #5b6cff;
            border-radius: 8px;
            font-weight: 700;
            text-decoration: none;
          ">Get Started</a>
        </section>
      `,
    })

    editorRef.current = editor

    const bm = editor.BlockManager
    BLOCKS.forEach((block) => {
      bm.add(block.id, {
        label:   block.label,
        content: block.content,
      })
    })

  }, [])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    const deviceMap = {
      desktop: 'Desktop',
      tablet:  'Tablet',
      mobile:  'Mobile',
    }
    editor.DeviceManager.select(deviceMap[device])
  }, [device])

  const frameSize  = DEVICE_SIZES[device]
  const frameStyle = {
    width:           frameSize.width,
    height:          frameSize.height,
    transform:       `scale(${zoom / 100})`,
    transformOrigin: 'top center',
  }

  return (
    <div className="canvas-area">

      <div className="canvas-ruler">
        <div className="ruler-marks">
          {RULER_MARKS.map((mark) => (
            <span key={mark} className="ruler-mark">{mark}</span>
          ))}
        </div>
      </div>

      <div className="canvas-wrapper">
        <div className="canvas-frame" style={frameStyle}>
          <div id="gjs" />
        </div>
      </div>

      {/* ── Status bar ─────────────────────────── */}
      <div className="statusbar">

        <div className="status-dot" />

        <span className="status-value">Ready</span>
        <span className="status-sep">·</span>

        <span>GrapesJS</span>
        <span className="status-sep">·</span>

        {/* Device name */}
        <span className="status-value">
          {device.charAt(0).toUpperCase() + device.slice(1)}
        </span>
        <span className="status-sep">·</span>

        {/* Zoom level */}
        <span className="status-value">{zoom}%</span>

        {/* Only show selected tag when something is selected */}
        {selectedTag && (
          <>
            <span className="status-sep">·</span>

            {/* Tag name with accent color highlight */}
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
              &lt;{selectedTag}&gt;   {/* renders as <H1> or <DIV> etc */}
            </span>
          </>
        )}

        {/* Keyboard shortcuts hint — sits on the far right */}
        <span style={{ marginLeft: 'auto', color: 'var(--text3)' }}>
          Ctrl+Z · Ctrl+Y · Ctrl+P · Ctrl+E
        </span>

      </div>

    </div>
  )
}

export default Canvas