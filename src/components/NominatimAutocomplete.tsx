import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

interface NominatimAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string, lat?: string, lon?: string) => void;
  className?: string;
}

export const NominatimAutocomplete: React.FC<NominatimAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  className,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: string;
    lon: string;
  } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const DynamicMap = dynamic(
    () => import("./NominatimMap").then((mod) => mod.NominatimMap),
    { ssr: false }
  );

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=5`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    const data = await res.json();
    setSuggestions(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setShowSuggestions(true);
    setSelectedCoords(null); // Hide map when editing address
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = (suggestion: any) => {
    onChange(suggestion.display_name);
    onSelect(suggestion.display_name, suggestion.lat, suggestion.lon);
    setSelectedCoords({ lat: suggestion.lat, lon: suggestion.lon });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  const updateDropdownPos = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({ left: rect.left, top: rect.bottom, width: rect.width });
    }
  };

  React.useEffect(() => {
    if (showSuggestions) {
      updateDropdownPos();
      window.addEventListener("resize", updateDropdownPos);
      window.addEventListener("scroll", updateDropdownPos, true);
      return () => {
        window.removeEventListener("resize", updateDropdownPos);
        window.removeEventListener("scroll", updateDropdownPos, true);
      };
    }
  }, [showSuggestions]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        className={className}
        autoComplete="off"
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        onFocus={() => value.length > 2 && setShowSuggestions(true)}
      />
      {showSuggestions &&
        suggestions.length > 0 &&
        dropdownPos &&
        createPortal(
          <ul
            className="bg-white border border-pink-200 rounded-lg max-h-48 overflow-auto shadow-lg"
            style={{
              position: "fixed",
              left: dropdownPos.left,
              top: dropdownPos.top,
              width: dropdownPos.width,
              zIndex: 9999,
            }}
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="px-3 py-2 cursor-pointer hover:bg-rose-50 text-sm"
                onMouseDown={() => handleSelect(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>,
          document.body
        )}
      {selectedCoords && DynamicMap && (
        <div
          className="mt-4 rounded-lg overflow-hidden border border-pink-200"
          style={{ zIndex: 10, position: "relative" }}
        >
          <DynamicMap
            lat={parseFloat(selectedCoords.lat)}
            lon={parseFloat(selectedCoords.lon)}
            onMarkerMoved={(lat, lon, address) => {
              onChange(address);
              onSelect(address, lat.toString(), lon.toString());
            }}
          />
        </div>
      )}
    </div>
  );
};
