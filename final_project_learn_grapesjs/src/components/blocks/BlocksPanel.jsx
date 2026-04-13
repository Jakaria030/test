// src/components/blocks/BlocksPanel.jsx

import { useState, useEffect } from "react";
import { useEditor } from "../../context/EditorContext";

const BlocksPanel = () => {

    const { gjsEditor } = useEditor();
    const [blocks, setBlocks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");

    // ✅ Load blocks from GrapesJS
    useEffect(() => {
        if (!gjsEditor.current) return;

        const loadBlocks = () => {
            const allBlocks = gjsEditor.current.BlockManager.getAll().models.map((b) => {

                // ✅ Handle category being object or string
                const cat = b.get("category");
                const categoryLabel = typeof cat === "object"
                    ? cat?.get("label") || cat?.label || "Other"
                    : cat || "Other";

                return {
                    id: b.id,
                    label: b.get("label"),
                    category: categoryLabel,
                    media: b.get("media"),
                    content: b.get("content"),
                };
            });

            setBlocks(allBlocks);

            // Get unique categories
            const cats = ["All", ...new Set(allBlocks.map((b) => b.category))];
            setCategories(cats);
        };

        // ✅ If editor already loaded — load blocks immediately
        if (gjsEditor.current.getWrapper()) {
            loadBlocks();
        } else {
            // ✅ Otherwise wait for load event
            gjsEditor.current.on("load", loadBlocks);
        };

    }, []);

    // ✅ Filter blocks by category and search
    const filteredBlocks = blocks.filter((block) => {
        const matchCategory = activeCategory === "All" || block.category === activeCategory;
        const matchSearch = block.label.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    // ✅ Handle block drag to canvas
    const handleBlockDrag = (blockId) => {
        gjsEditor.current.BlockManager.get(blockId)?.trigger("drag:start");
    };

    // ✅ Handle block click — add to canvas
    const handleBlockClick = (blockId) => {
        const block = gjsEditor.current.BlockManager.get(blockId);
        if (!block) return;
        const content = block.get("content");
        gjsEditor.current.getWrapper().append(content);
    };

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Search */}
            <div style={{ padding: "12px" }}>
                <input
                    type="text"
                    placeholder="Search blocks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #2a2a4a",
                        background: "#0a0a0f",
                        color: "white",
                        fontSize: 13,
                        boxSizing: "border-box",
                    }}
                />
            </div>

            {/* Categories */}
            <div style={{ display: "flex", gap: 6, padding: "0 12px 12px", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            background: activeCategory === cat ? "#4361ee" : "#2a2a4a",
                            color: "white",
                            border: "none",
                            padding: "4px 10px",
                            borderRadius: 20,
                            cursor: "pointer",
                            fontSize: 11,
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Blocks Grid */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {filteredBlocks.map((block) => (
                        <div
                            key={block.id}
                            onClick={() => handleBlockClick(block.id)}
                            draggable
                            title={block.label}
                            style={{
                                background: "#12121e",
                                border: "1px solid #2a2a4a",
                                borderRadius: 8,
                                padding: "12px 8px",
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "border-color 0.2s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#4361ee"}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#2a2a4a"}
                        >
                            {/* Block Icon */}
                            <div
                                style={{ fontSize: 24, marginBottom: 6, color: "#aaa" }}
                                dangerouslySetInnerHTML={{ __html: block.media || "📦" }}
                            />
                            {/* Block Label */}
                            <div style={{ color: "#ccc", fontSize: 11 }}>
                                {block.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredBlocks.length === 0 && (
                    <div style={{ textAlign: "center", color: "#444", padding: "40px 0", fontSize: 13 }}>
                        No blocks found
                    </div>
                )}

            </div>

        </div>
    );

};

export default BlocksPanel;