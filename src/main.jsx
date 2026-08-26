import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import MultiSelect from "./MultiSelect";

const options = [
  "React", "TypeScript", "JavaScript", "Node.js", "Python",
  "Java", "C++", "Go", "Rust", "Kotlin", "Swift", "HTML", "CSS",
  "Figma", "Git", "Docker"
];

function App() {
  const [value, setValue] = React.useState(["React", "JavaScript"]);

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Technical Web Development</p>
        <h1>Accessible Multi-Select</h1>
        <p className="intro">
          A custom multi-select dropdown built without a component library.
          Try using only the keyboard.
        </p>

        <MultiSelect
          label="Technologies"
          options={options}
          value={value}
          onChange={setValue}
          placeholder="Choose technologies..."
        />

        <div className="result" aria-live="polite">
          <strong>Selected:</strong>{" "}
          {value.length ? value.join(", ") : "None"}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);