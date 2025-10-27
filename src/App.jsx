import { useState, useEffect } from "react";
import "./App.css";
import Tablas from "./Components/Tablas";
import ModalDetalle from "./Components/ModalDetalle";

function App() {
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null);
  const [historiasClinicas, setHistoriasClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Traer datos de la API al cargar el componente
  useEffect(() => {
    const fetchHistorias = async () => {
      try {
        const response = await fetch("http://localhost:8000/historiales"); // tu endpoint FastAPI
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setHistoriasClinicas(data.data); // data.data según cómo devolvimos JSON en FastAPI
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorias();
  }, []);

  // 🔹 Guardar nueva historia (envío al API opcional)
  const handleGuardar = async (nuevaHistoria) => {
    try {
      // Aquí podrías hacer un POST a tu API si quieres guardar en MySQL
      // const response = await fetch("http://localhost:8000/guardar_historia", { method: "POST", ... })

      const nuevoId = `HC-${String(historiasClinicas.length + 1).padStart(3, "0")}`;
      const historiaConId = { ...nuevaHistoria, id: nuevoId };
      setHistoriasClinicas((prev) => [...prev, historiaConId]);
      setHistoriaSeleccionada(null);
    } catch (err) {
      console.error("Error guardando historia:", err);
    }
  };

  if (loading) return <div className="p-8 text-xl">Cargando historias clínicas...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Consulta de Historias Clínicas
      </h1>

      <Tablas
        data={historiasClinicas}
        onVerDetalle={(historia) => setHistoriaSeleccionada(historia)}
      />

      {historiaSeleccionada && (
        <ModalDetalle
          historia={historiaSeleccionada}
          onClose={() => setHistoriaSeleccionada(null)}
          onGuardar={handleGuardar}
        />
      )}
    </div>
  );
}

export default App;
