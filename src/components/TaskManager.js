"use client";
import { useEffect, useState } from 'react';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load tasks.');
        setLoading(false);
      });
  }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setError(null);
      const res = await fetch('/api/tasks', {
        method: 'POST', body: JSON.stringify({ title })
      });
      if (!res.ok) throw new Error();
      setTasks([...tasks, await res.json()]);
      setTitle('');
    } catch {
      setError('Failed to add task.');
    }
  };

  const toggle = async (id, completed) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH', body: JSON.stringify({ completed: !completed })
      });
      if (!res.ok) throw new Error();
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
    } catch {
      setError('Failed to update task.');
    }
  };

  const remove = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setTasks(tasks.filter(t => t.id !== id));
    } catch {
      setError('Failed to delete task.');
    }
  };

  const rename = async (id, oldTitle) => {
    const newTitle = prompt('Edit task:', oldTitle);
    if (!newTitle || !newTitle.trim() || newTitle === oldTitle) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH', body: JSON.stringify({ title: newTitle.trim() })
      });
      if (!res.ok) throw new Error();
      setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle.trim() } : t));
    } catch {
      setError('Failed to update task title.');
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'ongoing') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>Tasks</h1>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
      <div className="filters">
        <button 
          className={`filter ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}>
          All
        </button>
        <button 
          className={`filter ${filter === 'ongoing' ? 'active' : ''}`}
          onClick={() => setFilter('ongoing')}>
          Ongoing
        </button>
        <button 
          className={`filter ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}>
          Completed
        </button>
      </div>

      <form onSubmit={add}>
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="New task..." 
          disabled={loading}
        />
      </form>
      
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {filteredTasks.map(t => (
            <li key={t.id} className={t.completed ? 'completed' : ''}>
              <input 
                type="checkbox" 
                checked={t.completed} 
                onChange={() => toggle(t.id, t.completed)} 
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span 
                  onDoubleClick={() => rename(t.id, t.title)}
                  title="Double click to edit"
                  style={{ cursor: 'text' }}
                >
                  {t.title}
                </span>
                <span style={{ fontSize: '1rem', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                  {new Date(t.createdAt).toLocaleString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <button className="delete" onClick={() => remove(t.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
