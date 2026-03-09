import { useEffect, useState } from 'react'
import '../styles/Modal.css'

const CodeModal = ({ isOpen, onClose, editorRef }) => {
    const [activeTab, setActiveTab] = useState('html')
    const [copied, setCopied] = useState(false)

    // Close modal when Escape key is pressed
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose()
        }

        // Only listen when modal is open
        if (isOpen) {
            window.addEventListener('keydown', handleEsc)
        }

        // Always clean up listener
        return () => window.removeEventListener('keydown', handleEsc)

    }, [isOpen])   // re-run when isOpen changes
    // Don't render anything if modal is closed
    // This is better than CSS display:none because it
    // avoids running getHtml/getCss when modal is closed
    if (!isOpen) return null

    const editor = editorRef.current
    if (!editor) return null

    // ── Get code from GrapesJS ─────────────────────────
    // getHtml() returns canvas content as HTML string
    // getCss()  returns all styles as CSS string
    const rawHtml = editor.getHtml()
    const rawCss = editor.getCss()

    // ── Format HTML with indentation ──────────────────
    // We add newlines after closing tags to make it readable
    const formattedHtml = rawHtml
        .replace(/></g, '>\n<')          // newline between tags
        .replace(/(<[^/][^>]*>)/g, '$1') // keep opening tags as is
        .split('\n')
        .map((line, i) => {
            // Simple indentation — count opening vs closing tags
            return line.trim()
        })
        .join('\n')

    // ── Calculate stats ────────────────────────────────
    const htmlLines = formattedHtml.split('\n').length
    const cssLines = rawCss.split('\n').length
    const htmlSize = new Blob([rawHtml]).size    // size in bytes
    const cssSize = new Blob([rawCss]).size

    // Convert bytes to KB — toFixed(1) gives 1 decimal place
    const toKb = (bytes) => (bytes / 1024).toFixed(1)

    // ── Copy to clipboard ──────────────────────────────
    const handleCopy = () => {
        const content = activeTab === 'html' ? rawHtml : rawCss

        // navigator.clipboard is the modern clipboard API
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true)   // show "Copied!" text

            // Reset back to "Copy" after 2 seconds
            setTimeout(() => setCopied(false), 2000)
        })
    }

    // ── Close when clicking overlay (outside modal) ────
    const handleOverlayClick = (e) => {
        // e.target is what was clicked
        // e.currentTarget is the overlay div itself
        // If they match, user clicked the overlay background
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>

            <div className="modal">

                {/* ── Header ───────────────────────────────── */}
                <div className="modal-header">
                    <div className="modal-title">
                        <div className="modal-title-dot" />
                        Code Preview
                    </div>

                    {/* Close button */}
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* ── Tabs ─────────────────────────────────── */}
                <div className="modal-tabs">
                    <button
                        className={`modal-tab ${activeTab === 'html' ? 'active' : ''}`}
                        onClick={() => setActiveTab('html')}
                    >
                        HTML
                    </button>
                    <button
                        className={`modal-tab ${activeTab === 'css' ? 'active' : ''}`}
                        onClick={() => setActiveTab('css')}
                    >
                        CSS
                    </button>
                </div>

                {/* ── Code area ────────────────────────────── */}
                <div className="modal-body">

                    {/* Copy button — floats in top right */}
                    <button className="copy-btn" onClick={handleCopy}>
                        {copied ? '✓ Copied!' : '⎘ Copy'}
                    </button>

                    {/* HTML tab content */}
                    {activeTab === 'html' && (
                        <pre className="code-block">
                            {formattedHtml}
                        </pre>
                    )}

                    {/* CSS tab content */}
                    {activeTab === 'css' && (
                        <pre className="code-block">
                            {rawCss || '/* No styles yet */'}
                        </pre>
                    )}

                </div>

                {/* ── Footer with stats ────────────────────── */}
                <div className="modal-footer">

                    <div className="footer-stat">
                        <span>HTML</span>
                        <span className="footer-stat-value">{htmlLines}</span>
                        <span>lines</span>
                        <span className="footer-stat-value">{toKb(htmlSize)}kb</span>
                    </div>

                    <span>·</span>

                    <div className="footer-stat">
                        <span>CSS</span>
                        <span className="footer-stat-value">{cssLines}</span>
                        <span>lines</span>
                        <span className="footer-stat-value">{toKb(cssSize)}kb</span>
                    </div>

                    <span style={{ marginLeft: 'auto' }}>
                        Press <span style={{ color: 'var(--accent)' }}>Esc</span> to close
                    </span>

                </div>
            </div>
        </div>
    )
}

export default CodeModal