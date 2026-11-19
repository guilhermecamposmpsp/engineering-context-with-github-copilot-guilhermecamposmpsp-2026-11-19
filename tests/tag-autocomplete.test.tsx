import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TagAutocomplete } from "../src/components/upload/TagAutocomplete";

const availableTags = ["portrait", "wedding", "wildlife"];

function ControlledTagAutocomplete() {
  const [value, setValue] = useState("");

  return (
    <TagAutocomplete
      availableTags={availableTags}
      label="Tags"
      onChange={setValue}
      value={value}
    />
  );
}

describe("TagAutocomplete", () => {
  it("suggests and selects a tag after a comma, ignoring case", async () => {
    const user = userEvent.setup();
    render(<ControlledTagAutocomplete />);

    const input = screen.getByRole("combobox", { name: "Tags" });
    await user.type(input, "portrait, WI");

    const wildlifeOption = screen.getByRole("option", { name: "wildlife" });
    expect(wildlifeOption).toBeVisible();
    await user.click(wildlifeOption);

    expect(input).toHaveValue("portrait, wildlife");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes the suggestion list when further typing removes all matches", async () => {
    const user = userEvent.setup();
    render(<ControlledTagAutocomplete />);

    const input = screen.getByRole("combobox", { name: "Tags" });
    await user.type(input, "w");
    expect(screen.getAllByRole("option").length).toBeGreaterThan(0);

    await user.type(input, "zzz");

    expect(input).toHaveValue("wzzz");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
