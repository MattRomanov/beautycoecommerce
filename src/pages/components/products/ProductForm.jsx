import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../../../services/api';
import { toast } from 'react-toastify';
import { FaMagic } from 'react-icons/fa';

const ProductForm = ({ product, onSuccess }) => {
  const [formData, setFormData] = useState(product || {
    nombre: '',
    precio: '',
    descripcion: '',
    imagen: '',
    categoria: ''
  });

  const [errors, setErrors] = useState({});
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    setFormData(product || {
      nombre: '',
      precio: '',
      descripcion: '',
      imagen: '',
      categoria: ''
    });
    setErrors({});
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    }
    
    const parsedPrecio = parseFloat(formData.precio);
    if (isNaN(parsedPrecio) || parsedPrecio <= 0) {
      newErrors.precio = 'El precio debe ser un número mayor que 0.';
    }

    if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario.', { toastId: 'form-validation-error' });
      return;
    }

    try {
      if (product) {
        await updateProduct(product.id, formData);
        toast.success('Producto actualizado con éxito!', { toastId: 'product-update-success' });
        console.log('Producto actualizado con éxito:', formData);
      } else {
        await createProduct(formData);
        toast.success('Producto creado con éxito!', { toastId: 'product-create-success' });
        console.log('Producto creado con éxito:', formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      toast.error('Error al guardar el producto.', { toastId: 'product-save-error' });
    }
  };

  const generateDescriptionWithGemini = async () => {
    setIsGeneratingDescription(true);
    let chatHistory = [];
    let prompt = `Genera una descripción de producto detallada y atractiva para un producto llamado "${formData.nombre}". `;
    
    if (formData.descripcion.trim()) {
      prompt += `Considera estas características iniciales: "${formData.descripcion}".`;
    } else {
      prompt += `El producto pertenece a la categoría "${formData.categoria || 'general'}" y su precio es de $${formData.precio || 'un precio no especificado'}.`;
    }
    prompt += ` Asegúrate de que la descripción tenga al menos 50 palabras.`;

    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const generatedText = result.candidates[0].content.parts[0].text;
        setFormData(prevData => ({ ...prevData, descripcion: generatedText }));
        toast.success('✨ Descripción generada con éxito por Gemini!', { toastId: 'gemini-success' });
      } else {
        toast.error('Error al generar descripción: No se recibió contenido válido de Gemini.', { toastId: 'gemini-no-content' });
        console.error('Respuesta inesperada de Gemini:', result);
      }
    } catch (error) {
      console.error('Error al llamar a la API de Gemini:', error);
      toast.error('Error al generar descripción con Gemini. Inténtalo de nuevo.', { toastId: 'gemini-api-error' });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-200">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">{product ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            required
          />
          {errors.nombre && <div className="text-red-500 text-xs mt-1">{errors.nombre}</div>}
        </div>

        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.precio ? 'border-red-500' : 'border-gray-300'}`}
            id="precio"
            value={formData.precio}
            onChange={(e) => setFormData({...formData, precio: e.target.value})}
            required
            step="0.01"
          />
          {errors.precio && <div className="text-red-500 text-xs mt-1">{errors.precio}</div>}
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
            id="descripcion"
            rows="5"
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
          ></textarea>
          {errors.descripcion && <div className="text-red-500 text-xs mt-1">{errors.descripcion}</div>}
          <button 
            type="button" 
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={generateDescriptionWithGemini}
            disabled={isGeneratingDescription || !formData.nombre.trim()}
          >
            {isGeneratingDescription ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <FaMagic className="mr-2" /> Generar Descripción ✨
              </>
            )}
          </button>
        </div>

        <div>
          <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            id="imagen"
            value={formData.imagen}
            onChange={(e) => setFormData({...formData, imagen: e.target.value})}
          />
          {formData.imagen && (
            <img
              src={formData.imagen}
              alt="Product Preview"
              className="mt-2 w-24 h-24 object-cover rounded-md shadow-sm"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/CCCCCC/000000?text=Image+Error"; }}
            />
          )}
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            id="categoria"
            value={formData.categoria}
            onChange={(e) => setFormData({...formData, categoria: e.target.value})}
            required
          />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Guardar
          </button>
          <button 
            type="button" 
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-105"
            onClick={onSuccess}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;