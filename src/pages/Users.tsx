import React, { useState } from 'react';
import { useStore } from '../store';
import { User } from '../types';
import { Button, Input, Select, Badge, Modal, ConfirmDialog, Dropdown } from '../components/ui';
import { Plus, MoreHorizontal, Edit2, Trash2, Shield } from 'lucide-react';

export function Users() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const roleVariant = (r: string) => r === 'admin' ? 'error' : r === 'manager' ? 'warning' : 'info';

  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-[#EFEFF1] tracking-tight">Users</h1>
          <p className="text-[13px] text-[#6B6B76] mt-0.5">{users.length} team members</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={12} /> Add user</Button>
      </div>

      <div className="border border-[#1A1A1D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#1A1A1D]">
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">User</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Email</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Role</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-medium text-[#6B6B76]">Status</th>
                <th className="px-3 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[#1A1A1D] last:border-0 hover:bg-[#111113] transition-colors">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#1C1C1F] border border-[#242428] flex items-center justify-center text-[10px] font-medium text-[#A1A1AA]">{u.name.charAt(0)}</div>
                      <div>
                        <p className="text-[#EFEFF1] font-medium">{u.name}</p>
                        {u.id === currentUser?.id && <p className="text-[10px] text-[#4ADE80]">You</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[#6B6B76] text-[12px]">{u.email}</td>
                  <td className="px-3 py-2"><Badge variant={roleVariant(u.role) as any}><Shield size={10} className="mr-0.5" />{u.role}</Badge></td>
                  <td className="px-3 py-2"><Badge variant={u.active ? 'success' : 'neutral'}>{u.active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="px-3 py-2 text-right">
                    {u.id !== currentUser?.id && (
                      <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1C1C1F] text-[#6B6B76]"><MoreHorizontal size={13} /></button>}
                        items={[
                          { label: 'Edit', icon: <Edit2 size={12} />, onClick: () => { setEditing(u); setShowForm(true); } },
                          { label: u.active ? 'Deactivate' : 'Activate', icon: <Shield size={12} />, onClick: () => { updateUser(u.id, { active: !u.active }); setToast('User updated'); setTimeout(() => setToast(''), 3000); } },
                          { label: 'Delete', icon: <Trash2 size={12} />, onClick: () => setDeleteId(u.id), danger: true },
                        ]} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <UserForm user={editing} onClose={() => setShowForm(false)} onSave={(data: any) => {
        if (editing) { updateUser(editing.id, data); setToast('User updated'); }
        else { addUser(data); setToast('User created'); }
        setShowForm(false); setTimeout(() => setToast(''), 3000);
      }} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteUser(deleteId); setToast('User deleted'); setTimeout(() => setToast(''), 3000); } }}
        title="Delete user" message="This user will lose access to the system." confirmText="Delete" danger />
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-3 py-2 rounded-md bg-[#161618] border border-[#242428] animate-toast"><span className="text-[12px] font-medium text-[#4ADE80]">{toast}</span></div>}
    </div>
  );
}

function UserForm({ user, onClose, onSave }: { user: User | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', role: user?.role || 'staff' as const, active: user?.active ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSave(form);
  };

  return (
    <Modal open={true} onClose={onClose} title={user ? 'Edit user' : 'Add user'} size="sm" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{user ? 'Update' : 'Create'}</Button>
      </>
    }>
      <div className="space-y-3">
        <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <Select label="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })}
          options={[{ value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }, { value: 'staff', label: 'Staff' }]} />
      </div>
    </Modal>
  );
}
