import { useState } from "react";
import FeedbackForm from "../Components/FeedbackForm";

function ModalDetalle({ historia, onClose }) {
  const [formData, setFormData] = useState({
    id: historia.id || "",
    cedula: historia.cedula || "",
    nombre: historia.nombre || "",
    edad: historia.edad || "",
    diagnostico: historia.diagnostico || "",
    fechaConsulta: historia.fechaConsulta || "",
    direccion: historia.direccion || "",
    telefono: historia.telefono || "",
    observaciones: historia.observaciones || "",
    eps: historia.eps || "",
  });

  const [errors, setErrors] = useState({});
  const [modalFeedback, setModalFeedback] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] || formData[key].toString().trim() === "") {
        newErrors[key] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardar = async () => {
    if (!validateForm()) {
      alert("Por favor, llena todos los campos antes de guardar.");
      return;
    }

    try {
      const payload = {
        id: formData.id,
        cedula: formData.cedula,
        nombre: formData.nombre,
        edad: Number(formData.edad),
        diagnostico: formData.diagnostico,
        fechaConsulta: new Date(formData.fechaConsulta).toISOString(),
        direccion: formData.direccion,
        telefono: formData.telefono,
        observaciones: formData.observaciones,
        eps: formData.eps,
      };

      console.log(payload);
      const res = await fetch("http://127.0.0.1:8000/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error.detail);
        alert("Error al guardar: " + error.detail);
      } else {
        alert("Paciente guardado correctamente");
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Error al guardar paciente");
    }
  };

  const inputClass = (name) =>
    `w-full border rounded p-2 ${
      errors[name] ? "border-red-500 bg-red-50" : ""
    }`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-blue-600 text-center">
            Historia Clínica
          </h2>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Identificación */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Identificación del Paciente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="ID"
                className={inputClass("id")}
                disabled={true}
              />
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="Cédula"
                className={inputClass("cedula")}
              />
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                placeholder="Edad"
                className={inputClass("edad")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                className={inputClass("nombre")}
              />
              <input
                type="text"
                name="eps"
                value={formData.eps}
                onChange={handleChange}
                placeholder="EPS"
                className={inputClass("eps")}
              />
            </div>
          </div>

          {/* Consulta */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Consulta Actual
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                name="diagnostico"
                value={formData.diagnostico}
                onChange={handleChange}
                placeholder="Motivo / Diagnóstico"
                className={inputClass("diagnostico")}
              />
              <input
                type="date"
                name="fechaConsulta"
                value={formData.fechaConsulta}
                onChange={handleChange}
                className={inputClass("fechaConsulta")}
              />
            </div>
          </div>

          {/* Contacto */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Contacto y Dirección
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección"
                className={inputClass("direccion")}
              />
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className={inputClass("telefono")}
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Observaciones
            </h3>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              placeholder="Notas adicionales"
              className={inputClass("observaciones")}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <button
            onClick={() => setModalFeedback(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Dar Feedback
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cerrar
            </button>
            <button
              onClick={handleGuardar}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      {/* Modal de feedback */}
      {modalFeedback && (
        <FeedbackForm
          textoOriginal={JSON.stringify(formData, null, 2)}
          predicciones={formData}
          onClose={() => setModalFeedback(false)}
        />
      )}
    </div>
  );
}

export default ModalDetalle;
