// src/components/layout/BuilderLayout.jsx

import { useEffect, useRef } from "react";
import { useEditor } from "../../context/EditorContext";
import { useAuth } from "../../context/AuthContext";
import Topbar from "../topbar/Topbar";
import LeftPanel from "../panels/LeftPanel";
import RightPanel from "../panels/RightPanel";
import grapesjs from "grapesjs";

// plugins
import basicBlocksPlugin from "../../plugins/basicBlocksPlugin";
import sectionBlocksPlugin from "../../plugins/sectionBlocksPlugin";
import customComponentsPlugin from "../../plugins/customComponentsPlugin";
import mediaBlocksPlugin from "../../plugins/mediaBlocksPlugin";
import commandsPlugin from "../../plugins/commandsPlugin";
import stylePlugin from "../../plugins/stylePlugin";
import rtePlugin from "../../plugins/rtePlugin";

const BuilderLayout = () => {

    const editorRef = useRef(null);
    const isMounted = useRef(false);
    const pageIdRef = useRef(null);

    const {
        gjsEditor,
        updatePagesList,
        updateUndoRedoState,
        setSaveStatus,
        pages,
        activePage,
        setActivePage,
        setPages,
    } = useEditor();

    const { token, logout } = useAuth();

    // ✅ Debounce utility
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    // ✅ Save to backend
    const handleSave = async () => {
        try {
            setSaveStatus("saving");
            const projectData = gjsEditor.current.getProjectData();
            const response = await fetch(`http://localhost:5000/api/pages/${pageIdRef.current}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: "Untitled Page",
                    projectData,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setSaveStatus("saved");
            };
        } catch (error) {
            setSaveStatus("error");
            console.error("Save error:", error);
        }
    };

    // ✅ Publish page
    const handlePublish = async () => {
        try {
            const html = gjsEditor.current.getHtml();
            const css = gjsEditor.current.getCss();
            const response = await fetch(`http://localhost:5000/api/publish/${pageIdRef.current}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ html, css }),
            });
            const data = await response.json();
            if (data.success) {
                const fullUrl = `http://localhost:5000${data.url}`;
                alert(`Published! URL: ${fullUrl}`);
                window.open(fullUrl, "_blank");
            };
        } catch (error) {
            console.error("Publish error:", error);
        }
    };

    // ✅ Export HTML
    const handleExport = () => {
        const html = gjsEditor.current.getHtml();
        const css = gjsEditor.current.getCss();
        const fullPage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Page</title>
    <style>${css}</style>
  </head>
  ${html}
</html>`;
        const blob = new Blob([fullPage], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "my-page.html";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    // ✅ Add page
    const handleAddPage = () => {
        const name = prompt("Enter page name:");
        if (!name) return;
        const id = name.toLowerCase().replace(/ /g, "-");
        gjsEditor.current.Pages.add({ id, name });
        updatePagesList();
    };

    // ✅ Select page
    const handleSelectPage = (pageId) => {
        gjsEditor.current.Pages.select(pageId);
        setActivePage(pageId);
    };

    // ✅ Remove page
    const handleRemovePage = (e, pageId) => {
        e.stopPropagation();
        if (pages.length === 1) {
            alert("Cannot delete last page!");
            return;
        };
        if (!window.confirm("Delete this page?")) return;
        gjsEditor.current.Pages.remove(pageId);
        updatePagesList();
    };

    // ✅ Initialize GrapesJS
    const initEditor = async () => {

        if (isMounted.current) return;
        if (!editorRef.current) return;

        // ✅ Check if GrapesJS already initialized on this container
        if (editorRef.current.classList.contains("gjs-editor-cont")) {
            console.log("STOPPED: already initialized");
            return;
        };

        isMounted.current = true;

        // Get or create page
        const savedPageId = localStorage.getItem("current-page-id");
        if (savedPageId) {
            pageIdRef.current = savedPageId;
        } else {
            const response = await fetch("http://localhost:5000/api/pages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: "Untitled Page",
                    projectData: {},
                }),
            });
            const data = await response.json();
            if (!data.success) {
                console.error("Failed to create page:", data.message);
                return;
            };
            pageIdRef.current = data.data._id;
            localStorage.setItem("current-page-id", pageIdRef.current);
        };

        // ✅ Auto-save with debounce
        const autoSave = debounce(async () => {
            if (!pageIdRef.current || !gjsEditor.current) return;
            try {
                setSaveStatus("saving");
                const projectData = gjsEditor.current.getProjectData();
                await fetch(`http://localhost:5000/api/pages/${pageIdRef.current}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: "Untitled Page", projectData }),
                });
                setSaveStatus("saved");
            } catch {
                setSaveStatus("error");
            }
        }, 2000);

        gjsEditor.current = grapesjs.init({
            container: editorRef.current,
            height: "100%",
            width: "100%",
            storageManager: false,
            fromElement: false,

            // ✅ Hide default GrapesJS panels
            panels: { defaults: [] },

            plugins: [
                commandsPlugin,
                stylePlugin,
                basicBlocksPlugin,
                sectionBlocksPlugin,
                mediaBlocksPlugin,
                customComponentsPlugin,
                rtePlugin,
            ],

            pluginsOpts: {
                [commandsPlugin]: {},
                [stylePlugin]: {},
                [basicBlocksPlugin]: {},
                [sectionBlocksPlugin]: {},
                [mediaBlocksPlugin]: {},
                [customComponentsPlugin]: {},
                [rtePlugin]: {},
            },

            deviceManager: {
                devices: [
                    { name: "Desktop", width: "" },
                    { name: "Tablet", width: "768px", widthMedia: "992px" },
                    { name: "Mobile", width: "375px", widthMedia: "480px" },
                ],
            },

            assetManager: {
                upload: true,
                uploadFile: async (e) => {
                    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
                    Array.from(files).forEach(async (file) => {
                        const url = URL.createObjectURL(file);
                        gjsEditor.current.AssetManager.add({
                            type: "image",
                            src: url,
                            name: file.name,
                        });
                    });
                },
            },

        });

        // ✅ On load
        gjsEditor.current.on("load", () => {

            // Reset CSS
            const iframeDoc = gjsEditor.current.Canvas.getDocument();
            const resetStyle = iframeDoc.createElement("style");
            resetStyle.innerHTML = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: sans-serif; min-height: 100vh; }
      `;
            iframeDoc.head.appendChild(resetStyle);

            // Default assets
            gjsEditor.current.AssetManager.add([
                { type: "image", src: "https://picsum.photos/300/200?random=1", name: "Image 1", width: 300, height: 200 },
                { type: "image", src: "https://picsum.photos/300/200?random=2", name: "Image 2", width: 300, height: 200 },
                { type: "image", src: "https://picsum.photos/300/200?random=3", name: "Image 3", width: 300, height: 200 },
            ]);

            // Set default page name
            gjsEditor.current.Pages.getSelected().set("name", "Home");

            // Update pages list
            updatePagesList();

        });

        // ✅ Auto-save on changes
        gjsEditor.current.on("component:update", autoSave);
        gjsEditor.current.on("component:add", autoSave);
        gjsEditor.current.on("component:remove", autoSave);
        gjsEditor.current.on("style:change", autoSave);

        // ✅ Undo/Redo tracking
        gjsEditor.current.on("component:add", () => setTimeout(updateUndoRedoState, 100));
        gjsEditor.current.on("component:remove", () => setTimeout(updateUndoRedoState, 100));
        gjsEditor.current.on("component:update", () => setTimeout(updateUndoRedoState, 100));
        gjsEditor.current.on("undo", updateUndoRedoState);
        gjsEditor.current.on("redo", updateUndoRedoState);
        
        window.gjsEditor = gjsEditor.current;

    };

    // ✅ Run initEditor on mount
    useEffect(() => {
        initEditor();
    }, []);

    // ✅ Add separate cleanup only on window unload
    useEffect(() => {
        const handleUnload = () => {
            if (gjsEditor.current) {
                gjsEditor.current.destroy();
                gjsEditor.current = null;
            }
        };

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };

    }, []);

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: "#0a0a0f", overflow: "hidden" }}>

            {/* Topbar */}
            <Topbar
                onSave={handleSave}
                onPublish={handlePublish}
                onExport={handleExport}
            />

            {/* Main Area */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {/* Left Panel */}
                <LeftPanel />

                {/* Canvas */}
                <div
                    ref={editorRef}
                    style={{ flex: 1, height: "100%", overflow: "hidden" }}
                />

                {/* Right Panel */}
                <RightPanel />

            </div>

            {/* Page Manager Bar */}
            <div style={{ height: "36px", background: "#1a1a2e", borderTop: "1px solid #2a2a4a", display: "flex", alignItems: "center", padding: "0 12px", gap: 6, flexShrink: 0 }}>

                <span style={{ color: "#555", fontSize: 11 }}>PAGES:</span>

                {pages.map((page) => (
                    <div
                        key={page.id}
                        onClick={() => handleSelectPage(page.id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            background: activePage === page.id ? "#4361ee" : "#2a2a4a",
                            color: "white",
                            padding: "3px 10px",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 11,
                        }}
                    >
                        <span>{page.name}</span>
                        <span
                            onClick={(e) => handleRemovePage(e, page.id)}
                            style={{ color: "#aaa", fontSize: 10, marginLeft: 2 }}
                        >
                            ✕
                        </span>
                    </div>
                ))}

                <button
                    onClick={handleAddPage}
                    style={{ background: "#2a2a4a", color: "white", border: "none", padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontSize: 11 }}
                >
                    + Add Page
                </button>

            </div>

        </div>
    );

};

export default BuilderLayout;