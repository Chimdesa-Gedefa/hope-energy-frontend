// frontend/src/admin/services/ServicesList.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ServicesList(){
  const [items,setItems] = useState([]);
  const [loading,setLoading] = useState(true);
  const [editing,setEditing] = useState(null);
  const [form,setForm] = useState({ title:'', description:'', image: null });

  useEffect(()=>{ fetchList(); },[]);
  async function fetchList(){
    setLoading(true);
    try {
      const { data } = await api.get('/admin/services');
      setItems(data);
    } catch(e){ console.error(e); }
    setLoading(false);
  }

  function openCreate(){ setEditing(null); setForm({ title:'', description:'', image:null }); }
  function openEdit(item){ setEditing(item.id); setForm({ title: item.title, description: item.description, image:null }) }

  async function submit(e){
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    if(form.image) fd.append('image', form.image);
    try {
      if(editing) {
        await api.put(`/admin/services/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      } else {
        await api.post('/admin/services', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      }
      fetchList();
      setEditing(null);
    } catch(err) {
      console.error(err);
      alert('Save failed');
    }
  }

  async function del(id){
    if(!confirm('Delete?')) return;
    await api.delete(`/admin/services/${id}`);
    fetchList();
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Services</h2>
      <button onClick={openCreate} className="mb-4 px-3 py-1 bg-green-600 text-white rounded">Add Service</button>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 gap-4">
          {items.map(s => (
            <div key={s.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-bold">{s.title}</div>
                <div className="text-sm">{s.description?.slice(0,120)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(s)} className="px-2 py-1 border rounded">Edit</button>
                <button onClick={() => del(s.id)} className="px-2 py-1 border rounded text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <form onSubmit={submit} className="max-w-md bg-white p-4 rounded shadow">
          <h3 className="mb-2">{editing ? 'Edit Service' : 'Add Service'}</h3>
          <input value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Title" className="w-full mb-2 p-2 border rounded" />
          <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Description" className="w-full mb-2 p-2 border rounded" />
          <input type="file" onChange={e=>setForm({...form, image: e.target.files[0]})} className="mb-2" />
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded">{editing ? 'Save' : 'Create'}</button>
            {editing && <button type="button" onClick={()=>{ setEditing(null); setForm({title:'',description:'',image:null})}} className="px-3 py-1 border rounded">Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
