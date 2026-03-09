import { useState, useRef, useEffect } from 'react'
import TopBar from './components/TopBar'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import Canvas from './components/Canvas'
import CodeModal from './components/CodeModal'    // ← import modal
import './styles/layout.css'

const App = () => {
  const editorRef = useRef(null)

  const [leftCollapsed,  setLeftCollapsed]  = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [device,  setDevice]  = useState('desktop')
  const [zoom,    setZoom]    = useState(100)
  const [selectedTag, setSelectedTag] = useState(null)

  // Controls whether code modal is open or closed
  const [codeModalOpen, setCodeModalOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const editor = editorRef.current
      if (!editor) return
      clearInterval(interval)
      editor.on('component:selected', (component) => {
        const tag = component.get('tagName') || 'element'
        setSelectedTag(tag.toUpperCase())
      })
      editor.on('component:deselected', () => setSelectedTag(null))
    }, 300)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrl = e.ctrlKey || e.metaKey
      if (!isCtrl) return
      switch (e.key) {
        case 'z': e.preventDefault(); onUndo();    break
        case 'y': e.preventDefault(); onRedo();    break
        case 'p': e.preventDefault(); onPreview(); break
        case 'e': e.preventDefault(); onExport();  break
        default: break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const onUndo = () => {
    const editor = editorRef.current
    if (!editor) return
    editor.UndoManager.undo()
  }

  const onRedo = () => {
    const editor = editorRef.current
    if (!editor) return
    editor.UndoManager.redo()
  }

  const onPreview = () => {
    const editor = editorRef.current
    if (!editor) return
    const html = editor.getHtml()
    const css  = editor.getCss()
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>* { margin:0; padding:0; box-sizing:border-box; } ${css}</style>
</head>
<body>${html}</body>
</html>`
    const newTab = window.open('', '_blank')
    newTab.document.write(fullHtml)
    newTab.document.close()
  }

  const onExport = () => {
    const editor = editorRef.current
    if (!editor) return
    const html = editor.getHtml()
    const css  = editor.getCss()
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>* { margin:0; padding:0; box-sizing:border-box; } ${css}</style>
</head>
<body>${html}</body>
</html>`
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'craftcanvas-export.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="editor-wrapper">

      <TopBar
        device={device}           setDevice={setDevice}
        zoom={zoom}               setZoom={setZoom}
        onUndo={onUndo}           onRedo={onRedo}
        onPreview={onPreview}     onExport={onExport}
        onCodePreview={() => setCodeModalOpen(true)}   // ← open modal
        leftCollapsed={leftCollapsed}   setLeftCollapsed={setLeftCollapsed}
        rightCollapsed={rightCollapsed} setRightCollapsed={setRightCollapsed}
      />

      <div className="editor-body">
        <LeftSidebar
          collapsed={leftCollapsed}
          setCollapsed={setLeftCollapsed}
          editorRef={editorRef}
        />
        <Canvas
          editorRef={editorRef}
          device={device}
          zoom={zoom}
          selectedTag={selectedTag}
        />
        <RightSidebar
          collapsed={rightCollapsed}
          setCollapsed={setRightCollapsed}
          editorRef={editorRef}
        />
      </div>

      {/* Modal renders outside the layout flow
          position:fixed makes it float above everything */}
      <CodeModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        editorRef={editorRef}
      />

    </div>
  )
}

export default App