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
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(normalized)
    );
  }, [options, query]);

  const selectedSet = React.useMemo(() => new Set(value), [value]);

  React.useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const firstSelected = filteredOptions.findIndex((item) =>
      selectedSet.has(item)
    );
    setActiveIndex(firstSelected >= 0 ? firstSelected : 0);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    buttonRef.current?.focus();
  };

  const toggleOption = (option) => {
    const next = selectedSet.has(option)
      ? value.filter((item) => item !== option)
      : [...value, option];

    onChange(next);
  };

  const move = (delta) => {
    if (!filteredOptions.length) return;
    setActiveIndex((current) => {
      const next = current + delta;
      return Math.max(0, Math.min(filteredOptions.length - 1, next));
    });
  };

  const selectAll = () => {
    const allSelected = filteredOptions.every((option) => selectedSet.has(option));
    if (allSelected) {
      onChange(value.filter((item) => !filteredOptions.includes(item)));
    } else {
      const next = [...value];
      filteredOptions.forEach((option) => {
        if (!next.includes(option)) next.push(option);
      });
      onChange(next);
    }
  };

  const handleKeyDown = (event) => {
    if (!open) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "Tab") {
      setOpen(false);
      setQuery("");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(Math.max(0, filteredOptions.length - 1));
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
      event.preventDefault();
      selectAll();
      return;
    }

    if (event.key === " " && filteredOptions[activeIndex]) {
      event.preventDefault();
      toggleOption(filteredOptions[activeIndex]);
      return;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const char = event.key.toLowerCase();
      typeaheadRef.current += char;
      window.clearTimeout(typeaheadTimer.current);
      typeaheadTimer.current = window.setTimeout(() => {
        typeaheadRef.current = "";
      }, 700);

      const start = activeIndex + 1;
      const ordered = [
        ...filteredOptions.slice(start),
        ...filteredOptions.slice(0, start)
      ];
      const match = ordered.find(
        (option) => option.toLowerCase().startsWith(typeaheadRef.current)
      );
      if (match) {
        setActiveIndex(filteredOptions.indexOf(match));
      }
    }
  };

  return (
    <div className="multi-select" ref={rootRef}>
      <label id={labelId} className="field-label" htmlFor={buttonId}>
        {label}
      </label>

      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className={`trigger ${open ? "trigger-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span className={value.length ? "trigger-value" : "trigger-placeholder"}>
          {value.length ? `${value.length} selected` : placeholder}
        </span>
        <span className="chevron" aria-hidden="true">⌄</span>
      </button>

      {open && (
        <div className="panel">
          <div className="search-row">
            <label className="sr-only" htmlFor={`${listboxId}-search`}>
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
              onKeyDown={handleKeyDown}
              placeholder="Filter options..."
              autoComplete="off"
            />
            <button type="button" className="select-all" onClick={selectAll}>
              {filteredOptions.length &&
              filteredOptions.every((option) => selectedSet.has(option))
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
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (filteredOptions.length) {
                const firstSelected = filteredOptions.findIndex((item) =>
                  selectedSet.has(item)
                );
                setActiveIndex(firstSelected >= 0 ? firstSelected : 0);
              }
            }}
          >
            {filteredOptions.length ? (
              filteredOptions.map((option, index) => {
                const selected = selectedSet.has(option);
                const active = index === activeIndex;
                return (
                  <div
                    key={option}
                    id={`${listboxId}-option-${index}`}
                    ref={(element) => {
                      optionRefs.current[index] = element;
                    }}
                    className={`option ${active ? "active" : ""} ${selected ? "selected" : ""}`}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => toggleOption(option)}
                  >
                    <span className={`checkbox ${selected ? "checked" : ""}`} aria-hidden="true">
                      {selected ? "✓" : ""}
                    </span>
                    <span>{option}</span>
                  </div>
                );
              })
            ) : (
              <div className="empty">No matching options</div>
            )}
          </div>

          <div className="hint">
            ↑ ↓ navigate · Space select · Home/End jump · Ctrl/Cmd+A select all · Esc close
          </div>
        </div>
      )}
    </div>
  );
}