// src/components/blocks/LayersPanel.jsx

import { useState, useEffect } from "react";
import { useEditor } from "../../context/EditorContext";

const LayerItem = ({ component, depth = 0 }) => {

    const { gjsEditor } = useEditor();
    const [isOpen, setIsOpen] = useState(true);
    const [isSelected, setIsSelected] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const name = component.getName() || component.get("tagName") || "Component";
    const children = component.components();
    const hasChildren = children && children.length > 0;

    // ✅ Listen for selection changes
    useEffect(() => {
        const onSelect = () => {
            setIsSelected(gjsEditor.current.getSelected() === component);
        };

        gjsEditor.current.on("component:selected", onSelect);
        gjsEditor.current.on("component:deselected", onSelect);

        return () => {
            gjsEditor.current.off("component:selected", onSelect);
            gjsEditor.current.off("component:deselected", onSelect);
        };
    }, []);

    // ✅ Select component on click
    const handleSelect = (e) => {
        e.stopPropagation();
        gjsEditor.current.select(component);
    };

    // ✅ Toggle visibility
    const handleToggleVisibility = (e) => {
        e.stopPropagation();
        const isHidden = component.get("visibility") === "hidden";
        component.set("visibility", isHidden ? "visible" : "hidden");
    };

    // ✅ Delete component
    const handleDelete = (e) => {
        e.stopPropagation();
        component.remove();
    };

    return (
        <div>
            <div
                onClick={handleSelect}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 8px",
                    paddingLeft: `${8 + depth * 16}px`,
                    background: isSelected ? "#4361ee22" : isHovered ? "#2a2a4a" : "transparent",
                    borderLeft: isSelected ? "2px solid #4361ee" : "2px solid transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    color: isSelected ? "#4361ee" : "#ccc",
                }}
            >

                {/* Toggle children */}
                <span
                    onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                    style={{ color: "#444", fontSize: 10, width: 12 }}
                >
                    {hasChildren ? (isOpen ? "▾" : "▸") : ""}
                </span>

                {/* Component name */}
                <span style={{ flex: 1 }}>{name}</span>

                {/* Actions */}
                {isHovered && (
                    <div style={{ display: "flex", gap: 4 }}>
                        <span
                            onClick={handleToggleVisibility}
                            title="Toggle visibility"
                            style={{ cursor: "pointer", fontSize: 11 }}
                        >
                            👁️
                        </span>
                        <span
                            onClick={handleDelete}
                            title="Delete"
                            style={{ cursor: "pointer", fontSize: 11, color: "#ef233c" }}
                        >
                            🗑️
                        </span>
                    </div>
                )}

            </div>

            {/* Children */}
            {hasChildren && isOpen && (
                <div>
                    {children.models.map((child) => (
                        <LayerItem
                            key={child.cid}
                            component={child}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}

        </div>
    );

};

const LayersPanel = () => {

    const { gjsEditor } = useEditor();
    const [wrapper, setWrapper] = useState(null);
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        if (!gjsEditor.current) return;

        gjsEditor.current.on("load", () => {
            setWrapper(gjsEditor.current.getWrapper());
        });

        // ✅ Re-render on component changes
        gjsEditor.current.on("component:add", () => forceUpdate((n) => n + 1));
        gjsEditor.current.on("component:remove", () => forceUpdate((n) => n + 1));

    }, []);

    return (
        <div style={{ height: "100%", overflowY: "auto" }}>

            <div style={{ padding: "12px", borderBottom: "1px solid #2a2a4a" }}>
                <span style={{ color: "#aaa", fontSize: 12, fontWeight: 600 }}>LAYERS</span>
            </div>

            {wrapper ? (
                <div>
                    {wrapper.components().models.map((component) => (
                        <LayerItem
                            key={component.cid}
                            component={component}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: "center", color: "#444", padding: "40px 0", fontSize: 13 }}>
                    No components yet
                </div>
            )}

        </div>
    );

};

export default LayersPanel;