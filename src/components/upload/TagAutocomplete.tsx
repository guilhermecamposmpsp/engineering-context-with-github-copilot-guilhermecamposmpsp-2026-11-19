"use client";

import { useId, useState, type KeyboardEvent } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TagAutocomplete({ availableTags, label, value, onChange }: TagAutocompleteProps) {
  const inputId = useId();
  const listId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lastCommaIndex = value.lastIndexOf(",");
  const currentToken = value.slice(lastCommaIndex + 1).trim().toLowerCase();
  const selectedTags = lastCommaIndex === -1
    ? []
    : value.slice(0, lastCommaIndex).split(",").map((tag) => tag.trim().toLowerCase());
  const suggestions = currentToken
    ? availableTags.filter((tag) =>
      tag.toLowerCase().startsWith(currentToken) && !selectedTags.includes(tag.toLowerCase()),
    )
    : [];
  const showSuggestions = isOpen && suggestions.length > 0;

  function closeSuggestions() {
    setIsOpen(false);
    setActiveIndex(null);
  }

  function selectTag(tag: string) {
    const precedingTags = value.slice(0, lastCommaIndex + 1);
    onChange(lastCommaIndex === -1 ? tag : `${precedingTags} ${tag}`);
    closeSuggestions();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => current === null ? 0 : (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        current === null ? suggestions.length - 1 : (current - 1 + suggestions.length) % suggestions.length,
      );
    } else if (event.key === "Enter" && showSuggestions && activeIndex !== null) {
      event.preventDefault();
      selectTag(suggestions[activeIndex]);
    } else if (event.key === "Escape" && showSuggestions) {
      event.preventDefault();
      closeSuggestions();
    } else if (event.key === "Tab") {
      closeSuggestions();
    }
  }

  return (
    <div className="tag-autocomplete">
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-autocomplete="list"
        aria-controls={showSuggestions ? listId : undefined}
        aria-activedescendant={showSuggestions && activeIndex !== null ? `${listId}-option-${activeIndex}` : undefined}
        aria-expanded={showSuggestions}
        autoComplete="off"
        id={inputId}
        name="tags"
        onBlur={closeSuggestions}
        onChange={(event) => {
          onChange(event.target.value);
          setActiveIndex(null);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="wedding, portrait, outdoor..."
        role="combobox"
        type="text"
        value={value}
      />
      {showSuggestions ? (
        <ul className="tag-suggestions" id={listId} role="listbox">
          {suggestions.map((tag, index) => (
            <li
              aria-selected={index === activeIndex}
              id={`${listId}-option-${index}`}
              key={tag}
              onClick={() => selectTag(tag)}
              onMouseDown={(event) => event.preventDefault()}
              role="option"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}