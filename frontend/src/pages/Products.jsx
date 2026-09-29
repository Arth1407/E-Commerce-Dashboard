import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', category: '', price: '', stock: '', description: '', expiry_date: ''
  });

  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await axios.put(`http://127.0.0.1:8000/products/${editProduct.id}`, form);
      } else {
        await axios.post('http://127.0.0.1:8000/products', form);
      }
      setShowForm(false);
      setEditProduct(null);
      setForm({ name: '', category: '', price: '', stock: '', description: '', expiry_date: '' });
      fetchProducts();
    } catch (err) {
      console.error(err);
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
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      expiry_date: product.expiry_date || ''
    });
    setShowForm(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Products</h2>
          <p className="text-gray-400 mt-1">Manage your product listings</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditProduct(null); setForm({ name: '', category: '', price: '', stock: '', description: '', expiry_date: '' }); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
        >
          + Add Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg border border-gray-700">
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
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Wireless Earbuds"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Category</label>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Electronics"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500"
                    placeholder="1299.99"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Stock</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500"
                    placeholder="50"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Expiry Date (optional)</label>
                <input
                  type="date"
                  value={form.expiry_date}
                  onChange={e => setForm({ ...form, expiry_date: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mt-1 border border-gray-700 focus:outline-none focus:border-indigo-500"
                  placeholder="Brief product description"
                  rows={3}
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-all"
                >
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditProduct(null); }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Product</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Category</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Price</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Stock</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Expiry Date</th>
              <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-12">
                  No products yet. Click "Add Product" to get started.
                </td>
              </tr>
            ) : (
              products.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-800 hover:bg-gray-800 transition-all ${i % 2 === 0 ? '' : 'bg-gray-900'}`}>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-gray-500 text-sm">{p.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-900 text-indigo-300 text-xs px-3 py-1 rounded-full">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-green-400 font-medium">₹{p.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${p.stock < 10 ? 'text-red-400' : 'text-white'}`}>
                      {p.stock} {p.stock < 10 && '⚠️'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {p.expiry_date || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1.5 rounded-lg transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </div>
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