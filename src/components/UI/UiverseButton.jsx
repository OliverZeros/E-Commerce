import React from "react";
import { Link } from "react-router-dom";
import "../../styles/uiverse-button.css";

const UiverseButton = ({
  text,
  to,
  type = "button",
  onClick,
  variant = "vibrant", // "vibrant" (OliverZeros original) or "dark"
  className = "",
  icon = null,
  disabled = false,
  style = {},
}) => {
  const content = (
    <>
      <span className="btn-bg">
        <span className="btn-bg-layers">
          <span className="btn-bg-layer btn-bg-layer-1"></span>
          <span className="btn-bg-layer btn-bg-layer-2"></span>
          <span className="btn-bg-layer btn-bg-layer-3"></span>
        </span>
      </span>
      <span className="btn-inner">
        <span className="btn-inner-static">
          <span>{text}</span>
          {icon && <i className={icon}></i>}
        </span>
        <span className="btn-inner-hover">
          <span>{text}</span>
          {icon && <i className={icon}></i>}
        </span>
      </span>
    </>
  );

  const combinedClass = `uiverse-btn uiverse-btn--${variant} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClass} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClass}
      style={style}
    >
      {content}
    </button>
  );
};

export default UiverseButton;
