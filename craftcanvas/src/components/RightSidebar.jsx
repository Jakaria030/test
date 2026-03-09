import { useState, useEffect } from 'react'
import '../styles/Sidebar.css'

// Icons shown in collapsed icon strip
const STRIP_ICONS = ['✦', '⊡', '{}']

// ── Style tab properties ───────────────────────────────
// Each object defines one row in the style panel
const STYLE_PROPS = [
    { label: 'Font Size', property: 'font-size', placeholder: '16px' },
    { label: 'Color', property: 'color', placeholder: '#000000' },
    { label: 'Background', property: 'background-color', placeholder: '#ffffff' },
    { label: 'Padding', property: 'padding', placeholder: '8px' },
    { label: 'Margin', property: 'margin', placeholder: '0px' },
    { label: 'Width', property: 'width', placeholder: 'auto' },
    { label: 'Height', property: 'height', placeholder: 'auto' },
    { label: 'Border', property: 'border', placeholder: '1px solid #ccc' },
    { label: 'Radius', property: 'border-radius', placeholder: '0px' },
    { label: 'Opacity', property: 'opacity', placeholder: '1' },
]

// ── Props tab attributes ───────────────────────────────
const ATTR_PROPS = [
    { label: 'ID', attr: 'id', placeholder: 'element-id' },
    { label: 'Class', attr: 'class', placeholder: 'class-name' },
    { label: 'Href', attr: 'href', placeholder: 'https://' },
    { label: 'Src', attr: 'src', placeholder: 'image url' },
    { label: 'Alt', attr: 'alt', placeholder: 'alt text' },
    { label: 'Target', attr: 'target', placeholder: '_blank' },
]

