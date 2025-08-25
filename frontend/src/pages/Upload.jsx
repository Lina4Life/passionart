import React, { useState } from 'react';
import { uploadArtwork } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const Upload = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [keywords, setKeywords] = useState('');
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const [uploading, setUploading] = useState(false);
	const navigate = useNavigate();
	const { toast, showToast, clearToast } = useToast();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		if (file) {
			setPreview(URL.createObjectURL(file));
		} else {
			setPreview(null);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUploading(true);
		clearToast();
		const formData = new FormData();
		formData.append('title', title);
		formData.append('description', description);
		formData.append('keywords', keywords);
		formData.append('image', image);
		try {
			await uploadArtwork(formData);
			showToast({ type: 'success', message: 'Uploaded!' });
			setTimeout(() => navigate('/'), 1200);
		} catch (err) {
			showToast({ type: 'error', message: 'Upload failed (are you logged in?)' });
		} finally {
			setUploading(false);
		}
	};

	return (
		<div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8 }}>
			<h2>Upload Artwork</h2>
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				<input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
				<textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
				<input type="text" placeholder="Keywords" value={keywords} onChange={e => setKeywords(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
				<input type="file" accept="image/*" onChange={handleImageChange} required style={{ width: '100%', marginBottom: 12 }} />
				{preview && <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 6, marginBottom: 12 }} />}
				<button type="submit" disabled={uploading} style={{ width: '100%', padding: 10, background: uploading ? '#ccc' : '#0077ff', color: '#fff', border: 'none', borderRadius: 4 }}>
					{uploading ? 'Uploading...' : 'Upload'}
				</button>
			</form>
			<Toast type={toast.type} message={toast.message} onClose={clearToast} />
		</div>
	);
};

export default Upload;
