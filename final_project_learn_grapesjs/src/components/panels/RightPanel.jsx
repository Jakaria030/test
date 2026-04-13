// src/components/panels/RightPanel.jsx

import { useState, useEffect } from "react";
import { useEditor } from "../../context/EditorContext";

const RightPanel = () => {

    const { gjsEditor, rightPanelTab, setRightPanelTab } = useEditor();
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [traits, setTraits] = useState([]);
    const [sectors, setSectors] = useState([]);

    // ✅ Listen for component selection
    useEffect(() => {
        if (!gjsEditor.current) return;

        gjsEditor.current.on("component:selected", (component) => {
            setSelectedComponent(component);

            // Load traits
            const componentTraits = component.getTraits().map((t) => ({
                id: t.id,
                label: t.get("label"),
                type: t.get("type"),
                value: t.get("value"),
                options: t.get("options"),
            }));
            setTraits(componentTraits);

            // Load style sectors
            const allSectors = gjsEditor.current.StyleManager.getSectors().models.map((s) => ({
                id: s.id,
                name: s.get("name"),
                open: s.get("open"),
                properties: s.getProperties().map((p) => ({
                    id: p.id,
                    label: p.get("label"),
                    type: p.get("type"),
                    value: p.getFullValue(),
                    options: p.get("options"),
                })),
            }));
            setSectors(allSectors);

        });

        gjsEditor.current.on("component:deselected", () => {
            setSelectedComponent(null);
            setTraits([]);
            setSectors([]);
        });

    }, []);

    // ✅ Handle trait change
    const handleTraitChange = (traitId, value) => {
        if (!selectedComponent) return;
        const trait = selectedComponent.getTrait(traitId);
        if (trait) trait.setValue(value);
    };

    // ✅ Handle style change
    const handleStyleChange = (property, value) => {
        if (!selectedComponent) return;
        selectedComponent.addStyle({ [property]: value });
    };

    return (
        <div style={{
            width: "280px",
            height: "100%",
            background: "#12121e",
            borderLeft: "1px solid #2a2a4a",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
        }}>

            {/* Tab Buttons */}
            <div style={{ display: "flex", borderBottom: "1px solid #2a2a4a", flexShrink: 0 }}>
                {[
                    { id: "styles", label: "🎨 Styles" },
                    { id: "traits", label: "⚙️ Settings" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setRightPanelTab(tab.id)}
                        style={{
                            flex: 1,
                            padding: "12px 8px",
                            background: rightPanelTab === tab.id ? "#1e1e3a" : "transparent",
                            color: rightPanelTab === tab.id ? "#4361ee" : "#666",
                            border: "none",
                            borderBottom: rightPanelTab === tab.id ? "2px solid #4361ee" : "2px solid transparent",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* No selection state */}
            {!selectedComponent && (
                <div style={{ textAlign: "center", color: "#444", padding: "40px 16px", fontSize: 13 }}>
                    Select a component to edit its styles and settings
                </div>
            )}

            {/* Styles Tab */}
            {selectedComponent && rightPanelTab === "styles" && (
                <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
                    {sectors.map((sector) => (
                        <div key={sector.id} style={{ marginBottom: 16 }}>

                            {/* Sector Header */}
                            <div style={{ color: "#aaa", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, padding: "4px 0", borderBottom: "1px solid #2a2a4a" }}>
                                {sector.name}
                            </div>

                            {/* Properties */}
                            {sector.properties.map((prop) => (
                                <div key={prop.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>

                                    <label style={{ color: "#888", fontSize: 11, width: 90, flexShrink: 0 }}>
                                        {prop.label}
                                    </label>

                                    {/* Color input */}
                                    {prop.type === "color" && (
                                        <input
                                            type="color"
                                            defaultValue={prop.value || "#000000"}
                                            onChange={(e) => handleStyleChange(prop.id, e.target.value)}
                                            style={{ width: 40, height: 28, border: "none", borderRadius: 4, cursor: "pointer", background: "none" }}
                                        />
                                    )}

                                    {/* Select input */}
                                    {prop.type === "select" && (
                                        <select
                                            defaultValue={prop.value}
                                            onChange={(e) => handleStyleChange(prop.id, e.target.value)}
                                            style={{ flex: 1, padding: "4px 8px", borderRadius: 6, border: "1px solid #2a2a4a", background: "#0a0a0f", color: "white", fontSize: 12 }}
                                        >
                                            {prop.options?.map((opt) => (
                                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                                            ))}
                                        </select>
                                    )}

                                    {/* Slider input */}
                                    {prop.type === "slider" && (
                                        <input
                                            type="range"
                                            defaultValue={prop.value}
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            onChange={(e) => handleStyleChange(prop.id, e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                    )}

                                    {/* Text input (default) */}
                                    {!["color", "select", "slider"].includes(prop.type) && (
                                        <input
                                            type="text"
                                            defaultValue={prop.value}
                                            onBlur={(e) => handleStyleChange(prop.id, e.target.value)}
                                            style={{ flex: 1, padding: "4px 8px", borderRadius: 6, border: "1px solid #2a2a4a", background: "#0a0a0f", color: "white", fontSize: 12 }}
                                        />
                                    )}

                                </div>
                            ))}

                        </div>
                    ))}
                </div>
            )}

            {/* Traits Tab */}
            {selectedComponent && rightPanelTab === "traits" && (
                <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>

                    {traits.length === 0 && (
                        <div style={{ textAlign: "center", color: "#444", padding: "20px 0", fontSize: 13 }}>
                            No settings available
                        </div>
                    )}

                    {traits.map((trait) => (
                        <div key={trait.id} style={{ marginBottom: 12 }}>

                            <label style={{ color: "#888", fontSize: 11, display: "block", marginBottom: 4 }}>
                                {trait.label}
                            </label>

                            {/* Text trait */}
                            {trait.type === "text" && (
                                <input
                                    type="text"
                                    defaultValue={trait.value}
                                    onBlur={(e) => handleTraitChange(trait.id, e.target.value)}
                                    style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #2a2a4a", background: "#0a0a0f", color: "white", fontSize: 12, boxSizing: "border-box" }}
                                />
                            )}

                            {/* Select trait */}
                            {trait.type === "select" && (
                                <select
                                    defaultValue={trait.value}
                                    onChange={(e) => handleTraitChange(trait.id, e.target.value)}
                                    style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #2a2a4a", background: "#0a0a0f", color: "white", fontSize: 12 }}
                                >
                                    {trait.options?.map((opt) => (
                                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                                    ))}
                                </select>
                            )}

                            {/* Checkbox trait */}
                            {trait.type === "checkbox" && (
                                <input
                                    type="checkbox"
                                    defaultChecked={trait.value}
                                    onChange={(e) => handleTraitChange(trait.id, e.target.checked)}
                                    style={{ cursor: "pointer" }}
                                />
                            )}

                            {/* Number trait */}
                            {trait.type === "number" && (
                                <input
                                    type="number"
                                    defaultValue={trait.value}
                                    onBlur={(e) => handleTraitChange(trait.id, e.target.value)}
                                    style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #2a2a4a", background: "#0a0a0f", color: "white", fontSize: 12, boxSizing: "border-box" }}
                                />
                            )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    );

};

export default RightPanel;