import { useState, useMemo } from "react";
import { Eye } from "lucide-react";

function Tablas({ data, onVerDetalle }) {
  const [filtro, setFiltro] = useState("");

  // 🔹 Ordenamos por fecha (más reciente primero)
  const dataOrdenada = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(b.fechaConsulta) - new Date(a.fechaConsulta)
    );
  }, [data]);

  // 🔹 Filtrado general
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

  return (
    <div className="p-8 w-full">
      {/* 🔹 Input de búsqueda */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Buscar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border border-gray-400 rounded px-3 py-2 w-64"
        />
      </div>

      <table className="table-auto border-collapse border border-gray-400 shadow-md w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Cédula</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Edad</th>
            <th className="border border-gray-300 px-4 py-2">Diagnóstico</th>
            <th className="border border-gray-300 px-4 py-2">Fecha Consulta</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dataFiltrada.map((historia, index) => (
            <tr key={historia.id} className="odd:bg-white even:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">
                {historia.cedula}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {historia.nombre}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {historia.edad}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {historia.diagnostico}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {historia.fechaConsulta}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => onVerDetalle(historia)}
                  className="p-2 rounded-full hover:bg-blue-100"
                >
                  <Eye className="w-5 h-5 text-blue-600" />
                </button>
              </td>
            </tr>
          ))}
          {dataFiltrada.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                No se encontraron resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Tablas;
