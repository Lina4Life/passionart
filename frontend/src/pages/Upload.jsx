import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

const Upload = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [keywords, setKeywords] = useState('');
	const [category, setCategory] = useState('');
	const [images, setImages] = useState([]);
	const [previews, setPreviews] = useState([]);
	const [dragActive, setDragActive] = useState(false);
	const [errors, setErrors] = useState({});
	const fileInputRef = useRef(null);
	const navigate = useNavigate();
	const { toast, showToast, clearToast } = useToast();

	const categories = [
		{ value: 'digital', label: 'Digital Art' },
		{ value: 'painting', label: 'Painting' },
		{ value: 'photography', label: 'Photography' },
		{ value: 'sculpture', label: 'Sculpture' },
		{ value: 'drawing', label: 'Drawing' },
		{ value: 'mixed', label: 'Mixed Media' },
		{ value: 'animation', label: 'Animation' },
		{ value: 'graphic', label: 'Graphic Design' }
	];

	const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
	const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
	const MAX_FILES = 5;

	const validateFiles = (files) => {
		const newErrors = {};
		const validFiles = [];

		if (files.length > MAX_FILES) {
			newErrors.files = `Maximum ${MAX_FILES} files allowed`;
			return { errors: newErrors, validFiles };
		}

		for (let file of files) {
			if (!ALLOWED_TYPES.includes(file.type)) {
				newErrors.files = 'Only JPEG, PNG, GIF, and WebP files are allowed';
				continue;
			}
			if (file.size > MAX_FILE_SIZE) {
				newErrors.files = `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
				continue;
			}
			validFiles.push(file);
		}

		return { errors: newErrors, validFiles };
	};

	const handleFileChange = (files) => {
		const { errors: fileErrors, validFiles } = validateFiles(Array.from(files));
		
		if (Object.keys(fileErrors).length > 0) {
			setErrors(prev => ({ ...prev, ...fileErrors }));
			return;
		}

		setErrors(prev => ({ ...prev, files: undefined }));
		setImages(validFiles);
		
		// Create previews
		const newPreviews = validFiles.map(file => ({
			file,
			url: URL.createObjectURL(file),
			name: file.name
		}));
		setPreviews(newPreviews);
	};

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true);
		} else if (e.type === 'dragleave') {
			setDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFileChange(e.dataTransfer.files);
		}
	};

	const removeImage = (index) => {
		const newImages = images.filter((_, i) => i !== index);
		const newPreviews = previews.filter((_, i) => i !== index);
		setImages(newImages);
		setPreviews(newPreviews);
	};

	const validateForm = () => {
		const newErrors = {};
		
		if (!title.trim()) newErrors.title = 'Title is required';
		if (!description.trim()) newErrors.description = 'Description is required';
		if (!category) newErrors.category = 'Category is required';
		if (images.length === 0) newErrors.files = 'At least one image is required';
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) {
			showToast({ type: 'error', message: 'Please fix the errors before submitting' });
			return;
		}

		// Instead of uploading directly, navigate to payment page with upload data
		const uploadData = {
			title,
			description,
			keywords,
			category,
			images
		};

		navigate('/payment', { 
			state: { uploadData } 
		});
	};

	return (
		<div style={{ 
			maxWidth: '800px', 
			margin: '2rem auto', 
			padding: 'var(--space-2xl)', 
			background: 'var(--bg-primary)',
			borderRadius: '12px',
			boxShadow: '0 4px 20px var(--shadow)',
			fontFamily: 'var(--font-primary)',
			border: '1px solid var(--border-color)'
		}}>
			<div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
				<h1 style={{ 
					fontSize: 'var(--font-size-3xl)', 
					fontWeight: '700',
					fontFamily: 'var(--font-display)',
					color: 'var(--text-primary)',
					marginBottom: 'var(--space-sm)',
					letterSpacing: '0.02em'
				}}>
					Upload Your Artwork
				</h1>
				<p style={{ 
					color: 'var(--text-muted)', 
					fontSize: 'var(--font-size-lg)',
					fontWeight: '400'
				}}>
					Share your creative masterpiece with the world
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				{/* Basic Information Section */}
				<div style={{ marginBottom: 'var(--space-2xl)' }}>
					<h3 style={{ 
						marginBottom: 'var(--space-lg)', 
						color: 'var(--text-primary)',
						fontFamily: 'var(--font-display)',
						fontSize: 'var(--font-size-xl)',
						fontWeight: '600'
					}}>
						Basic Information
					</h3>
					
					<div style={{ marginBottom: 'var(--space-lg)' }}>
						<label style={{ 
							display: 'block', 
							marginBottom: 'var(--space-sm)', 
							fontWeight: '600', 
							color: 'var(--text-primary)',
							fontSize: 'var(--font-size-base)'
						}}>
							Title *
						</label>
						<input 
							type="text" 
							placeholder="Enter artwork title" 
							value={title} 
							onChange={e => setTitle(e.target.value)}
							style={{ 
								width: '100%', 
								padding: 'var(--space-md)', 
								border: `2px solid ${errors.title ? '#ef4444' : 'var(--border-color)'}`,
								borderRadius: '8px',
								fontSize: 'var(--font-size-base)',
								fontFamily: 'var(--font-primary)',
								background: 'var(--bg-primary)',
								color: 'var(--text-primary)',
								transition: 'var(--transition)',
								outline: 'none'
							}}
							onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
							onBlur={(e) => e.target.style.borderColor = errors.title ? '#ef4444' : 'var(--border-color)'}
						/>
						{errors.title && <p style={{ color: '#ef4444', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-xs)' }}>{errors.title}</p>}
					</div>

					<div style={{ marginBottom: 'var(--space-lg)' }}>
						<label style={{ 
							display: 'block', 
							marginBottom: 'var(--space-sm)', 
							fontWeight: '600', 
							color: 'var(--text-primary)',
							fontSize: 'var(--font-size-base)'
						}}>
							Category *
						</label>
						<select
							value={category}
							onChange={e => setCategory(e.target.value)}
							style={{
								width: '100%',
								padding: 'var(--space-md)',
								border: `2px solid ${errors.category ? '#ef4444' : 'var(--border-color)'}`,
								borderRadius: '8px',
								fontSize: 'var(--font-size-base)',
								fontFamily: 'var(--font-primary)',
								backgroundColor: 'var(--bg-primary)',
								color: 'var(--text-primary)',
								cursor: 'pointer',
								outline: 'none',
								transition: 'var(--transition)'
							}}
						>
							<option value="">Select a category</option>
							{categories.map(cat => (
								<option key={cat.value} value={cat.value}>{cat.label}</option>
							))}
						</select>
						{errors.category && <p style={{ color: '#ef4444', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-xs)' }}>{errors.category}</p>}
					</div>

					<div style={{ marginBottom: 'var(--space-lg)' }}>
						<label style={{ 
							display: 'block', 
							marginBottom: 'var(--space-sm)', 
							fontWeight: '600', 
							color: 'var(--text-primary)',
							fontSize: 'var(--font-size-base)'
						}}>
							Description *
						</label>
						<textarea 
							placeholder="Describe your artwork, inspiration, techniques used..." 
							value={description} 
							onChange={e => setDescription(e.target.value)}
							rows={4}
							style={{ 
								width: '100%', 
								padding: 'var(--space-md)', 
								border: `2px solid ${errors.description ? '#ef4444' : 'var(--border-color)'}`,
								borderRadius: '8px',
								fontSize: 'var(--font-size-base)',
								fontFamily: 'var(--font-primary)',
								background: 'var(--bg-primary)',
								color: 'var(--text-primary)',
								resize: 'vertical',
								outline: 'none',
								transition: 'var(--transition)'
							}}
							onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
							onBlur={(e) => e.target.style.borderColor = errors.description ? '#ef4444' : 'var(--border-color)'}
						/>
						{errors.description && <p style={{ color: '#ef4444', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-xs)' }}>{errors.description}</p>}
					</div>

					<div style={{ marginBottom: 'var(--space-lg)' }}>
						<label style={{ 
							display: 'block', 
							marginBottom: 'var(--space-sm)', 
							fontWeight: '600', 
							color: 'var(--text-primary)',
							fontSize: 'var(--font-size-base)'
						}}>
							Keywords (Optional)
						</label>
						<input 
							type="text" 
							placeholder="portrait, digital, fantasy, colorful..." 
							value={keywords} 
							onChange={e => setKeywords(e.target.value)}
							style={{ 
								width: '100%', 
								padding: 'var(--space-md)', 
								border: '2px solid var(--border-color)',
								borderRadius: '8px',
								fontSize: 'var(--font-size-base)',
								fontFamily: 'var(--font-primary)',
								background: 'var(--bg-primary)',
								color: 'var(--text-primary)',
								outline: 'none',
								transition: 'var(--transition)'
							}}
							onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
							onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
						/>
						<p style={{ 
							color: 'var(--text-muted)', 
							fontSize: 'var(--font-size-sm)', 
							marginTop: 'var(--space-xs)' 
						}}>
							Separate keywords with commas to help people discover your art
						</p>
					</div>
				</div>
				{/* File Upload Section */}
				<div style={{ marginBottom: 'var(--space-2xl)' }}>
					<h3 style={{ 
						marginBottom: 'var(--space-lg)', 
						color: 'var(--text-primary)',
						fontFamily: 'var(--font-display)',
						fontSize: 'var(--font-size-xl)',
						fontWeight: '600'
					}}>
						Upload Images
					</h3>
					
					{/* Drag & Drop Zone */}
					<div
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current?.click()}
						style={{
							border: `3px dashed ${dragActive ? 'var(--accent-color)' : errors.files ? '#ef4444' : 'var(--border-color)'}`,
							borderRadius: '12px',
							padding: 'var(--space-3xl) var(--space-2xl)',
							textAlign: 'center',
							backgroundColor: dragActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
							cursor: 'pointer',
							transition: 'var(--transition)',
							marginBottom: 'var(--space-lg)'
						}}
					>
						<div style={{ 
							fontSize: '3rem', 
							marginBottom: 'var(--space-lg)',
							color: dragActive ? 'var(--accent-color)' : 'var(--text-muted)'
						}}>
							{dragActive ? '↓' : '↑'}
						</div>
						<h4 style={{ 
							marginBottom: 'var(--space-sm)', 
							color: 'var(--text-primary)',
							fontFamily: 'var(--font-display)',
							fontSize: 'var(--font-size-lg)',
							fontWeight: '600'
						}}>
							{dragActive ? 'Drop your files here!' : 'Drag & drop your images here'}
						</h4>
						<p style={{ 
							color: 'var(--text-muted)', 
							marginBottom: 'var(--space-lg)',
							fontSize: 'var(--font-size-base)'
						}}>
							or click to browse your files
						</p>
						<div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
							<p>Supported formats: JPEG, PNG, GIF, WebP</p>
							<p>Max file size: 10MB • Max files: {MAX_FILES}</p>
						</div>
					</div>

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						multiple
						onChange={(e) => handleFileChange(e.target.files)}
						style={{ display: 'none' }}
					/>

					{errors.files && <p style={{ color: '#ef4444', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-lg)' }}>{errors.files}</p>}

					{/* Image Previews */}
					{previews.length > 0 && (
						<div style={{ marginTop: 'var(--space-xl)' }}>
							<h4 style={{ 
								marginBottom: 'var(--space-lg)', 
								color: 'var(--text-primary)',
								fontFamily: 'var(--font-display)',
								fontSize: 'var(--font-size-lg)',
								fontWeight: '600'
							}}>
								Selected Images ({previews.length})
							</h4>
							<div style={{ 
								display: 'grid', 
								gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
								gap: 'var(--space-lg)' 
							}}>
								{previews.map((preview, index) => (
									<div key={index} style={{ 
										position: 'relative', 
										borderRadius: '8px', 
										overflow: 'hidden',
										boxShadow: '0 2px 8px var(--shadow)',
										border: '1px solid var(--border-color)'
									}}>
										<img 
											src={preview.url} 
											alt={preview.name}
											style={{ 
												width: '100%', 
												height: '150px', 
												objectFit: 'cover'
											}} 
										/>
										<button
											type="button"
											onClick={() => removeImage(index)}
											style={{
												position: 'absolute',
												top: 'var(--space-sm)',
												right: 'var(--space-sm)',
												backgroundColor: 'rgba(0,0,0,0.7)',
												color: 'white',
												border: 'none',
												borderRadius: '50%',
												width: '24px',
												height: '24px',
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												fontSize: 'var(--font-size-sm)',
												fontWeight: 'bold'
											}}
										>
											×
										</button>
										<div style={{
											position: 'absolute',
											bottom: 0,
											left: 0,
											right: 0,
											backgroundColor: 'rgba(0,0,0,0.7)',
											color: 'white',
											padding: 'var(--space-sm)',
											fontSize: 'var(--font-size-xs)',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap'
										}}>
											{preview.name}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Submit Button */}
				<button 
					type="submit" 
					disabled={images.length === 0}
					style={{ 
						width: '100%', 
						padding: 'var(--space-lg) var(--space-2xl)', 
						background: images.length === 0 
							? 'var(--bg-secondary)' 
							: 'var(--accent-color)',
						color: images.length === 0 ? 'var(--text-muted)' : 'var(--bg-primary)',
						border: `3px solid ${images.length === 0 ? 'var(--border-color)' : 'var(--accent-color)'}`, 
						borderRadius: '12px',
						fontSize: 'var(--font-size-xl)',
						fontFamily: 'var(--font-display)',
						fontWeight: '700',
						cursor: images.length === 0 ? 'not-allowed' : 'pointer',
						transition: 'var(--transition)',
						boxShadow: images.length === 0 ? 'none' : '0 6px 20px var(--shadow)',
						marginTop: 'var(--space-xl)',
						textTransform: 'uppercase',
						letterSpacing: '1px'
					}}
					onMouseEnter={(e) => {
						if (images.length > 0) {
							e.target.style.transform = 'translateY(-2px)';
							e.target.style.boxShadow = '0 6px 20px var(--shadow-hover)';
						}
					}}
					onMouseLeave={(e) => {
						if (images.length > 0) {
							e.target.style.transform = 'translateY(0)';
							e.target.style.boxShadow = '0 4px 12px var(--shadow)';
						}
					}}
				>
					{images.length === 0 
						? 'Select images to upload'
						: 'Proceed to Payment (€5.00)'
					}
				</button>
			</form>

			<Toast type={toast.type} message={toast.message} onClose={clearToast} />
		</div>
	);
};

export default Upload;
