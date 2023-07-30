import React from "react";
import YouTube from "react-youtube";

const VerTrailer = ({ trailerId, pelicula, descripcion, onClose }) => {
  return (
    <div className="ver-trailer-container">
      <button onClick={onClose}>X</button>
      <h2>{pelicula}</h2>
      <p className="descripcion">{descripcion}</p>
      <YouTube videoId={trailerId} opts={{ width: "100%" }} />
    </div>
  );
};

export default VerTrailer;