const RightSidebar = ({ collapsed, setCollapsed, editorRef }) => {
    const [activeTab, setActiveTab] = useState('style')
    const [selectedEl, setSelectedEl] = useState(null)   // selected GrapesJS component
    const [styles, setStyles] = useState({})     // current style values
    const [attrs, setAttrs] = useState({})     // current attribute values
    const [customCss, setCustomCss] = useState('')     // raw CSS input value

    // ── Listen for element selection on canvas ─────────
    useEffect(() => {
        // Poll until editor is ready
        // We use interval because editor init is async
        const interval = setInterval(() => {
            const editor = editorRef.current
            if (!editor) return

            clearInterval(interval)   // editor ready, stop polling

            // Fires when user clicks an element on canvas
            editor.on('component:selected', (component) => {
                setSelectedEl(component)

                // Read all style values from selected element
                const currentStyles = {}
                STYLE_PROPS.forEach(({ property }) => {
                    // getStyle() returns object of all inline styles
                    currentStyles[property] = component.getStyle()[property] || ''
                })
                setStyles(currentStyles)

                // Read all attribute values from selected element
                const currentAttrs = {}
                ATTR_PROPS.forEach(({ attr }) => {
                    // getAttributes() returns object of all attributes
                    currentAttrs[attr] = component.getAttributes()[attr] || ''
                })
                setAttrs(currentAttrs)
            })

            // Fires when user clicks away from element
            editor.on('component:deselected', () => {
                setSelectedEl(null)
                setStyles({})
                setAttrs({})
                setCustomCss('')
            })

        }, 300)

        return () => clearInterval(interval)   // cleanup on unmount
    }, [])

    // ── Apply style change to canvas element ───────────
    const handleStyleChange = (property, value) => {
        setStyles(prev => ({ ...prev, [property]: value }))

        if (selectedEl) {
            // addStyle merges new value with existing styles
            selectedEl.addStyle({ [property]: value })
        }
    }

    // ── Apply attribute change to canvas element ───────
    const handleAttrChange = (attr, value) => {
        setAttrs(prev => ({ ...prev, [attr]: value }))

        if (selectedEl) {
            // addAttributes merges with existing attributes
            selectedEl.addAttributes({ [attr]: value })
        }
    }

    // ── Apply raw CSS to canvas ────────────────────────
    const handleApplyCss = () => {
        const editor = editorRef.current
        if (!editor || !customCss.trim()) return

        // getCss returns all existing CSS
        // We append our custom CSS on top
        editor.setStyle(editor.getCss() + '\n' + customCss)
    }

    return (
        <div className={`sidebar right ${collapsed ? 'collapsed' : ''}`}>

            {/* ── Toggle button ──────────────────────────
          Sticks out from the LEFT edge of sidebar.
      ────────────────────────────────────────────── */}
            <button
                className="sidebar-toggle"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? '‹' : '›'}   {/* opposite direction from left sidebar */}
            </button>

            {/* ── Icon strip (collapsed only) ─────────── */}
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

            {/* ── Full content (open only) ────────────── */}
            {!collapsed && (
                <div className="sidebar-content">

                    {/* Tab bar — 3 tabs */}
                    <div className="sidebar-tabs">
                        {['style', 'props', 'css'].map((tab) => (
                            <button
                                key={tab}
                                className={`sidebar-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="sidebar-panel">

                        {/* ── No element selected message ──── */}
                        {!selectedEl && (
                            <p style={{
                                color: 'var(--text3)',
                                fontSize: 12,
                                textAlign: 'center',
                                padding: '24px 8px',
                                lineHeight: 1.6
                            }}>
                                Click an element on the canvas to edit its properties
                            </p>
                        )}

                        {/* ── Element selected — show panels ── */}
                        {selectedEl && (
                            <>

                                {/* Selected element tag name */}
                                <div style={{
                                    fontSize: 11,
                                    color: 'var(--accent)',
                                    background: 'var(--bg3)',
                                    padding: '4px 8px',
                                    borderRadius: 'var(--radius)',
                                    marginBottom: 10,
                                    fontFamily: 'var(--font-mono)',
                                }}>
                                    {/* get('tagName') returns html tag eg: div, p, h1 */}
                                    &lt;{selectedEl.get('tagName') || 'element'}&gt;
                                </div>

                                {/* ── STYLE TAB ─────────────────── */}
                                {activeTab === 'style' && (
                                    <div>
                                        <div className="section-header">CSS Properties</div>

                                        {STYLE_PROPS.map(({ label, property, placeholder }) => (
                                            <div key={property} className="prop-row">

                                                <label className="prop-label">{label}</label>

                                                <input
                                                    className="prop-input"
                                                    value={styles[property] || ''}
                                                    placeholder={placeholder}
                                                    onChange={(e) => handleStyleChange(property, e.target.value)}
                                                // onChange fires on every keystroke
                                                // applies style live to canvas
                                                />

                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── PROPS TAB ─────────────────── */}
                                {activeTab === 'props' && (
                                    <div>
                                        <div className="section-header">Attributes</div>

                                        {ATTR_PROPS.map(({ label, attr, placeholder }) => (
                                            <div key={attr} className="prop-row">

                                                <label className="prop-label">{label}</label>

                                                <input
                                                    className="prop-input"
                                                    value={attrs[attr] || ''}
                                                    placeholder={placeholder}
                                                    onChange={(e) => handleAttrChange(attr, e.target.value)}
                                                />

                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ── CSS TAB ───────────────────── */}
                                {activeTab === 'css' && (
                                    <div>
                                        <div className="section-header">Raw CSS</div>

                                        <textarea
                                            className="prop-input"
                                            style={{
                                                height: 200,
                                                resize: 'vertical',     /* user can resize vertically */
                                                lineHeight: 1.6,
                                                fontFamily: 'var(--font-mono)',
                                                whiteSpace: 'pre',      /* preserve indentation */
                                            }}
                                            value={customCss}
                                            placeholder={`.my-class {\n  color: red;\n}`}
                                            onChange={(e) => setCustomCss(e.target.value)}
                                        />

                                        <button
                                            onClick={handleApplyCss}
                                            style={{
                                                marginTop: 8,
                                                width: '100%',
                                                padding: '7px',
                                                background: 'var(--accent)',
                                                border: 'none',
                                                borderRadius: 'var(--radius)',
                                                color: '#fff',
                                                fontFamily: 'var(--font-ui)',
                                                fontWeight: 700,
                                                fontSize: 12,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Apply CSS
                                        </button>
                                    </div>
                                )}

                            </>
                        )}

                    </div>
                </div>
            )}

        </div>
    )
}

export default RightSidebar