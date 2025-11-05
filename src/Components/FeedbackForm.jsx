import { useState } from "react";
import axios from "axios";
import { Send, X } from "lucide-react";

function FeedbackForm({ textoOriginal, predicciones, onClose }) {
  const [formData, setFormData] = useState(predicciones || {});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviarFeedback = async () => {
    setLoading(true);
    try {
      const payload = {
        text: textoOriginal,
        labels: formData,
      };

      const res = await axios.post("http://localhost:8000/feedback", payload, {
        headers: { "x-api-key": "changeme" },
      });

      if (res.data.status === "ok") {
        alert("✅ Feedback enviado correctamente");
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error al enviar feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-11/12 max-w-3xl shadow-2xl p-6 relative border border-gray-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔹 Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">
          🧠 Enviar Feedback de Corrección
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          Corrige los valores detectados por el modelo antes de enviarlos para
          su entrenamiento.
        </p>

        <div className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {key.toUpperCase()}
              </label>
              <input
                type="text"
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
                disabled={key.toLowerCase() === "id"} // 🔒 id no editable
                className={`w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${
                  key.toLowerCase() === "id" ? "bg-gray-100 text-gray-500" : ""
                }`}
                placeholder={`Corrige el valor de ${key}`}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={enviarFeedback}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Send className="w-4 h-4" />
            {loading ? "Enviando..." : "Enviar Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackForm;
