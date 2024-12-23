import { useCallback } from "react";
import { useBeforeUnload, useBlocker } from "react-router-dom";

type PromptProps = {
  hasUnsavedChanges: boolean;
  message?: string;
};

export const Prompt = ({
  hasUnsavedChanges,
  message = "You have unsaved changes. Are you sure you want to leave?",
}: PromptProps) => {
  const block = hasUnsavedChanges;

  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasUnsavedChanges) {
          event.preventDefault();
          event.returnValue = message;
          return message;
        }
      },
      [hasUnsavedChanges, message]
    ),
    { capture: true }
  );

  useBlocker(() => {
    if (block) {
      return !window.confirm(message);
    }
    return false;
  });

  return null;
};
