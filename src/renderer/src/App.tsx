import { useAutoclicker } from "./hooks/use-autoclicker";
import { useHotkeyEditor } from "./hooks/use-hotkey-editor";
import { useTargetKeyEditor } from "./hooks/use-target-key-editor";
import { ControlPanel } from "./components/control-panel";
import { SettingsPanel } from "./components/settings-panel";

function App(): React.JSX.Element {
  const { isActive, settings, clickCount, handleStart, handleStop, handleSettingChange, progress } = useAutoclicker();

  const {
    isEditingHotkey,
    pendingHotkey,
    canSaveHotkey,
    handleHotkeyEdit,
    handleHotkeyKeyDown,
    handleHotkeySave,
    handleHotkeyCancel,
    handleHotkeyClear
  } = useHotkeyEditor(handleSettingChange);

  const {
    isEditing: isEditingTargetKey,
    pendingKey: pendingTargetKey,
    canSave: canSaveTargetKey,
    handleEdit: handleTargetKeyEdit,
    handleKeyDown: handleTargetKeyKeyDown,
    handleSave: handleTargetKeySave,
    handleCancel: handleTargetKeyCancel
  } = useTargetKeyEditor((accelerator) => handleSettingChange("targetKey", accelerator));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Draggable Header */}
      <div
        className="h-[35px] flex items-center justify-center"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <div className="text-xs text-slate-500 font-medium">SwiftClick</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-4">
        <ControlPanel
          isActive={isActive}
          clickCount={clickCount}
          settings={settings}
          progress={progress}
          onStart={handleStart}
          onStop={handleStop}
        />

        <SettingsPanel
          settings={settings}
          isActive={isActive}
          isEditingHotkey={isEditingHotkey}
          pendingHotkey={pendingHotkey}
          canSaveHotkey={canSaveHotkey}
          isEditingTargetKey={isEditingTargetKey}
          pendingTargetKey={pendingTargetKey}
          canSaveTargetKey={canSaveTargetKey}
          onSettingChange={handleSettingChange}
          onHotkeyEdit={handleHotkeyEdit}
          onHotkeyClear={handleHotkeyClear}
          onHotkeyKeyDown={handleHotkeyKeyDown}
          onHotkeySave={handleHotkeySave}
          onHotkeyCancel={handleHotkeyCancel}
          onTargetKeyEdit={handleTargetKeyEdit}
          onTargetKeyKeyDown={handleTargetKeyKeyDown}
          onTargetKeySave={handleTargetKeySave}
          onTargetKeyCancel={handleTargetKeyCancel}
        />
      </div>
    </div>
  );
}

export default App;
