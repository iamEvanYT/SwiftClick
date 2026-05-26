import { useState } from "react";
import { captureKeyAccelerator } from "../utils/capture-key-accelerator";

export const useTargetKeyEditor = (onSave: (accelerator: string) => Promise<void>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingKey, setPendingKey] = useState<string[]>([]);
  const [canSave, setCanSave] = useState(false);

  const handleEdit = (): void => {
    setIsEditing(true);
    setPendingKey([]);
    setCanSave(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    e.preventDefault();

    const { segments, hasMainKey } = captureKeyAccelerator(e);
    setPendingKey(segments);
    setCanSave(hasMainKey);
  };

  const handleSave = async (): Promise<void> => {
    if (!canSave || pendingKey.length < 1) {
      return;
    }

    const accelerator = pendingKey
      .map((key) => {
        if (key === "Command") return "CommandOrControl";
        return key;
      })
      .join("+");

    await onSave(accelerator);
    setIsEditing(false);
    setPendingKey([]);
    setCanSave(false);
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    setPendingKey([]);
    setCanSave(false);
  };

  return {
    isEditing,
    pendingKey,
    canSave,
    handleEdit,
    handleKeyDown,
    handleSave,
    handleCancel
  };
};
