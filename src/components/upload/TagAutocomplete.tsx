"use client";

import { useId, useState } from "react";

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

  function selectTag(tag: string) {
    const precedingTags = value.slice(0, lastCommaIndex + 1);
    onChange(lastCommaIndex === -1 ? tag : `${precedingTags} ${tag}`);
    setIsOpen(false);
  }

  return (
    <div className="tag-autocomplete">
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-autocomplete="list"
        aria-controls={showSuggestions ? listId : undefined}
        aria-expanded={showSuggestions}
        autoComplete="off"
        id={inputId}
        name="tags"
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        placeholder="wedding, portrait, outdoor..."
        role="combobox"
        type="text"
        value={value}
      />
      {showSuggestions ? (
        <ul className="tag-suggestions" id={listId} role="listbox">
          {suggestions.map((tag) => (
            <li
              aria-selected="false"
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