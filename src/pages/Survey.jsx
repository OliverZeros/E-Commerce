import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Survey() {
  const [type, setType] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [style, setStyle] = useState([]);
  const navigate = useNavigate();

  const handleCheckboxChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const surveyData = { type, color, size, style };
    console.log(surveyData);
    toast.success("Survey submitted! Shop Now!");
    navigate("/shop");
  };

  return (
    <div>
      <h2>Let us know about your needs</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type of Interior:</label>
          <div>
            <label>
              <input
                type="checkbox"
                value="Living Room"
                onChange={() => handleCheckboxChange(setType, "Living Room")}
              />
              Living Room
            </label>
            <label>
              <input
                type="checkbox"
                value="Bedroom"
                onChange={() => handleCheckboxChange(setType, "Bedroom")}
              />
              Bedroom
            </label>
            <label>
              <input
                type="checkbox"
                value="Kitchen"
                onChange={() => handleCheckboxChange(setType, "Kitchen")}
              />
              Kitchen
            </label>
          </div>
        </div>
        <div>
          <label>Preferred Color:</label>
          <div>
            <label>
              <input
                type="checkbox"
                value="Red"
                onChange={() => handleCheckboxChange(setColor, "Red")}
              />
              Red
            </label>
            <label>
              <input
                type="checkbox"
                value="Blue"
                onChange={() => handleCheckboxChange(setColor, "Blue")}
              />
              Blue
            </label>
            <label>
              <input
                type="checkbox"
                value="Green"
                onChange={() => handleCheckboxChange(setColor, "Green")}
              />
              Green
            </label>
          </div>
        </div>
        <div>
          <label>Preferred Size:</label>
          <div>
            <label>
              <input
                type="checkbox"
                value="Small"
                onChange={() => handleCheckboxChange(setSize, "Small")}
              />
              Small
            </label>
            <label>
              <input
                type="checkbox"
                value="Medium"
                onChange={() => handleCheckboxChange(setSize, "Medium")}
              />
              Medium
            </label>
            <label>
              <input
                type="checkbox"
                value="Large"
                onChange={() => handleCheckboxChange(setSize, "Large")}
              />
              Large
            </label>
          </div>
        </div>
        <div>
          <label>Preferred Style:</label>
          <div>
            <label>
              <input
                type="checkbox"
                value="Modern"
                onChange={() => handleCheckboxChange(setStyle, "Modern")}
              />
              Modern
            </label>
            <label>
              <input
                type="checkbox"
                value="Classic"
                onChange={() => handleCheckboxChange(setStyle, "Classic")}
              />
              Classic
            </label>
            <label>
              <input
                type="checkbox"
                value="Rustic"
                onChange={() => handleCheckboxChange(setStyle, "Rustic")}
              />
              Rustic
            </label>
          </div>
        </div>
        <button type="submit">Submit Survey</button>
      </form>
    </div>
  );
}

export default Survey;
