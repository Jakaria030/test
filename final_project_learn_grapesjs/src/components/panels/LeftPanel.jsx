// src/components/panels/LeftPanel.jsx

import { useEditor } from "../../context/EditorContext";
import BlocksPanel from "../blocks/BlocksPanel";
import LayersPanel from "../blocks/LayersPanel";

const LeftPanel = () => {

    const { leftPanelTab, setLeftPanelTab } = useEditor();

    return (
        <div style={{
            width: "260px",
            height: "100%",
            background: "#12121e",
            borderRight: "1px solid #2a2a4a",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
        }}>

            {/* Tab Buttons */}
            <div style={{ display: "flex", borderBottom: "1px solid #2a2a4a", flexShrink: 0 }}>

                {[
                    { id: "blocks", label: "🧩 Blocks" },
                    { id: "layers", label: "📋 Layers" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setLeftPanelTab(tab.id)}
                        style={{
                            flex: 1,
                            padding: "12px 8px",
                            background: leftPanelTab === tab.id ? "#1e1e3a" : "transparent",
                            color: leftPanelTab === tab.id ? "#4361ee" : "#666",
                            border: "none",
                            borderBottom: leftPanelTab === tab.id ? "2px solid #4361ee" : "2px solid transparent",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        {tab.label}
                    </button>
                ))}

            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflow: "hidden" }}>
                {leftPanelTab === "blocks" && <BlocksPanel />}
                {leftPanelTab === "layers" && <LayersPanel />}
            </div>

        </div>
    );

};

export default LeftPanel;