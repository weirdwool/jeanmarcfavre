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
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryFolder, setGalleryFolder] = useState<FileList | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;
  const [deleting, setDeleting] = useState(false);

  // Load posts on mount and check auth
  useEffect(() => {
    if (!checkAuth()) {
      return;
    }
    loadPosts();
  }, []);

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
    setShowForm(true);
  };

  const handleNew = () => {
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

    if (!formData.main_image.trim()) {
      setMessage({ type: 'error', text: 'L\'image principale est obligatoire' });
      return;
    }

    setSaving(true);
    setMessage(null);

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
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || error.error || 'Erreur lors de la sauvegarde' });
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        setMessage({ type: 'success', text: editingPost ? 'Article modifié avec succès!' : 'Article créé avec succès!' });
        setShowForm(false);
        setEditingPost(null);
        await loadPosts();
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
      } else {
        setMessage({ type: 'error', text: result.message || result.error || 'Erreur lors de la sauvegarde' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadGallery = async () => {
    if (!galleryFolder || galleryFolder.length === 0) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un dossier' });
      return;
    }

    setUploadingGallery(true);
    setMessage(null);

    try {
      // Always generate gallery name from form date and title (like image uploads)
      const files: File[] = Array.from(galleryFolder);
      
      // Generate gallery name from date and title
      const date = new Date(formData.pubDate);
      const year = String(date.getFullYear()).slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      // Get base name from title, preserving case
      let titleSlug = formData.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents but keep case
        .replace(/[^a-zA-Z0-9-]+/g, '-') // Keep letters (both cases), numbers, and hyphens
        .replace(/(^-|-$)/g, '')
        .substring(0, 30);
      
      const galleryName = `${year}${month}${day}-${titleSlug}`;

      // Create FormData with all files
      const uploadFormData = new FormData();
      uploadFormData.append('galleryName', galleryName);
      files.forEach((file) => {
        // Preserve relative path structure
        const relativePath = (file as any).webkitRelativePath || file.name;
        uploadFormData.append('files', file, relativePath);
      });

      const response = await fetch('/api/upload-gallery', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Erreur lors du téléversement' });
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        // Auto-fill the gallery URL
        setFormData(prev => ({
          ...prev,
          gallery_url: `/blog/blog-galeries/${galleryName}/index.html`,
        }));
        setMessage({ type: 'success', text: `Galerie téléversée avec succès! URL: /blog/blog-galeries/${galleryName}/index.html` });
        setGalleryFolder(null);
      } else {
        setMessage({ type: 'error', text: result.message || 'Erreur lors du téléversement' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' });
    } finally {
      setUploadingGallery(false);
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
        setMessage({ type: 'success', text: 'Article supprimé avec succès' });
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
              <label className="form-label required">Date de publication</label>
              <input
                type="date"
                value={formData.pubDate}
                onChange={(e) => setFormData({ ...formData, pubDate: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Lieu</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Image principale</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={formData.main_image}
                    onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                    placeholder="/blog/blog-images/..."
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="btn btn-secondary" style={{ margin: 0 }}>
                    📷 Téléverser une image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        if (!formData.pubDate) {
                          setMessage({ type: 'error', text: 'Veuillez d\'abord sélectionner une date de publication' });
                          return;
                        }

                        setUploadingImage(true);
                        setMessage(null);

                        try {
                          const uploadFormData = new FormData();
                          uploadFormData.append('file', file);
                          uploadFormData.append('date', formData.pubDate);

                          const response = await fetch('/api/upload-blog-image', {
                            method: 'POST',
                            body: uploadFormData,
                          });

                          if (!response.ok) {
                            const error = await response.json();
                            setMessage({ type: 'error', text: error.message || 'Erreur lors du téléversement' });
                            return;
                          }

                          const result = await response.json();
                          
                          if (result.success) {
                            // Auto-fill the image path
                            setFormData(prev => ({
                              ...prev,
                              main_image: result.path,
                            }));
                            setMessage({ type: 'success', text: `Image téléversée avec succès: ${result.filename}` });
                          } else {
                            setMessage({ type: 'error', text: result.message || 'Erreur lors du téléversement' });
                          }
                        } catch (error: any) {
                          console.error('Upload error:', error);
                          setMessage({ 
                            type: 'error', 
                            text: error.message || 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.' 
                          });
                        } finally {
                          setUploadingImage(false);
                          // Reset the input so the same file can be selected again if needed
                          e.target.value = '';
                        }
                      }}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>
              {uploadingImage && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  Téléversement en cours...
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Galerie Lightroom</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={formData.gallery_url}
                    onChange={(e) => setFormData({ ...formData, gallery_url: e.target.value })}
                    placeholder="/blog/blog-galeries/..."
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="btn btn-secondary" style={{ margin: 0 }}>
                    📁 Téléverser un dossier
                    <input
                      type="file"
                      {...({ webkitdirectory: '', directory: '' } as any)}
                      multiple
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setGalleryFolder(e.target.files);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              {galleryFolder && (
                <div className="gallery-upload-section">
                  <p className="gallery-upload-info">
                    {galleryFolder.length} fichiers sélectionnés
                  </p>
                  <button
                    onClick={handleUploadGallery}
                    disabled={uploadingGallery}
                    className="btn btn-success"
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                  >
                    {uploadingGallery ? 'Téléversement...' : 'Téléverser la galerie'}
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">URL Vidéo Vimeo</label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://vimeo.com/..."
                className="form-input"
              />
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
                  setShowForm(false);
                  setEditingPost(null);
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
            <h2>Articles ({posts.length})</h2>
            <button onClick={handleNew} className="btn btn-primary">
              + Nouvel article
            </button>
          </div>
          <div className="posts-grid">
            {posts
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
            ))}
          </div>
          {posts.length > postsPerPage && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                &lt;
              </button>
              <span className="pagination-info">
                Page {currentPage} sur {Math.ceil(posts.length / postsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage((prev: number) => Math.min(Math.ceil(posts.length / postsPerPage), prev + 1))}
                disabled={currentPage >= Math.ceil(posts.length / postsPerPage)}
                className="pagination-btn"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
