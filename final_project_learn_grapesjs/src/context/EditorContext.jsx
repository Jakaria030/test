// src/context/EditorContext.jsx

import { createContext, useContext, useRef, useState } from "react";

const EditorContext = createContext(null);

const EditorProvider = ({ children }) => {

    // ✅ Share editor instance across all components
    const gjsEditor = useRef(null);

    // ✅ Share active states
    const [activeDevice, setActiveDevice] = useState("Desktop");
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [saveStatus, setSaveStatus] = useState("saved");
    const [pages, setPages] = useState([]);
    const [activePage, setActivePage] = useState(null);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [leftPanelTab, setLeftPanelTab] = useState("blocks"); // blocks | layers
    const [rightPanelTab, setRightPanelTab] = useState("styles"); // styles | traits

    // ✅ Update pages list
    const updatePagesList = () => {
        if (!gjsEditor.current) return;
        const allPages = gjsEditor.current.Pages.getAll().map((p) => ({
            id: p.getId(),
            name: p.getName() || "Untitled",
        }));
        setPages(allPages);
        setActivePage(gjsEditor.current.Pages.getSelected().getId());
    };

    // ✅ Update undo/redo state
    const updateUndoRedoState = () => {
        if (!gjsEditor.current) return;
        setCanUndo(gjsEditor.current.UndoManager.hasUndo());
        setCanRedo(gjsEditor.current.UndoManager.hasRedo());
    };

    return (
        <EditorContext.Provider value={{
            gjsEditor,
            activeDevice, setActiveDevice,
            canUndo, setCanUndo,
            canRedo, setCanRedo,
            saveStatus, setSaveStatus,
            pages, setPages,
            activePage, setActivePage,
            selectedComponent, setSelectedComponent,
            leftPanelTab, setLeftPanelTab,
            rightPanelTab, setRightPanelTab,
            updatePagesList,
            updateUndoRedoState,
        }}>
            {children}
        </EditorContext.Provider>
    );

};

// ✅ Custom hook
const useEditor = () => useContext(EditorContext);

export { EditorProvider, useEditor };