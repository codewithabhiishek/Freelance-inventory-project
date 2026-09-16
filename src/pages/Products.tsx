import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Product } from '../types';
import { Button, Input, Select, Textarea, Badge, Modal, ConfirmDialog, SearchInput, Pagination, EmptyState, formatCurrency, formatDate, Dropdown, Checkbox } from '../components/ui';
import { Plus, MoreHorizontal, Edit2, Trash2, Download } from 'lucide-react';

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
  const perPage = 15;

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
    <div className="p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Products</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">{products.length} products in catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={exportCSV}><Download size={12} /> Export</Button>
          <Button size="sm" onClick={() => { setEditingProduct(null); setShowForm(true); }}><Plus size={12} /> Add product</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search products..." className="w-64" />
        <Select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All categories' }, ...categories.map(c => ({ value: c.id, label: c.name }))]} className="w-40" />
        <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          options={[{ value: '', label: 'All status' }, { value: 'active', label: 'In stock' }, { value: 'low', label: 'Low stock' }, { value: 'out', label: 'Out of stock' }]} className="w-32" />
        {selected.length > 0 && <Button variant="danger" size="sm" onClick={handleBulkDelete}>Delete ({selected.length})</Button>}
      </div>

      {/* Table */}
      <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="px-3 py-2.5 w-8"><Checkbox checked={selected.length === paginated.length && paginated.length > 0} onChange={v => setSelected(v ? paginated.map(p => p.id) : [])} /></th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76] cursor-pointer hover:text-[#A1A1AA]" onClick={() => { setSortField('name'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Product</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">SKU</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Category</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76] cursor-pointer hover:text-[#A1A1AA]" onClick={() => { setSortField('sellingPrice'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Price</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-medium text-[#6B6B76] cursor-pointer hover:text-[#A1A1AA]" onClick={() => { setSortField('stock'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }}>Stock</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Status</th>
                <th className="px-3 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(product => {
                const cat = categories.find(c => c.id === product.categoryId);
                const stockStatus = product.stock === 0 ? 'out' : product.stock <= product.minStock ? 'low' : 'ok';
                return (
                  <tr key={product.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                    <td className="px-3 py-2"><Checkbox checked={selected.includes(product.id)} onChange={v => setSelected(v ? [...selected, product.id] : selected.filter(s => s !== product.id))} /></td>
                    <td className="px-3 py-2 text-[#EFEFF1] font-medium">{product.name}</td>
                    <td className="px-3 py-2 text-[#6B6B76] font-mono text-[11px]">{product.sku}</td>
                    <td className="px-3 py-2 text-[#A1A1AA]">{cat?.name || '—'}</td>
                    <td className="px-3 py-2 text-right text-[#EFEFF1] tabular-nums">{formatCurrency(product.sellingPrice)}</td>
                    <td className="px-3 py-2 text-right text-[#EFEFF1] font-mono tabular-nums">{product.stock}</td>
                    <td className="px-3 py-2">
                      <Badge variant={stockStatus === 'out' ? 'error' : stockStatus === 'low' ? 'warning' : 'success'}>
                        {stockStatus === 'out' ? 'Out of stock' : stockStatus === 'low' ? 'Low stock' : 'In stock'}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1C1C1F] text-[#6B6B76] hover:text-[#EFEFF1]"><MoreHorizontal size={13} /></button>}
                        items={[
                          { label: 'Edit', icon: <Edit2 size={12} />, onClick: () => { setEditingProduct(product); setShowForm(true); } },
                          { label: 'Delete', icon: <Trash2 size={12} />, onClick: () => setDeleteId(product.id), danger: true },
                        ]} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState title="No products found" description="Try adjusting your filters or add a new product." action={<Button size="sm" onClick={() => { setEditingProduct(null); setShowForm(true); }}><Plus size={12} /> Add product</Button>} />}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {showForm && <ProductForm product={editingProduct} onClose={() => setShowForm(false)} categories={categories} suppliers={suppliers} onSave={(data) => {
        if (editingProduct) { updateProduct(editingProduct.id, data); setToast('Product updated'); }
        else { addProduct(data as any); setToast('Product created'); }
        setShowForm(false); setTimeout(() => setToast(''), 3000);
      }} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) handleDelete(deleteId); }}
        title="Delete product" message="This action cannot be undone. All related data will be affected." confirmText="Delete" danger />

      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
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

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.sku.trim()) errs.sku = 'Required';
    if (!form.costPrice || parseFloat(form.costPrice) <= 0) errs.costPrice = 'Must be positive';
    if (!form.sellingPrice || parseFloat(form.sellingPrice) <= 0) errs.sellingPrice = 'Must be positive';
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSave({
        ...form, costPrice: parseFloat(form.costPrice), sellingPrice: parseFloat(form.sellingPrice),
        taxRate: parseFloat(form.taxRate), stock: parseInt(form.stock), minStock: parseInt(form.minStock),
      });
    }
  };

  return (
    <Modal open={true} onClose={onClose} title={product ? 'Edit product' : 'Add product'} size="lg" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{product ? 'Update' : 'Create'}</Button>
      </>
    }>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input label="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} error={errors.sku} />
          <Input label="Barcode" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} />
          <Select label="Category" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
            options={categories.map(c => ({ value: c.id, label: c.name }))} />
          <Input label="Cost price (₹)" type="number" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: e.target.value })} error={errors.costPrice} />
          <Input label="Selling price (₹)" type="number" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} error={errors.sellingPrice} />
          <Input label="Tax rate (%)" type="number" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: e.target.value })} />
          <Input label="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
          <Input label="Min stock" type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} />
          <Select label="Supplier" value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}
            options={[{ value: '', label: 'None' }, ...suppliers.map(s => ({ value: s.id, label: s.company }))]} />
        </div>
        <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
    </Modal>
  );
}
