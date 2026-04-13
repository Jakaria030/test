// src/components/topbar/Topbar.jsx

import { useEditor } from "../../context/EditorContext";
import { useAuth } from "../../context/AuthContext";

const Topbar = ({ onSave, onPublish, onExport }) => {

    const {
        gjsEditor,
        activeDevice,
        setActiveDevice,
        canUndo,
        canRedo,
        saveStatus,
        updateUndoRedoState,
    } = useEditor();

    const { user, logout } = useAuth();

    const handleDeviceChange = (device) => {
        gjsEditor.current.setDevice(device);
        setActiveDevice(device);
    };

    const handleUndo = () => {
        gjsEditor.current.UndoManager.undo();
        updateUndoRedoState();
    };

    const handleRedo = () => {
        gjsEditor.current.UndoManager.redo();
        updateUndoRedoState();
    };

    const handlePreview = () => {
        gjsEditor.current.runCommand("preview");
    };

    const handleClear = () => {
        const confirmed = window.confirm("Clear canvas?");
        if (!confirmed) return;
        gjsEditor.current.runCommand("clear-canvas");
    };

    return (
        <div style={{
            height: "52px",
            background: "#1a1a2e",
            borderBottom: "1px solid #2a2a4a",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 8,
            flexShrink: 0,
        }}>

            {/* Logo */}
            <div style={{ color: "#4361ee", fontWeight: 800, fontSize: 18, marginRight: 16 }}>
                🏗️ Builder
            </div>

            {/* Undo/Redo */}
            <button
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                style={{ background: canUndo ? "#2a2a4a" : "#111", color: canUndo ? "white" : "#444", border: "none", padding: "6px 10px", borderRadius: 6, cursor: canUndo ? "pointer" : "not-allowed", fontSize: 16 }}
            >
                ↩
            </button>

            <button
                onClick={handleRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Shift+Z)"
                style={{ background: canRedo ? "#2a2a4a" : "#111", color: canRedo ? "white" : "#444", border: "none", padding: "6px 10px", borderRadius: 6, cursor: canRedo ? "pointer" : "not-allowed", fontSize: 16 }}
            >
                ↪
            </button>

            {/* Divider */}
            <div style={{ width: 1, height: 24, background: "#2a2a4a", margin: "0 4px" }} />

            {/* Device Switcher */}
            {[
                { name: "Desktop", icon: "🖥️" },
                { name: "Tablet", icon: "📱" },
                { name: "Mobile", icon: "📱" },
            ].map((device) => (
                <button
                    key={device.name}
                    onClick={() => handleDeviceChange(device.name)}
                    title={device.name}
                    style={{
                        background: activeDevice === device.name ? "#4361ee" : "#2a2a4a",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 13,
                    }}
                >
                    {device.icon} {device.name}
                </button>
            ))}

            {/* Divider */}
            <div style={{ width: 1, height: 24, background: "#2a2a4a", margin: "0 4px" }} />

            {/* Actions */}
            <button
                onClick={handlePreview}
                style={{ background: "#2a2a4a", color: "white", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
            >
                👁️ Preview
            </button>

            <button
                onClick={handleClear}
                style={{ background: "#2a2a4a", color: "white", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
            >
                🗑️ Clear
            </button>

            <button
                onClick={onExport}
                style={{ background: "#2a2a4a", color: "white", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
            >
                📥 Export
            </button>

            {/* Right side */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>

                {/* Save Status */}
                <span style={{
                    fontSize: 12,
                    color: saveStatus === "saved" ? "#06d6a0"
                        : saveStatus === "saving" ? "#ffc107"
                            : "#ef233c",
                }}>
                    {saveStatus === "saved" ? "✅ Saved"
                        : saveStatus === "saving" ? "⏳ Saving..."
                            : "❌ Error"}
                </span>

                {/* Save Button */}
                <button
                    onClick={onSave}
                    style={{ background: "#2a9d8f", color: "white", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
                >
                    💾 Save
                </button>

                {/* Publish Button */}
                <button
                    onClick={onPublish}
                    style={{ background: "#4361ee", color: "white", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
                >
                    🚀 Publish
                </button>

                {/* Divider */}
                <div style={{ width: 1, height: 24, background: "#2a2a4a", margin: "0 4px" }} />

                {/* User */}
                <span style={{ color: "#aaa", fontSize: 13 }}>
                    👤 {user?.name}
                </span>

                {/* Logout */}
                <button
                    onClick={logout}
                    style={{ background: "#ef233c", color: "white", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
                >
                    Logout
                </button>

            </div>

        </div>
    );

};

export default Topbar;