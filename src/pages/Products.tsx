import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Product } from '../types';
import { Button, Input, Select, Textarea, Badge, Modal, ConfirmDialog, SearchInput, Pagination, EmptyState, formatCurrency, formatDate, Dropdown } from '../components/ui';
import { Plus, MoreHorizontal, Edit2, Trash2, Download, Upload, Filter } from 'lucide-react';

export function Products() {
  const { products, categories, suppliers, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<'name' | 'stock' | 'sellingPrice'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) { const q = search.toLowerCase(); result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)); }
    if (categoryFilter) result = result.filter(p => p.categoryId === categoryFilter);
    if (statusFilter === 'low') result = result.filter(p => p.stock > 0 && p.stock <= p.minStock);
    else if (statusFilter === 'out') result = result.filter(p => p.stock === 0);
    else if (statusFilter === 'active') result = result.filter(p => p.stock > p.minStock);
    result.sort((a, b) => {
      const aVal = a[sortField], bVal = b[sortField];
      if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return result;
  }, [products, search, categoryFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleDelete = (id: string) => { deleteProduct(id); setToast('Product deleted'); setTimeout(() => setToast(''), 3000); };
  const handleBulkDelete = () => { selected.forEach(id => deleteProduct(id)); setSelected([]); setToast(`${selected.length} products deleted`); setTimeout(() => setToast(''), 3000); };

  const exportCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Cost Price', 'Selling Price', 'Stock', 'Status'];
    const rows = filtered.map(p => [p.sku, p.name, categories.find(c => c.id === p.categoryId)?.name || '', p.costPrice, p.sellingPrice, p.stock, p.stock === 0 ? 'Out of Stock' : p.stock <= p.minStock ? 'Low Stock' : 'In Stock']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'products.csv'; a.click();
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Products</h1>
          <p className="text-sm text-[#6F747C]">{products.length} products in catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download size={13} /> Export</Button>
          <Button size="sm" onClick={() => { setEditingProduct(null); setShowForm(true); }}><Plus size={13} /> Add Product</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search products..." className="sm:w-64" />
        <Select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All Categories' }, ...categories.map(c => ({ value: c.id, label: c.name }))]} className="w-full sm:w-40" />
        <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All Status' }, { value: 'active', label: 'In Stock' }, { value: 'low', label: 'Low Stock' }, { value: 'out', label: 'Out of Stock' }]} className="w-full sm:w-36" />
        {selected.length > 0 && <Button variant="danger" size="sm" onClick={handleBulkDelete}>Delete ({selected.length})</Button>}
      </div>

      {/* Table */}
      <div className="bg-[#101214] border border-[#25282C] rounded-xl overflow-hidden inner-glow shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#25282C] bg-[#0C0D0F]/50">
                <th className="px-4 py-3.5 text-left"><input type="checkbox" className="rounded" checked={selected.length === paginated.length && paginated.length > 0} onChange={e => setSelected(e.target.checked ? paginated.map(p => p.id) : [])} /></th>
                <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-[#6F747C] uppercase tracking-wider cursor-pointer hover:text-[#9A9EA5] transition-colors" onClick={() => { setSortField('name'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Product</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-[#6F747C] uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-[#6F747C] uppercase tracking-wider">Category</th>
                <th className="px-4 py-3.5 text-right text-[11px] font-semibold text-[#6F747C] uppercase tracking-wider cursor-pointer hover:text-[#9A9EA5] transition-colors" onClick={() => { setSortField('sellingPrice'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Price</th>
                <th className="px-4 py-3.5 text-right text-[11px] font-semibold text-[#6F747C] uppercase tracking-wider cursor-pointer hover:text-[#9A9EA5] transition-colors" onClick={() => { setSortField('stock'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Stock</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-[#6F747C] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-[#6F747C] uppercase tracking-wider">Updated</th>
                <th className="px-4 py-3.5 text-right text-[11px] font-semibold text-[#6F747C] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((product, i) => {
                const cat = categories.find(c => c.id === product.categoryId);
                const stockStatus = product.stock === 0 ? 'out' : product.stock <= product.minStock ? 'low' : 'ok';
                return (
                  <tr key={product.id} className="border-b border-[#1E2024] hover:bg-[#0D0E10] transition-all duration-200 row-highlight table-row-enter" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="px-4 py-3.5"><input type="checkbox" className="rounded" checked={selected.includes(product.id)} onChange={e => setSelected(e.target.checked ? [...selected, product.id] : selected.filter(s => s !== product.id))} /></td>
                    <td className="px-4 py-3.5"><span className="font-medium text-[#F2F3F5]">{product.name}</span></td>
                    <td className="px-4 py-3.5 text-[#9A9EA5] font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-3.5 text-[#9A9EA5]">{cat?.name || '-'}</td>
                    <td className="px-4 py-3.5 text-right text-[#F2F3F5] font-medium">{formatCurrency(product.sellingPrice)}</td>
                    <td className="px-4 py-3.5 text-right text-[#F2F3F5] font-medium">{product.stock}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={stockStatus === 'out' ? 'error' : stockStatus === 'low' ? 'warning' : 'success'}>
                        {stockStatus === 'out' ? 'Out of Stock' : stockStatus === 'low' ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-[#6F747C] text-xs">{formatDate(product.updatedAt)}</td>
                    <td className="px-4 py-3.5 text-right">
                      <Dropdown trigger={<button className="p-1.5 rounded-md hover:bg-[#1A1C1F] text-[#6F747C] hover:text-[#F2F3F5] transition-all duration-200"><MoreHorizontal size={14} /></button>}
                        items={[
                          { label: 'Edit', icon: <Edit2 size={13} />, onClick: () => { setEditingProduct(product); setShowForm(true); } },
                          { label: 'Delete', icon: <Trash2 size={13} />, onClick: () => setDeleteId(product.id), danger: true },
                        ]} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState title="No products found" description="Try adjusting your filters or add a new product." action={<Button size="sm" onClick={() => { setEditingProduct(null); setShowForm(true); }}><Plus size={13} /> Add Product</Button>} />}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Form Modal */}
      {showForm && <ProductForm product={editingProduct} onClose={() => setShowForm(false)} categories={categories} suppliers={suppliers} onSave={(data) => {
        if (editingProduct) { updateProduct(editingProduct.id, data); setToast('Product updated'); }
        else { addProduct(data as any); setToast('Product created'); }
        setShowForm(false); setTimeout(() => setToast(''), 3000);
      }} />}

      {/* Delete Confirm */}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) handleDelete(deleteId); }}
        title="Delete Product" message="Are you sure? This action cannot be undone. All related data will be affected." confirmText="Delete" danger />

      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
    </div>
  );
}

function ProductForm({ product, onClose, categories, suppliers, onSave }: {
  product: Product | null; onClose: () => void; categories: { id: string; name: string }[]; suppliers: { id: string; company: string }[]; onSave: (data: any) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '', sku: product?.sku || '', barcode: product?.barcode || '',
    categoryId: product?.categoryId || categories[0]?.id || '', description: product?.description || '',
    costPrice: product?.costPrice?.toString() || '', sellingPrice: product?.sellingPrice?.toString() || '',
    taxRate: product?.taxRate?.toString() || '18', stock: product?.stock?.toString() || '0',
    minStock: product?.minStock?.toString() || '10', supplierId: product?.supplierId || '',
    status: product?.status || 'active' as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.sku.trim()) errs.sku = 'Required';
    if (!form.costPrice || parseFloat(form.costPrice) <= 0) errs.costPrice = 'Must be positive';
    if (!form.sellingPrice || parseFloat(form.sellingPrice) <= 0) errs.sellingPrice = 'Must be positive';
    if (form.stock === '' || parseInt(form.stock) < 0) errs.stock = 'Must be 0 or more';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      ...form, costPrice: parseFloat(form.costPrice), sellingPrice: parseFloat(form.sellingPrice),
      taxRate: parseFloat(form.taxRate), stock: parseInt(form.stock), minStock: parseInt(form.minStock),
    });
  };

  return (
    <Modal open={true} onClose={onClose} title={product ? 'Edit Product' : 'Add Product'} size="lg" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{product ? 'Update' : 'Create'} Product</Button>
      </>
    }>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Product Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="e.g. Wireless Keyboard" />
          <Input label="SKU *" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} error={errors.sku} placeholder="e.g. KB-001" />
          <Input label="Barcode" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} placeholder="Optional" />
          <Select label="Category" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
            options={categories.map(c => ({ value: c.id, label: c.name }))} />
          <Input label="Cost Price (₹) *" type="number" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: e.target.value })} error={errors.costPrice} />
          <Input label="Selling Price (₹) *" type="number" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} error={errors.sellingPrice} />
          <Input label="Tax Rate (%)" type="number" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: e.target.value })} />
          <Input label="Current Stock *" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} error={errors.stock} />
          <Input label="Minimum Stock" type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} />
          <Select label="Supplier" value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}
            options={[{ value: '', label: 'None' }, ...suppliers.map(s => ({ value: s.id, label: s.company }))]} />
        </div>
        <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." />
        <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}
          options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'discontinued', label: 'Discontinued' }]} />
      </form>
    </Modal>
  );
}
