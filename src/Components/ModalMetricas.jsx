import React, { useEffect, useState } from "react";
import {
  Timer,
  Target,
  RefreshCw,
  Scale,
  FileText,
  CalendarDays,
} from "lucide-react";

function ModalMetricas({ metricas = [], setModalMetricas }) {
  const [tooltip, setTooltip] = useState(null);
  const hayMetricas = metricas && metricas.length > 0;

  // 🔹 Bloquear scroll del fondo al abrir modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 🔹 Promedios
  const avg = (key) =>
    hayMetricas
      ? (
          metricas.reduce((acc, m) => acc + (parseFloat(m[key]) || 0), 0) /
          metricas.length
        ).toFixed(3)
      : 0;

  const tiempoPromedio = avg("tiempo");
  const accuracyPromedio = avg("accuracy");
  const recallPromedio = avg("recall");
  const f1Promedio = avg("f1");
  const longitudPromedio = hayMetricas
    ? Math.round(
        metricas.reduce((acc, m) => acc + (m.longitud_texto || 0), 0) /
          metricas.length
      )
    : 0;

  const ultimaFecha = hayMetricas ? metricas[0]?.fecha : "-";

  // 🔹 Descripciones ampliadas (para los tooltips)
  const explicaciones = {
    tiempo: `
⏱️ **Tiempo promedio de procesamiento**
Indica el tiempo medio (en segundos) que el modelo tarda en analizar una entrada.
**Rango típico:** 0 a varios segundos.
- Valores bajos → mejor rendimiento.
- Valores altos → mayor carga de cómputo.
Se calcula promediando el tiempo de ejecución de todas las predicciones.`,
    accuracy: `
🎯 **Exactitud (Accuracy)**
Mide la proporción de predicciones correctas sobre el total de casos.
**Rango:** 0 a 1
- 0 → todas incorrectas.
- 1 → todas correctas.`,
    recall: `
🔁 **Exhaustividad (Recall)**
Evalúa la capacidad del modelo para detectar correctamente los casos positivos.
**Rango:** 0 a 1`,
    f1: `
⚖️ **F1 Score**
Equilibrio entre precisión y recall.
**Rango:** 0 a 1`,
    longitud_texto: `
📄 **Longitud promedio del texto**
Promedio de caracteres por historia clínica procesada.`,
    fecha: `
📅 **Última actualización**
Fecha más reciente registrada en las métricas.`,
  };

  // 🔹 Tarjetas resumen
  const tarjetas = [
    {
      key: "tiempo",
      icon: <Timer className="w-6 h-6 text-blue-600 mx-auto" />,
      label: "Tiempo promedio",
      value: `${tiempoPromedio}s`,
    },
    {
      key: "accuracy",
      icon: <Target className="w-6 h-6 text-green-600 mx-auto" />,
      label: "Exactitud (Accuracy)",
      value: accuracyPromedio,
    },
    {
      key: "recall",
      icon: <RefreshCw className="w-6 h-6 text-purple-600 mx-auto" />,
      label: "Exhaustividad (Recall)",
      value: recallPromedio,
    },
    {
      key: "f1",
      icon: <Scale className="w-6 h-6 text-yellow-600 mx-auto" />,
      label: "F1 Score",
      value: f1Promedio,
    },
    {
      key: "longitud_texto",
      icon: <FileText className="w-6 h-6 text-pink-600 mx-auto" />,
      label: "Longitud promedio",
      value: longitudPromedio,
    },
    {
      key: "fecha",
      icon: <CalendarDays className="w-6 h-6 text-indigo-600 mx-auto" />,
      label: "Última actualización",
      value: ultimaFecha,
    },
  ];

  // 🔹 Renderizado principal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-11/12 h-5/6 max-w-5xl shadow-2xl p-6 relative border border-gray-200 flex flex-col">
        {/* Botón cerrar */}
        <button
          onClick={() => setModalMetricas(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">
          📊 Métricas del Sistema
        </h2>

        {!hayMetricas ? (
          <p className="text-center text-gray-500 flex-grow flex items-center justify-center">
            No hay métricas disponibles.
          </p>
        ) : (
          <>
            {/* 🧩 Tarjetas resumen */}
            <div className="grid grid-cols-6 gap-2 mb-2 text-center pb-2 relative z-20">
              {tarjetas.map((item) => (
                <div
                  key={item.key}
                  onClick={() =>
                    setTooltip(tooltip === item.key ? null : item.key)
                  }
                  className="relative bg-gray-50 hover:bg-gray-100 cursor-pointer p-2 shadow-sm transition-all duration-200 rounded-lg"
                >
                  <div className="flex flex-col items-center">
                    {item.icon}
                    <p className="text-xs text-gray-600 mt-1">{item.label}</p>
                    <h3 className="text-sm font-semibold text-blue-700">
                      {item.value}
                    </h3>
                  </div>

                  {/* Tooltip */}
                  {tooltip === item.key && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-gray-800 text-white text-xs rounded-lg px-4 py-3 shadow-lg w-64 z-50 animate-fadeIn text-left whitespace-pre-line leading-snug">
                      {explicaciones[item.key]}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-gray-800"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 📋 Tabla con encabezados en español */}
            <div className="flex-grow overflow-x-auto">
              <div className="max-h-[55vh]">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="border px-2 sm:px-3">#</th>
                      <th className="border px-2 sm:px-3">ID Historia</th>
                      <th className="border px-2 sm:px-3">
                        Modelo más preciso
                      </th>
                      <th className="border px-2 sm:px-3">Tiempo (segundos)</th>
                      <th className="border px-2 sm:px-3">Exactitud</th>
                      <th className="border px-2 sm:px-3">Exhaustividad</th>
                      <th className="border px-2 sm:px-3">Puntaje F1</th>
                      <th className="border px-2 sm:px-3">
                        Longitud del texto
                      </th>
                      <th className="border px-2 sm:px-3">Fecha de registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricas.map((m, i) => {
                      const colorModelo =
                        m.mejor_modelo === "spacy"
                          ? "text-blue-600 font-semibold"
                          : m.mejor_modelo === "regex"
                          ? "text-purple-600 font-semibold"
                          : "text-gray-500";
                      return (
                        <tr
                          key={i}
                          className="text-center hover:bg-gray-50 transition-colors"
                        >
                          <td className="border px-2 sm:px-3 py-2">{i + 1}</td>
                          <td className="border px-2 sm:px-3 py-2">
                            {m.historia_id ?? "No identificado"}
                          </td>
                          <td
                            className={`border px-2 sm:px-3 py-2 ${colorModelo}`}
                          >
                            {m.mejor_modelo ?? "-"}
                          </td>
                          <td className="border px-2 sm:px-3 py-2">
                            {m.tiempo}
                          </td>
                          <td className="border px-2 sm:px-3 py-2">
                            {m.accuracy}
                          </td>
                          <td className="border px-2 sm:px-3 py-2">
                            {m.recall}
                          </td>
                          <td className="border px-2 sm:px-3 py-2">{m.f1}</td>
                          <td className="border px-2 sm:px-3 py-2">
                            {m.longitud_texto}
                          </td>
                          <td className="border px-2 sm:px-3 py-2">
                            {m.fecha}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ModalMetricas;
