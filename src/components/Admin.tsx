import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  slug: string;
  title: string;
  pubDate: string;
  location: string;
  main_image: string;
  gallery_url: string;
  video_url: string;
  tags: Record<string, boolean>;
  body: string;
}

interface BlogPostFormData {
  title: string;
  pubDate: string;
  location: string;
  main_image: string;
  gallery_url: string;
  video_url: string;
  tags: Record<string, boolean>;
  body: string;
}

const ALL_TAGS = [
  { key: 'video', label: 'Vidéo' },
  { key: 'photo', label: 'Photo' },
  { key: 'drone', label: 'Drone' },
  { key: 'événementiel', label: 'Événementiel' },
  { key: 'studio', label: 'Studio' },
  { key: 'immobilier', label: 'Immobilier' },
  { key: 'industriel', label: 'Industriel' },
  { key: 'tourisme', label: 'Tourisme' },
  { key: 'voyage', label: 'Voyage' },
  { key: 'paysage', label: 'Paysage' },
  { key: 'sports', label: 'Sports' },
  { key: 'associatif', label: 'Associatif' },
  { key: 'divers', label: 'Divers' },
  { key: 'culture', label: 'Culture' },
  { key: 'gastronomie', label: 'Gastronomie' },
  { key: 'musique', label: 'Musique' },
];

// Check authentication on component mount
const checkAuth = () => {
  // Check sessionStorage first (client-side)
  const sessionAuth = sessionStorage.getItem('admin_auth');
  if (!sessionAuth) {
    // Redirect to login if not authenticated
    window.location.href = '/admin-login';
    return false;
  }
  return true;
};

