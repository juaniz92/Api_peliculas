import React from "react";
import YouTube from "react-youtube";

const VerTrailer = ({ trailerId, pelicula, descripcion, onClose }) => {
  return (
    <div className="ver-trailer-container">
      <button onClick={onClose}>X</button>
      <h2>{pelicula}</h2>
      {descripcion ? (
          <p className="descripcion">{descripcion}</p>
        ) : (
          <>
            <p>Descripción no disponible</p>
          </>
        )}
      {trailerId ? (
          <YouTube videoId={trailerId} opts={{ width: "100%" }} />
        ) : (
          <>
            <p>Trailer no disponible</p>
          </>
        )}
    </div>
  );
};

export default VerTrailer;

