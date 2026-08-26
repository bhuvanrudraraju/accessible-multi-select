
import React from "react";

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select..."
}) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [query, setQuery] = React.useState("");

  const rootRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const listboxRef = React.useRef(null);
  const optionRefs = React.useRef([]);
  const typeaheadRef = React.useRef("");
  const typeaheadTimer = React.useRef(null);

  const listboxId = React.useId();
  const labelId = `${listboxId}-label`;
  const buttonId = `${listboxId}-button`;

  const filteredOptions = React.useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(search)
    );
  }, [options, query]);

  const selectedSet = React.useMemo(
    () => new Set(value),
    [value]
  );

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );
    };
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const firstSelectedIndex = filteredOptions.findIndex(
      (option) => selectedSet.has(option)
    );

    setActiveIndex(
      firstSelectedIndex >= 0 ? firstSelectedIndex : 0
    );

    requestAnimationFrame(() => {
      listboxRef.current?.focus();
    });
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    optionRefs.current[activeIndex]?.scrollIntoView({
      block: "nearest"
    });
  }, [activeIndex, open]);

  function openDropdown() {
    setOpen(true);
  }

  function closeDropdown() {
    setOpen(false);
    setQuery("");

    requestAnimationFrame(() => {
      buttonRef.current?.focus();
    });
  }

  function toggleOption(option) {
    const next = selectedSet.has(option)
      ? value.filter((item) => item !== option)
      : [...value, option];

    onChange(next);
  }

  function moveActive(delta) {
    if (!filteredOptions.length) return;

    setActiveIndex((current) => {
      const next = current + delta;

      return Math.max(
        0,
        Math.min(filteredOptions.length - 1, next)
      );
    });
  }

  function selectAll() {
    const allSelected =
      filteredOptions.length > 0 &&
      filteredOptions.every((option) =>
        selectedSet.has(option)
      );

    if (allSelected) {
      onChange(
        value.filter(
          (item) => !filteredOptions.includes(item)
        )
      );
      return;
    }

    const next = [...value];

    filteredOptions.forEach((option) => {
      if (!next.includes(option)) {
        next.push(option);
      }
    });

    onChange(next);
  }

  function handleButtonKeyDown(event) {
    if (
      event.key === "Enter" ||
      event.key === " " ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      openDropdown();
    }
  }

  function handleListboxKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(
        Math.max(0, filteredOptions.length - 1)
      );
      return;
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "a"
    ) {
      event.preventDefault();
      selectAll();
      return;
    }

    if (
      event.key === " " ||
      event.key === "Enter"
    ) {
      event.preventDefault();

      const activeOption =
        filteredOptions[activeIndex];

      if (activeOption) {
        toggleOption(activeOption);
      }

      return;
    }

    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const character = event.key.toLowerCase();

      typeaheadRef.current += character;

      window.clearTimeout(typeaheadTimer.current);

      typeaheadTimer.current = window.setTimeout(() => {
        typeaheadRef.current = "";
      }, 700);

      const searchTerm = typeaheadRef.current;

      const start = activeIndex + 1;

      const orderedOptions = [
        ...filteredOptions.slice(start),
        ...filteredOptions.slice(0, start)
      ];

      const match = orderedOptions.find((option) =>
        option.toLowerCase().startsWith(searchTerm)
      );

      if (match) {
        setActiveIndex(
          filteredOptions.indexOf(match)
        );
      }
    }
  }

  return (
    <div
      className="multi-select"
      ref={rootRef}
    >
      <label
        id={labelId}
        className="field-label"
        htmlFor={buttonId}
      >
        {label}
      </label>

      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className={`trigger ${
          open ? "trigger-open" : ""
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          if (open) {
            closeDropdown();
          } else {
            openDropdown();
          }
        }}
        onKeyDown={handleButtonKeyDown}
      >
        <span
          className={
            value.length
              ? "trigger-value"
              : "trigger-placeholder"
          }
        >
          {value.length
            ? `${value.length} selected`
            : placeholder}
        </span>

        <span
          className="chevron"
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>

      {open && (
        <div className="panel">
          <div className="search-row">
            <label
              className="sr-only"
              htmlFor={`${listboxId}-search`}
            >
              Filter options
            </label>

            <input
              id={`${listboxId}-search`}
              className="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              placeholder="Filter options..."
              autoComplete="off"
            />

            <button
              type="button"
              className="select-all"
              onClick={selectAll}
            >
              {filteredOptions.length > 0 &&
              filteredOptions.every((option) =>
                selectedSet.has(option)
              )
                ? "Clear"
                : "All"}
            </button>
          </div>

          <div
            ref={listboxRef}
            id={listboxId}
            className="listbox"
            role="listbox"
            aria-labelledby={labelId}
            aria-multiselectable="true"
            aria-activedescendant={
              filteredOptions[activeIndex]
                ? `${listboxId}-option-${activeIndex}`
                : undefined
            }
            tabIndex={0}
            onKeyDown={handleListboxKeyDown}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map(
                (option, index) => {
                  const selected =
                    selectedSet.has(option);

                  const active =
                    index === activeIndex;

                  return (
                    <div
                      key={option}
                      id={`${listboxId}-option-${index}`}
                      ref={(element) => {
                        optionRefs.current[index] =
                          element;
                      }}
                      className={`option ${
                        active ? "active" : ""
                      } ${
                        selected ? "selected" : ""
                      }`}
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() =>
                        setActiveIndex(index)
                      }
                      onMouseDown={(event) =>
                        event.preventDefault()
                      }
                      onClick={() =>
                        toggleOption(option)
                      }
                    >
                      <span
                        className={`checkbox ${
                          selected ? "checked" : ""
                        }`}
                        aria-hidden="true"
                      >
                        {selected ? "✓" : ""}
                      </span>

                      <span>{option}</span>
                    </div>
                  );
                }
              )
            ) : (
              <div className="empty">
                No matching options
              </div>
            )}
          </div>

          <div className="hint">
            ↑ ↓ navigate · Space/Enter select ·
            Home/End jump · Ctrl/Cmd+A select all ·
            Esc close
          </div>
        </div>
      )}
    </div>
  );
}