export default function Admin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    pubDate: new Date().toISOString().split('T')[0],
    location: '',
    main_image: '',
    gallery_url: '',
    video_url: '',
    tags: {},
    body: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [galleryFolder, setGalleryFolder] = useState<FileList | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableImages, setAvailableImages] = useState<Array<{ filename: string; path: string }>>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  // Load posts and images on mount and check auth
  useEffect(() => {
    if (!checkAuth()) {
      return;
    }
    loadPosts();
    loadAvailableImages();
  }, []);

  const loadAvailableImages = async () => {
    try {
      setLoadingImages(true);
      const response = await fetch('/api/list-blog-images');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAvailableImages(data.images || []);
        }
      }
    } catch (error) {
      console.error('Error loading available images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog-posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors du chargement des articles' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    // Cleanup preview URL if exists
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    
    setEditingPost(post);
    setFormData({
      title: post.title,
      pubDate: post.pubDate.split('T')[0],
      location: post.location || '',
      main_image: post.main_image || '',
      gallery_url: post.gallery_url || '',
      video_url: post.video_url || '',
      tags: post.tags || {},
      body: post.body || '',
    });
    setSelectedImageFile(null);
    setGalleryFolder(null);
    setShowForm(true);
  };

  const handleNew = () => {
    // Cleanup preview URL if exists
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    
    setEditingPost(null);
    setFormData({
      title: '',
      pubDate: new Date().toISOString().split('T')[0],
      location: '',
      main_image: '',
      gallery_url: '',
      video_url: '',
      tags: {},
      body: '',
    });
    setSelectedImageFile(null);
    setGalleryFolder(null);
    setShowForm(true);
  };

  const handleTagChange = (tagKey: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tags: {
        ...prev.tags,
        [tagKey]: checked,
      },
    }));
  };

  // Helper function to normalize strings for accent-insensitive search
  const normalizeForSearch = (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove accents
  };

  const generateSlug = (title: string, date: string): string => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${year}-${month}-${day}-${slug}`;
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Le titre est obligatoire' });
      return;
    }

    if (!formData.pubDate) {
      setMessage({ type: 'error', text: 'La date est obligatoire' });
      return;
    }

    if (!formData.location.trim()) {
      setMessage({ type: 'error', text: 'Le lieu est obligatoire' });
      return;
    }

    // Upload image if a new one was selected
    if (selectedImageFile) {
      try {
        setMessage({ type: 'success', text: 'Téléversement de l\'image en cours...' });
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedImageFile);

        const imageResponse = await fetch('/api/upload-blog-image', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!imageResponse.ok) {
          let errorMessage = 'Erreur lors du téléversement de l\'image';
          try {
            const contentType = imageResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const error = await imageResponse.json();
              errorMessage = error.message || errorMessage;
            } else {
              const errorText = await imageResponse.text();
              errorMessage = errorText || `HTTP ${imageResponse.status}: ${imageResponse.statusText}`;
            }
          } catch (e) {
            errorMessage = `HTTP ${imageResponse.status}: ${imageResponse.statusText}`;
          }
          setMessage({ type: 'error', text: errorMessage });
          return;
        }

        const imageResult = await imageResponse.json();
        if (imageResult.success) {
          setFormData(prev => ({
            ...prev,
            main_image: imageResult.path,
          }));
        } else {
          setMessage({ type: 'error', text: imageResult.message || 'Erreur lors du téléversement de l\'image' });
          return;
        }
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message || 'Erreur de connexion lors du téléversement de l\'image' });
        return;
      }
    }

    if (!formData.main_image.trim()) {
      setMessage({ type: 'error', text: 'L\'image principale est obligatoire' });
      return;
    }

    // Gallery is now handled manually - just construct the path if gallery_url is set
    // No upload needed, user uploads manually to GitHub

    setSaving(true);
    setMessage({ type: 'success', text: 'Sauvegarde en cours...' });

    try {
      const slug = editingPost ? editingPost.slug : generateSlug(formData.title, formData.pubDate);
      
      const response = await fetch('/api/blog-posts', {
        method: editingPost ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          ...formData,
          pubDate: new Date(formData.pubDate).toISOString(),
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la sauvegarde';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.message || error.error || errorMessage;
          } else {
            const errorText = await response.text();
            errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
            // If it's a 403, provide a more helpful message
            if (response.status === 403) {
              errorMessage = 'Accès refusé. Le token GitHub n\'a peut-être pas les permissions nécessaires ou a expiré.';
            }
          }
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          if (response.status === 403) {
            errorMessage = 'Accès refusé. Le token GitHub n\'a peut-être pas les permissions nécessaires ou a expiré.';
          }
        }
        setMessage({ type: 'error', text: errorMessage });
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        // Cleanup preview URL
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
          setImagePreviewUrl(null);
        }
        
        setMessage({ type: 'success', text: (editingPost ? 'Article modifié avec succès!' : 'Article créé avec succès!') + ' Attendre quelques minutes pour le déploiement.' });
        setShowForm(false);
        setEditingPost(null);
        setSelectedImageFile(null);
        setGalleryFolder(null);
        await loadPosts();
        await loadAvailableImages(); // Reload images after upload
      } else if (result.markdown) {
        // File write not available - provide download option
        const blob = new Blob([result.markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessage({ 
          type: 'success', 
          text: 'Fichier téléchargé! Veuillez le placer dans src/content/blog/ et commiter les changements.' 
        });
        setShowForm(false);
        setEditingPost(null);
        setSelectedImageFile(null);
        setGalleryFolder(null);
      } else {
        setMessage({ type: 'error', text: result.message || result.error || 'Erreur lors de la sauvegarde' });
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Erreur de connexion';
      setMessage({ type: 'error', text: `Erreur: ${errorMessage}` });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      // Clear session storage
      sessionStorage.removeItem('admin_auth');
      // Redirect to login
      window.location.href = '/admin-login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Still redirect even if API call fails
      sessionStorage.removeItem('admin_auth');
      window.location.href = '/admin-login';
    }
  };

  const handleDelete = async () => {
    if (!editingPost) return;

    // First confirmation
    const firstConfirm = window.confirm(
      `Êtes-vous sûr de vouloir supprimer l'article "${editingPost.title}" ?`
    );
    if (!firstConfirm) return;

    // Second confirmation
    const secondConfirm = window.confirm(
      'Cette action est irréversible. Confirmez-vous la suppression ?'
    );
    if (!secondConfirm) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/blog-posts/${editingPost.slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Article supprimé avec succès. Attendre quelques minutes pour le déploiement.' });
        setShowForm(false);
        setEditingPost(null);
        // Reload posts
        loadPosts();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erreur lors de la suppression' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-title-bar">
        <h1 className="admin-title">Administration du Blog</h1>
        <button onClick={handleLogout} className="btn btn-logout">
          Déconnexion
        </button>
      </div>

      {message && (
        <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
          {message.text}
        </div>
      )}

      {showForm ? (
        <div className="admin-form-container">
          <h2>{editingPost ? 'Modifier l\'article' : 'Nouvel article'}</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label required">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label required">Date de publication</label>
                  <input
                    type="date"
                    value={formData.pubDate}
                    onChange={(e) => setFormData({ ...formData, pubDate: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label required">Lieu</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Image principale</label>
              <div style={{ 
                background: '#f9fafb',
                borderRadius: '6px',
                border: '2px solid #e5e7eb',
                padding: '1rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Choisir image existante</label>
                    <select
                      value={formData.main_image}
                      onChange={(e) => {
                        const selectedPath = e.target.value;
                        if (selectedPath) {
                          setFormData(prev => ({ ...prev, main_image: selectedPath }));
                          setSelectedImageFile(null);
                          // Cleanup preview URL if it was from a file upload
                          if (imagePreviewUrl) {
                            URL.revokeObjectURL(imagePreviewUrl);
                            setImagePreviewUrl(null);
                          }
                        } else {
                          setFormData(prev => ({ ...prev, main_image: '' }));
                        }
                      }}
                      className="form-input"
                      style={{ width: '100%' }}
                      disabled={saving || loadingImages}
                    >
                      <option value="">-- Choisir une image --</option>
                      {availableImages.map((img) => (
                        <option key={img.path} value={img.path}>
                          {img.filename}
                        </option>
                      ))}
                    </select>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                      💡 Choisir une image déjà dans le dossier blog/blog-images de GitHub
                    </p>
                    {loadingImages && (
                      <p style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                        Chargement des images...
                      </p>
                    )}
                  </div>
                  <div style={{ 
                    width: '1px', 
                    backgroundColor: '#e5e7eb', 
                    height: '100%', 
                    minHeight: '60px',
                    alignSelf: 'stretch'
                  }}></div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Ajouter une nouvelle image</label>
                    <label className="btn btn-success" style={{ margin: 0, marginBottom: '0.5rem', display: 'block' }}>
                      📷 Téléverser une nouvelle image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          // Check file size
                          const maxSizeBytes = 1.5 * 1024 * 1024; // 1.5MB
                          if (file.size > maxSizeBytes) {
                            const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
                            setMessage({ 
                              type: 'error', 
                              text: `Le fichier est trop volumineux (${fileSizeMB}MB). La taille maximale est de 1.5MB.` 
                            });
                            e.target.value = '';
                            return;
                          }

                          // Cleanup previous preview URL
                          if (imagePreviewUrl) {
                            URL.revokeObjectURL(imagePreviewUrl);
                          }
                          
                          setSelectedImageFile(file);
                          // Create preview URL
                          const previewUrl = URL.createObjectURL(file);
                          setImagePreviewUrl(previewUrl);
                          
                          // Auto-generate path
                          const path = `/blog/blog-images/${file.name}`;
                          setFormData(prev => ({ ...prev, main_image: path }));
                          setMessage({ type: 'success', text: `Image sélectionnée: ${file.name}. Elle sera téléversée lors de l'enregistrement.` });
                          e.target.value = '';
                        }}
                        style={{ display: 'none' }}
                        disabled={saving}
                      />
                    </label>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                      ⚠️ Taille maximale : 1.5MB. Les images doivent être optimisées avant le téléversement.
                    </p>
                  </div>
                </div>
                {formData.main_image && (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                    {formData.main_image}
                  </p>
                )}
                {imagePreviewUrl && selectedImageFile && (
                  <div style={{ marginTop: '1rem' }}>
                    <img 
                      src={imagePreviewUrl} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '4px'
                      }} 
                    />
                  </div>
                )}
                {formData.main_image && !selectedImageFile && (
                  <div style={{ marginTop: '1rem' }}>
                    <img 
                      src={formData.main_image} 
                      alt="Current image" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '4px'
                      }}
                      onError={(e) => {
                        // Hide broken images
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <div style={{ 
                background: '#f9fafb',
                borderRadius: '6px',
                border: '2px solid #e5e7eb',
                padding: '1rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    <label className="form-label">Galerie Lightroom</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>/blog/blog-galeries/</span>
                      <input
                        type="text"
                        value={formData.gallery_url ? formData.gallery_url.replace('/blog/blog-galeries/', '').replace('/index.html', '') : ''}
                        onChange={(e) => {
                          const folderName = e.target.value.trim();
                          if (folderName) {
                            setFormData(prev => ({ 
                              ...prev, 
                              gallery_url: `/blog/blog-galeries/${folderName}/index.html` 
                            }));
                          } else {
                            setFormData(prev => ({ ...prev, gallery_url: '' }));
                          }
                        }}
                        placeholder="nom-du-dossier"
                        className="form-input"
                        style={{ flex: 1 }}
                        disabled={saving}
                      />
                      <span style={{ fontSize: '0.9rem', color: '#666' }}>/index.html</span>
                    </div>
                    <a 
                      href="https://github.com/weirdwool/jeanmarcfavre/tree/main/public/blog/blog-galeries" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-success" 
                      style={{ marginTop: '0.5rem', display: 'inline-block' }}
                    >
                      Ouvrir le dossier des galeries sur GitHub
                    </a>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                      💡 Entrez uniquement le nom du dossier (ex: 251228-margara-expo). Le dossier doit être uploadé manuellement sur GitHub dans public/blog/blog-galeries/
                    </p>
                    {formData.gallery_url && (
                      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                        Chemin complet : {formData.gallery_url}
                      </p>
                    )}
                  </div>
                  <div style={{ 
                    width: '1px', 
                    backgroundColor: '#e5e7eb', 
                    height: '100%', 
                    minHeight: '60px',
                    alignSelf: 'stretch'
                  }}></div>
                  <div>
                    <label className="form-label">URL Vidéo Vimeo</label>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://vimeo.com/..."
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="tags-grid">
                {ALL_TAGS.map(tag => (
                  <label key={tag.key} className="tag-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.tags[tag.key] || false}
                      onChange={(e) => handleTagChange(tag.key, e.target.checked)}
                    />
                    <span>{tag.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contenu</label>
              <div className="markdown-editor-container">
                <div className="markdown-editor-left">
                  <div className="markdown-toolbar">
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.querySelector('.form-textarea') as HTMLTextAreaElement;
                        if (!textarea) return;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = formData.body.substring(start, end);
                        const newText = formData.body.substring(0, start) + `**${selectedText || 'texte en gras'}**` + formData.body.substring(end);
                        setFormData({ ...formData, body: newText });
                        setTimeout(() => {
                          textarea.focus();
                          const newPos = start + (selectedText ? 2 : 12);
                          textarea.setSelectionRange(newPos, newPos + (selectedText ? selectedText.length : 0));
                        }, 0);
                      }}
                      className="toolbar-btn"
                      title="Gras"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.querySelector('.form-textarea') as HTMLTextAreaElement;
                        if (!textarea) return;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = formData.body.substring(start, end);
                        const newText = formData.body.substring(0, start) + `*${selectedText || 'texte en italique'}*` + formData.body.substring(end);
                        setFormData({ ...formData, body: newText });
                        setTimeout(() => {
                          textarea.focus();
                          const newPos = start + (selectedText ? 1 : 18);
                          textarea.setSelectionRange(newPos, newPos + (selectedText ? selectedText.length : 0));
                        }, 0);
                      }}
                      className="toolbar-btn"
                      title="Italique"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.querySelector('.form-textarea') as HTMLTextAreaElement;
                        if (!textarea) return;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = formData.body.substring(start, end);
                        const newText = formData.body.substring(0, start) + `[${selectedText || 'texte du lien'}](url)` + formData.body.substring(end);
                        setFormData({ ...formData, body: newText });
                        setTimeout(() => {
                          textarea.focus();
                          const newPos = start + (selectedText ? selectedText.length + 1 : 19);
                          textarea.setSelectionRange(newPos, newPos + 3);
                        }, 0);
                      }}
                      className="toolbar-btn"
                      title="Lien"
                    >
                      🔗
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.querySelector('.form-textarea') as HTMLTextAreaElement;
                        if (!textarea) return;
                        const start = textarea.selectionStart;
                        const newText = formData.body.substring(0, start) + '\n\n---\n\n' + formData.body.substring(start);
                        setFormData({ ...formData, body: newText });
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + 5, start + 5);
                        }, 0);
                      }}
                      className="toolbar-btn"
                      title="Séparateur"
                    >
                      ─
                    </button>
                  </div>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    rows={10}
                    className="form-textarea"
                    placeholder="Écrivez votre contenu en markdown ici..."
                  />
                </div>
                <div className="markdown-preview">
                  <div className="markdown-preview-header">Aperçu</div>
                  <div className="markdown-preview-content">
                    <ReactMarkdown>{formData.body || '*Aperçu du contenu apparaîtra ici...*'}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <div className="form-actions-left">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-success"
              >
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
              <button
                onClick={() => {
                  // Cleanup preview URL if exists
                  if (imagePreviewUrl) {
                    URL.revokeObjectURL(imagePreviewUrl);
                    setImagePreviewUrl(null);
                  }
                  
                  setShowForm(false);
                  setEditingPost(null);
                  setSelectedImageFile(null);
                  setGalleryFolder(null);
                  setMessage(null);
                }}
                className="btn btn-secondary"
              >
                Annuler
              </button>
            </div>
            {editingPost && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn btn-delete"
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="posts-list">
          <div className="posts-list-header">
            <h2>
              Articles ({(() => {
                const filteredPosts = searchQuery.trim() 
                  ? posts.filter(post => {
                      const normalizedQuery = normalizeForSearch(searchQuery);
                      return normalizeForSearch(post.title).includes(normalizedQuery);
                    })
                  : posts;
                return filteredPosts.length;
              })()}{searchQuery.trim() ? ` / ${posts.length}` : ''})
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            <button onClick={handleNew} className="btn btn-primary">
              + Nouvel article
            </button>
          </div>
          <div className="posts-grid">
            {(() => {
              // Filter posts based on search query (accent-insensitive)
              const filteredPosts = searchQuery.trim() 
                ? posts.filter(post => {
                    const normalizedQuery = normalizeForSearch(searchQuery);
                    return normalizeForSearch(post.title).includes(normalizedQuery);
                  })
                : posts;
              
              return filteredPosts
                .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                .map(post => (
              <div key={post.slug} className="post-card" onClick={() => handleEdit(post)}>
                {post.main_image ? (
                  <img 
                    src={post.main_image} 
                    alt={post.title}
                    className="post-card-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const placeholder = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="post-card-image-placeholder"
                  style={{ display: post.main_image ? 'none' : 'flex' }}
                >
                  Pas d'image
                </div>
                <div className="post-card-content">
                  <h3>{post.title}</h3>
                  <p className="post-card-meta">
                    {formatDate(post.pubDate)}
                    {post.location && ` • ${post.location}`}
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(post);
                  }} 
                  className="btn-edit"
                >
                  Modifier
                </button>
              </div>
            ));
            })()}
          </div>
          {(() => {
            const filteredPosts = searchQuery.trim() 
              ? posts.filter(post => {
                  const normalizedQuery = normalizeForSearch(searchQuery);
                  return normalizeForSearch(post.title).includes(normalizedQuery);
                })
              : posts;
            
            return filteredPosts.length > postsPerPage && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  &lt;
                </button>
                <span className="pagination-info">
                  Page {currentPage} sur {Math.ceil(filteredPosts.length / postsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage((prev: number) => Math.min(Math.ceil(filteredPosts.length / postsPerPage), prev + 1))}
                  disabled={currentPage >= Math.ceil(filteredPosts.length / postsPerPage)}
                  className="pagination-btn"
                >
                  &gt;
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
