import axios from "axios";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import VerTrailer from "./VerTrailer";

export const Peliculas = () => {
  const [datos, setDatos] = useState([]); //Almacena las peliculas de la Api
  const [datosG, setDatosG] = useState([]); //Almacena los géneros de la Api
  const [pagina, setPagina] = useState(1); //Para seleccionar la página de la Api
  const [generoSeleccionado, setGeneroSeleccionado] = useState(null); //Para selecccionar el género
  const [mostrarPaginacion, setMostrarPaginacion] = useState(true); //Para mostrar los botones de paginado
  const [mostrarGeneros, setMostrarGeneros] = useState(false); //Para mostrar géneros en responsive
  const [peliculaSeleccionada, setPeliculaSeleccionada] = useState(null);//Id pelicula seleccionada
  const [trailerId, setTrailerId] = useState("");//Obtener Id del trailer
  const [verTrailerOpen, setVerTrailerOpen] = useState(false);// Cerrar el componente VerTrailer
  const [busqueda, setBusqueda] = useState("");//Almacenar el valor del inpur para la búsqueda por nombre

  //Para cargar las péliculas del género seleccionado sino selecciona la página para ver todas
  let cargar = pagina;
  if(generoSeleccionado){
    cargar = generoSeleccionado;
  }else{
    cargar = pagina;
  }

  //Traer películas
  useEffect(() => {
    cargarPeliculas();
  }, [cargar]);

  //Traer géneros
  useEffect(() => {
    cargarGeneros();
  }, []);

  //Ir a una página previa
  const btnAnterior = (e) => {
    setVerTrailerOpen(false)
    if (pagina > 1) {
      setPagina(pagina - 1);
      cargarPeliculas();
      window.scrollTo(0, 0);
    }
  };

  //Ir a próxima página
  const btnSiguiente = (e) => {
    setVerTrailerOpen(false)
    if (pagina < 500) {
      setPagina(pagina + 1);
      cargarPeliculas();
      window.scrollTo(0, 0);
    }
  };

  //Géneros del menú
  const btnGenero = (generoId) => {
    setVerTrailerOpen(false)
    setGeneroSeleccionado(generoId);
    if(generoId == null){
      setMostrarPaginacion(true);
      setPagina(1);
    }else{
      setMostrarPaginacion(false);
    }
    setMostrarGeneros(!mostrarGeneros);
  };

  //Ocultar menú de géneros una vez seleccionado en responsive
  const flagMostrarGeneros = () => {
    setVerTrailerOpen(false)
    setMostrarGeneros(!mostrarGeneros);
  };

  //Ocultar descripción de película una vez seleccionado en responsive
  const abrirTrailer = async (pelicula) => {
    if (peliculaSeleccionada && peliculaSeleccionada.id === pelicula.id) {
      setPeliculaSeleccionada(null);
    } else {
      setPeliculaSeleccionada(pelicula);

      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${pelicula.id}?api_key=ee2648f9f1e9bd8b7424b1f5bb21b561&language=es-US&append_to_response=videos`
        );

        // Obtenemos el ID del primer trailer si hay uno disponible
        const trailerId = response.data.videos?.results?.length > 0
          ? response.data.videos.results[0].key
          : "";

        setTrailerId(trailerId);
        setVerTrailerOpen(true); // Siempre abrir el componente VerTrailer al hacer clic en una película
      } catch (error) {
        console.error("Error al obtener los detalles de la película:", error);
        setTrailerId(""); // Si hay un error, asegurarse de establecer trailerId a una cadena vacía
        setVerTrailerOpen(true); // Abrir el componente VerTrailer incluso si no hay trailer disponible
      }
    }
  };
  

  // Con Axios
  async function cargarPeliculas() {
    if(generoSeleccionado){
      {/*Traer películas del género seleccionado*/}
      let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=ee2648f9f1e9bd8b7424b1f5bb21b561&language=es-US`;
        if (generoSeleccionado) {
          url += `&with_genres=${generoSeleccionado}`;
        }
      const respuesta = await axios.get(url);
      setDatos(respuesta.data.results);
      console.log(respuesta);
    }else{
      {/*Traer todas las películas*/}
      const respuesta = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=ee2648f9f1e9bd8b7424b1f5bb21b561&language=es-US&page=${pagina}`
      );
      setDatos(respuesta.data.results);
      console.log(respuesta);
    }
  }

  async function cargarGeneros() {
    {/*Traer género seleccionado de la Api*/}
    if(generoSeleccionado){
      let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=ee2648f9f1e9bd8b7424b1f5bb21b561&language=es-US&with_genres=${generoSeleccionado}`;
      const respuestaG = await axios.get(url);
      setDatos(respuestaG.data.results);
      console.log(respuestaG);
    }else{
      const respuestaG = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=ee2648f9f1e9bd8b7424b1f5bb21b561&language=es`
      );
      setDatosG(respuestaG.data.genres);
      console.log(respuestaG);
    }
  }

  // Función para realizar la búsqueda de películas
  const buscarPeliculas = async () => {
    try {
      let url = `https://api.themoviedb.org/3/search/movie?api_key=ee2648f9f1e9bd8b7424b1f5bb21b561&language=es-US&query=${encodeURIComponent(
        busqueda
      )}`;

      const respuesta = await axios.get(url);
      setDatos(respuesta.data.results);
      setBusqueda("");
    } catch (error) {
      console.error("Error al buscar películas:", error);
    }
  };
  

  return (
    <div>
      <nav>
        <div className="cabecera">
          <h1><a href="/">Pelis-Trailers</a></h1>
          <div className="buscador">
            <input type="text"
              placeholder="Buscar película por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buscarPeliculas();
                }
              }}
            />
            <button onClick={buscarPeliculas}>Buscar</button>
          </div>
        </div>
        {/*Menú de géneros de películas*/}
        <div className={`lista-clase ${mostrarGeneros ? "active" : "hidden"}`}>
          <button onClick={() => btnGenero()}>Todos</button>
          {datosG.map((item) => (
            <button key={item.id} onClick={() => btnGenero(item.id)}>
              {item.name}
            </button>
          ))}
        </div>
      </nav>
      
      
      <div className="contenedor" id="contenedor">
        {/*Botón de lista de géneros responsive*/}
        <button className={`btnMostrarGeneros ${!mostrarGeneros ? "active" : "hidden"}`} onClick={flagMostrarGeneros}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/*Lista de péliculas*/}
        {datos.map((item) => {
          // Filtra géneros de películas
          if (generoSeleccionado && !item.genre_ids.includes(generoSeleccionado)) {
            return null;
          }
          
          return (
            <div key={item.id} className="pelicula">
              <img
                className="poster"
                src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                alt={item.title}
                onClick={() => abrirTrailer(item)}
              ></img>
              <h3 className="titulo" onClick={() => abrirTrailer(item)}>{item.title}</h3>
            </div>
          );
        })}
      </div>
        {/*Botones de cambiar páginas*/}
      {mostrarPaginacion && (
        <div className="paginacion" id="paginacion">
          <button onClick={btnAnterior}>{"<"} Anterior</button>
          <p>{pagina}</p>
          <button onClick={btnSiguiente}>Siguiente {">"}</button>
        </div>
      )}
      {/* Renderiza el componente VerTrailer si verTrailerOpen es true */}
      {verTrailerOpen && (
        <VerTrailer
          trailerId={trailerId}
          pelicula={peliculaSeleccionada.title}
          descripcion={peliculaSeleccionada.overview}
          onClose={() => setVerTrailerOpen(false)}
        />
      )}
    </div>
  );
};
