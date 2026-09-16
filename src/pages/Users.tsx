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
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-[#F2F3F5]">Users</h1>
          <p className="text-sm text-[#6F747C]">{users.length} team members</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={13} /> Add User</Button>
      </div>

      <div className="bg-[#101214] border border-[#25282C] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#25282C]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6F747C] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#6F747C] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[#1E2024] hover:bg-[#0D0E10] transition-default">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1A1C1F] border border-[#25282C] flex items-center justify-center text-xs font-medium text-[#9A9EA5]">{u.name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-[#F2F3F5]">{u.name}</p>
                        {u.id === currentUser?.id && <p className="text-[10px] text-[#34D399]">You</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#9A9EA5] text-xs">{u.email}</td>
                  <td className="px-4 py-3"><Badge variant={roleVariant(u.role) as any}><Shield size={10} className="mr-1" />{u.role}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={u.active ? 'success' : 'neutral'}>{u.active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== currentUser?.id && (
                      <Dropdown trigger={<button className="p-1 rounded hover:bg-[#1A1C1F] text-[#6F747C]"><MoreHorizontal size={14} /></button>}
                        items={[
                          { label: 'Edit', icon: <Edit2 size={13} />, onClick: () => { setEditing(u); setShowForm(true); } },
                          { label: u.active ? 'Deactivate' : 'Activate', icon: <Shield size={13} />, onClick: () => { updateUser(u.id, { active: !u.active }); setToast('User updated'); setTimeout(() => setToast(''), 3000); } },
                          { label: 'Delete', icon: <Trash2 size={13} />, onClick: () => setDeleteId(u.id), danger: true },
                        ]} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <UserForm user={editing} onClose={() => setShowForm(false)} onSave={(data) => {
        if (editing) { updateUser(editing.id, data); setToast('User updated'); }
        else { addUser(data as any); setToast('User created'); }
        setShowForm(false); setTimeout(() => setToast(''), 3000);
      }} />}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) { deleteUser(deleteId); setToast('User deleted'); setTimeout(() => setToast(''), 3000); } }}
        title="Delete User" message="Are you sure? This user will lose access to the system." confirmText="Delete" danger />
      {toast && <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 rounded-lg border border-[#064E2B] bg-[#052E16] animate-fade-in"><span className="text-sm font-medium text-[#34D399]">{toast}</span></div>}
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
    <Modal open={true} onClose={onClose} title={user ? 'Edit User' : 'Add User'} size="sm" footer={
      <>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{user ? 'Update' : 'Create'}</Button>
      </>
    }>
      <div className="space-y-4">
        <Input label="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input label="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <Select label="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })}
          options={[{ value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }, { value: 'staff', label: 'Staff' }]} />
      </div>
    </Modal>
  );
}
