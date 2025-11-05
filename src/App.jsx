import { useState, useEffect } from "react";
import {
  Activity,
  Database,
  BarChart3,
  TriangleAlert,
  Loader2,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./App.css";
import Tablas from "./Components/Tablas";
import ModalDetalle from "./Components/ModalDetalle";
import ModalMetricas from "./Components/ModalMetricas";

function App() {
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null);
  const [historiasClinicas, setHistoriasClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMetricas, setModalMetricas] = useState(false);
  const [metricas, setMetricas] = useState([]);

  // 🔹 Nuevo: estado del modal de gráfica ampliada
  const [graficaSeleccionada, setGraficaSeleccionada] = useState(null);

  // 🔹 Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resHistorias, resMetricas] = await Promise.all([
          fetch("http://localhost:8000/historiales"),
          fetch("http://localhost:8000/metrics"),
        ]);

        if (!resHistorias.ok || !resMetricas.ok)
          throw new Error("Error al cargar los datos del servidor");

        const dataHistorias = await resHistorias.json();
        const dataMetricas = await resMetricas.json();

        setHistoriasClinicas(dataHistorias.data || []);
        setMetricas(dataMetricas || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGuardar = (nuevaHistoria) => {
    const nuevoId = `HC-${String(historiasClinicas.length + 1).padStart(
      3,
      "0"
    )}`;
    const historiaConId = { ...nuevaHistoria, id: nuevoId };
    setHistoriasClinicas((prev) => [...prev, historiaConId]);
    setHistoriaSeleccionada(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-blue-600 text-xl gap-3">
        <Loader2 className="w-6 h-6 animate-spin" />
        Cargando historias clínicas...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <TriangleAlert className="w-10 h-10 mb-2" />
        <p className="text-lg font-semibold">Error: {error}</p>
      </div>
    );

  // 🔹 Transformar métricas en datos para gráficas
  const data = metricas.map((m, index) => ({
    name: `HC-${index + 1}`,
    tiempo: parseFloat(m.tiempo) || 0,
    accuracy: parseFloat(m.accuracy) || 0,
    recall: parseFloat(m.recall) || 0,
    f1: parseFloat(m.f1) || 0,
  }));

  // 🔹 Configuración para cada gráfica
  const graficas = [
    {
      key: "tiempo",
      color: "#3b82f6",
      label: "Tiempo de procesamiento (s)",
      ejeY: "Segundos",
    },
    {
      key: "accuracy",
      color: "#22c55e",
      label: "Exactitud (Accuracy)",
      ejeY: "Proporción",
    },
    {
      key: "recall",
      color: "#a855f7",
      label: "Exhaustividad (Recall)",
      ejeY: "Proporción",
    },
    {
      key: "f1",
      color: "#eab308",
      label: "Puntaje F1",
      ejeY: "Proporción",
    },
  ];

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* 🔹 Encabezado superior */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm border-b">
        <h1 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2">
          <Database className="w-8 h-8 text-blue-500" />
          Historias Clínicas
        </h1>
        <button
          onClick={() => setModalMetricas(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <BarChart3 className="w-5 h-5" />
          Ver métricas
        </button>
      </header>

      {/* 🔹 Cuerpo principal */}
      <main className="flex flex-1 overflow-hidden">
        {/* Panel Izquierdo */}
        <aside className="w-1/3 min-w-[380px] bg-white border-r border-gray-200 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            Rendimiento del Modelo
          </h2>

          {graficas.map((graf, idx) => (
            <div
              key={idx}
              onClick={() => setGraficaSeleccionada(graf)}
              className="h-52 bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition cursor-pointer"
            >
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: graf.color }}
              >
                {graf.label}
              </p>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis
                    domain={[0, graf.key === "tiempo" ? "auto" : 1]}
                    label={{
                      value: graf.ejeY,
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        textAnchor: "middle",
                        fill: graf.color,
                        fontSize: 11,
                      },
                    }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={graf.key}
                    stroke={graf.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </aside>

        {/* Panel Derecho: tabla principal */}
        <section className="flex-1 p-4 bg-gray-50 flex flex-col">
          <div className="bg-white border border-gray-200 rounded-lg shadow-md flex-1 overflow-auto">
            <Tablas
              data={historiasClinicas}
              onVerDetalle={(historia) => setHistoriaSeleccionada(historia)}
            />
          </div>
        </section>
      </main>

      {/* 🔹 Modales */}
      {historiaSeleccionada && (
        <ModalDetalle
          historia={historiaSeleccionada}
          onClose={() => setHistoriaSeleccionada(null)}
          onGuardar={handleGuardar}
        />
      )}

      {modalMetricas && (
        <ModalMetricas
          metricas={metricas}
          setModalMetricas={setModalMetricas}
        />
      )}

      {/* 🔹 Modal de gráfica ampliada */}
      {graficaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white w-11/12 max-w-5xl p-6 rounded-lg shadow-2xl relative">
            <button
              onClick={() => setGraficaSeleccionada(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h2
              className="text-2xl font-bold mb-4 text-center"
              style={{ color: graficaSeleccionada.color }}
            >
              {graficaSeleccionada.label}
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="name" />
                <YAxis
                  domain={[
                    0,
                    graficaSeleccionada.key === "tiempo" ? "auto" : 1,
                  ]}
                  label={{
                    value: graficaSeleccionada.ejeY,
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      textAnchor: "middle",
                      fill: graficaSeleccionada.color,
                      fontSize: 12,
                    },
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={graficaSeleccionada.key}
                  stroke={graficaSeleccionada.color}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-600 mt-4">
              Esta gráfica muestra la evolución de la métrica{" "}
              <span className="font-semibold text-blue-700">
                {graficaSeleccionada.label}
              </span>{" "}
              para cada historia clínica procesada.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
