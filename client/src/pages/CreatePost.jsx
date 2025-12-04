import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ FIXED: Import from the correct services folder
import api from '../services/api.js'; 
import AuthContext from '../context/AuthContext.jsx';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirect, setRedirect] = useState(false);
  
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // api.js handles the full URL now
        const response = await api.get('/categories');
        if (response.data.success && response.data.data.length > 0) {
          setCategories(response.data.data);
          setSelectedCategory(response.data.data[0]._id);
        } else { 
            console.error('No categories found'); 
        }
      } catch (err) { 
          console.error('Failed to fetch categories:', err); 
      } finally { 
          setLoadingCategories(false); 
      }
    };
    fetchCategories();
  }, []); 

  useEffect(() => {
    if (redirect) {
      navigate('/'); 
    }
  }, [redirect, navigate]); 

  async function createNewPost() {
    if (loadingCategories || !selectedCategory) {
      alert('Please select a category.');
      return;
    }
    if (!userInfo || !userInfo.token) {
        alert('You must be logged in to create a post.');
        navigate('/login');
        return;
    }
    
    setIsSubmitting(true);

    // 1. Package data
    const data = new FormData();
    data.set('title', title);
    data.set('content', content);
    data.set('category', selectedCategory); 
    
    if (file) {
      data.set('file', file);
    }

    try {
      // 2. Send data
      // Note: We don't need manual config for headers anymore; 
      // the api.js interceptor handles the token automatically!
      const response = await api.post('/posts', data); 

      if (response.status === 201) {
        setRedirect(true);
      } else {
        alert('Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      if (error.response?.status === 401) {
          alert('Authorization failed. Please log in again.');
          navigate('/login');
      } else {
          alert('An error occurred. Check the console.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', border: '1px solid #3b9eff', background: 'rgba(10, 25, 47, 0.9)', borderRadius: '8px', boxShadow: '0 0 15px rgba(59, 158, 255, 0.5)' }}>
      <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px', color: '#f7c800' }}>
        Create a New Blog Post 
      </h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', color: '#e6f1ff' }}>
            Post Title
          </label>
          <input id="title" type="text" placeholder="A compelling title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #3b9eff', background: '#1e3a5f', color: '#e6f1ff', borderRadius: '5px' }} required />
        </div>

        <div>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '5px', color: '#e6f1ff' }}>
            Category
          </label>
          <select id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #3b9eff', background: '#1e3a5f', color: '#e6f1ff', borderRadius: '5px' }} required >
            <option value="" disabled>Select a category</option>
            {loadingCategories ? ( <option disabled>Loading...</option> ) : (
              categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label htmlFor="cover-image" style={{ display: 'block', marginBottom: '5px', color: '#e6f1ff' }}>
            Cover Image
          </label>
          <input id="cover-image" type="file" onChange={e => setFile(e.target.files[0])} style={{ width: '100%', padding: '10px', border: '1px solid #3b9eff', background: '#1e3a5f', color: '#e6f1ff', borderRadius: '5px' }} />
          {file && <p style={{ fontSize: '12px', marginTop: '5px', color: '#e6f1ff' }}>Selected file: {file.name}</p>}
        </div>

        <div>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px', color: '#e6f1ff' }}>
            Post Content
          </label>
          <textarea id="content" placeholder="Write your main article..." value={content} onChange={e => setContent(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #3b9eff', background: '#1e3a5f', color: '#e6f1ff', borderRadius: '5px', minHeight: '200px' }} required />
        </div>

        <button 
          type="button"
          onClick={createNewPost}
          disabled={isSubmitting}
          style={{ 
            padding: '10px', 
            backgroundColor: isSubmitting ? '#1e3a5f' : '#3b9eff', 
            color: isSubmitting ? '#e6f1ff' : '#0a192f', 
            border: 'none', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}