import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const Editor = () => {
  const [fonts, setFonts] = useState({});
  const [fontFamily, setFontFamily] = useState("");
  const [fontWeight, setFontWeight] = useState("");
  const [italic, setItalic] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await axios.get("/fonts_punt.json"); 
        setFonts(response.data);
        const savedFontFamily = localStorage.getItem("fontFamily");
        const savedFontWeight = localStorage.getItem("fontWeight");
        const savedItalic = JSON.parse(localStorage.getItem("italic"));
        const savedText = localStorage.getItem("text");
        if (savedFontFamily) setFontFamily(savedFontFamily);
        if (savedFontWeight) setFontWeight(savedFontWeight);
        if (savedItalic !== null) setItalic(savedItalic);
        if (savedText) setText(savedText);
      } catch (error) {
        console.error("Error fetching fonts:", error);
      }
    };
    fetchFonts();
  }, []);

  useEffect(() => {
    if (fontFamily && fonts[fontFamily]) {
      const fontUrl = fonts[fontFamily][fontWeight] || fonts[fontFamily]["400"];
      if (fontUrl) {
        const link = document.createElement("link");
        link.href = fontUrl;
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => {
          document.head.removeChild(link);
        };
      } else {
        console.warn("URL not found:", fontUrl);
      }
    }
  }, [fontFamily, fontWeight, fonts]);

  const handleFontFamilyChange = (e) => {
    setFontFamily(e.target.value);
    setFontWeight("");
    setItalic(false);
  };

  const handleFontWeightChange = (e) => {
    setFontWeight(e.target.value);
  };

  const handleItalicToggle = (e) => {
    setItalic(e.target.checked);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    localStorage.setItem("fontFamily", fontFamily);
    localStorage.setItem("fontWeight", fontWeight);
    localStorage.setItem("italic", JSON.stringify(italic));
    localStorage.setItem("text", text);
    alert("saved!");
  };

  const handleReset = () => {
    setFontFamily("");
    setFontWeight("");
    setItalic(false);
    setText("");
    localStorage.removeItem("fontFamily");
    localStorage.removeItem("fontWeight");
    localStorage.removeItem("italic");
    localStorage.removeItem("text");
    alert("reset");
  };

  const getFontWeights = () => {
    if (!fontFamily) return [];
    return Object.keys(fonts[fontFamily] || {}).map((weight) => ({
      value: weight,
      label: weight.includes("italic") ? weight : weight + " Regular",
    }));
  };

  return (
    <div className="editor-container">
      <div className="controls">
        <select value={fontFamily} onChange={handleFontFamilyChange}>
          <option value="">Select Font Family</option>
          {Object.keys(fonts).map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
        <select
          value={fontWeight}
          onChange={handleFontWeightChange}
          disabled={!fontFamily}
        >
          <option value="">Select Font Weight</option>
          {getFontWeights().map((weight) => (
            <option key={weight.value} value={weight.value}>
              {weight.label}
            </option>
          ))}
        </select>
        <label>
          Italic:
          <input
            type="checkbox"
            checked={italic}
            onChange={handleItalicToggle}
            disabled={!fontFamily}
          />
        </label>
      </div>
      <textarea
        style={{
          fontFamily: fontFamily || "Arial",
          fontWeight: fontWeight ? fontWeight.replace(/\D/g, "") : "normal", 
          fontStyle: italic ? "italic" : "normal",
        }}
        value={text}
        onChange={handleTextChange}
        placeholder="Type Here"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default Editor;
