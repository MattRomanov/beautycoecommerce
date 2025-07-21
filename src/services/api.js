const API_URL = 'https://685363d50594059b23d0cbe5.mockapi.io/api/v1/productos'; 

export const getProducts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

export const createProduct = async (product) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    throw new Error(`Error al crear el producto: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

export const updateProduct = async (id, product) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  if (!response.ok) {
    throw new Error(`Error al actualizar el producto: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(`Error al eliminar el producto: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};
