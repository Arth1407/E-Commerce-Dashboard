import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    expiry_date: '',
  });

  const fetchProducts = () => {
    axios
      .get('http://127.0.0.1:8000/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let productId = editProduct ? editProduct.id : null;

      if (editProduct) {
        await axios.put(`http://127.0.0.1:8000/products/${editProduct.id}`, {
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
        });
      } else {
        const res = await axios.post('http://127.0.0.1:8000/products', {
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
        });
        productId = res.data.id;
      }

      // If an image was selected, upload it
      if (imageFile && productId) {
        const formData = new FormData();
        formData.append('file', imageFile);
        await axios.post(`http://127.0.0.1:8000/products/${productId}/upload-image`, formData);
      }

      setShowForm(false);
      setEditProduct(null);
      setImageFile(null);
      setForm({ name: '', category: '', price: '', stock: '', description: '', expiry_date: '' });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Error saving product.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await axios.delete(`http://127.0.0.1:8000/products/${id}`);
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setImageFile(null);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      expiry_date: product.expiry_date || '',
    });
    setShowForm(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Products</h2>
          <p className="text-gray-400 mt-1">Manage product catalog, stock inventory, and media</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditProduct(null);
            setImageFile(null);
            setForm({ name: '', category: '', price: '', stock: '', description: '', expiry_date: '' });
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
        >
          + Add Product
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Product Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Category</label>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="e.g. Electronics"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="1299.99"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Stock</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full mt-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-800 file:text-indigo-400 file:font-semibold hover:file:bg-gray-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Expiry Date (optional)</label>
                <input
                  type="date"
                  value={form.expiry_date}
                  onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="Brief product description..."
                  rows={2}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition"
                >
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditProduct(null);
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-sm font-medium">
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-12">
                  No products yet. Click "+ Add Product" to get started.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {p.image_url ? (
                      <img
                        src={`http://127.0.0.1:8000${p.image_url}`}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-700"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        No Img
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{p.name}</p>
                      <p className="text-gray-500 text-xs truncate max-w-xs">{p.description || 'No description'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-950 text-indigo-300 border border-indigo-800/40 text-xs px-2.5 py-1 rounded-md">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-green-400 font-semibold">₹{p.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-semibold px-2 py-0.5 rounded ${
                        p.stock < 10 ? 'text-red-400 bg-red-950/60 border border-red-800' : 'text-gray-200'
                      }`}
                    >
                      {p.stock} units {p.stock < 10 && '⚠️'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{p.expiry_date || '—'}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;