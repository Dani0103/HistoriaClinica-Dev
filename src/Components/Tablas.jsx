import { useState, useMemo } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";

function Tablas({ data, onVerDetalle }) {
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 10; // 🔹 Número de registros por página

  // 🔹 Ordenar por fecha (más reciente primero)
  const dataOrdenada = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.fechaConsulta) - new Date(a.fechaConsulta)
    );
  }, [data]);

  // 🔹 Filtrar
  const dataFiltrada = useMemo(() => {
    return dataOrdenada.filter((historia) => {
      const texto = filtro.toLowerCase();
      return (
        (historia.nombre?.toLowerCase() || "").includes(texto) ||
        String(historia.edad || "").includes(texto) ||
        (historia.diagnostico?.toLowerCase() || "").includes(texto) ||
        (historia.fechaConsulta || "").includes(texto)
      );
    });
  }, [filtro, dataOrdenada]);

  // 🔹 Calcular páginas
  const totalPaginas = Math.ceil(dataFiltrada.length / filasPorPagina);
  const indiceInicio = (paginaActual - 1) * filasPorPagina;
  const dataPaginada = dataFiltrada.slice(
    indiceInicio,
    indiceInicio + filasPorPagina
  );

  // 🔹 Funciones de paginado
  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };
  const anteriorPagina = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  return (
    <div className="p-6 w-full">
      {/* 🔍 Búsqueda */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-700">
          Lista de Historias Clínicas
        </h3>
        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPaginaActual(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 📋 Tabla */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-sm text-gray-700">
          <thead className="bg-blue-50 text-blue-700">
            <tr>
              <th className="border px-3 py-2 text-left">#</th>
              <th className="border px-3 py-2 text-left">Cédula</th>
              <th className="border px-3 py-2 text-left">Nombre</th>
              <th className="border px-3 py-2 text-center">Edad</th>
              <th className="border px-3 py-2 text-left">Diagnóstico</th>
              <th className="border px-3 py-2 text-center">Fecha Consulta</th>
              <th className="border px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataPaginada.map((historia, index) => (
              <tr
                key={historia.id}
                className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
              >
                <td className="border px-3 py-2 text-center">
                  {indiceInicio + index + 1}
                </td>
                <td className="border px-3 py-2">{historia.cedula}</td>
                <td className="border px-3 py-2">{historia.nombre}</td>
                <td className="border px-3 py-2 text-center">
                  {historia.edad}
                </td>
                <td className="border px-3 py-2">{historia.diagnostico}</td>
                <td className="border px-3 py-2 text-center">
                  {historia.fechaConsulta}
                </td>
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => onVerDetalle(historia)}
                    className="p-2 rounded-full hover:bg-blue-100"
                    title="Ver detalle"
                  >
                    <Eye className="w-5 h-5 text-blue-600" />
                  </button>
                </td>
              </tr>
            ))}
            {dataFiltrada.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Paginación */}
      {dataFiltrada.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <p className="text-sm text-gray-600">
            Mostrando{" "}
            <strong>
              {indiceInicio + 1}-
              {Math.min(indiceInicio + filasPorPagina, dataFiltrada.length)}
            </strong>{" "}
            de <strong>{dataFiltrada.length}</strong> registros
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={anteriorPagina}
              disabled={paginaActual === 1}
              className={`p-2 rounded-full border ${
                paginaActual === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-blue-50 text-blue-600"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-sm font-medium text-gray-700">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              onClick={siguientePagina}
              disabled={paginaActual === totalPaginas}
              className={`p-2 rounded-full border ${
                paginaActual === totalPaginas
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-blue-50 text-blue-600"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tablas;
