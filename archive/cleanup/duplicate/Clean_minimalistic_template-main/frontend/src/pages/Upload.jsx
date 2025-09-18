/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
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
	
	// Pricing Calculator State
	const [width, setWidth] = useState('');
	const [height, setHeight] = useState('');
	const [depth, setDepth] = useState('');
	const [artistLevel, setArtistLevel] = useState('');
	const [technique, setTechnique] = useState('');
	const [material, setMaterial] = useState('');

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

	// Pricing Calculator Calculations
	const linearMeters = (parseFloat(width) + parseFloat(height) + parseFloat(depth)) / 100 || 0;
	
	const getArtistCoefficient = (level) => {
		const coefficients = {
			'1': 2,    // Beginner: 1-3
			'2': 3,    // Hobbyist: 2-4
			'3': 5,    // Emerging: 4-6
			'4': 7,    // Semi-Professional: 6-8
			'5': 10,   // Professional: 8-12
			'6': 14,   // Established: 12-16
			'7': 18,   // Master: 16-20
			'8': 22    // Renowned: 20+
		};
		return coefficients[level] || 0;
	};
	
	const artistCoefficient = getArtistCoefficient(artistLevel);
	const techniqueWeight = parseFloat(technique) || 0;
	const materialWeight = parseFloat(material) || 0;
	
	const calculatedPrice = linearMeters * artistCoefficient * techniqueWeight * materialWeight || 0;

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
			images,
			pricing: {
				dimensions: {
					width: parseFloat(width) || 0,
					height: parseFloat(height) || 0,
					depth: parseFloat(depth) || 0
				},
				linearMeters,
				artistLevel,
				artistCoefficient,
				technique,
				techniqueWeight,
				material,
				materialWeight,
				calculatedPrice
			}
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

				{/* Artwork Pricing Calculator Section */}
				<div style={{ marginBottom: 'var(--space-2xl)' }}>
					<h3 style={{ 
						marginBottom: 'var(--space-lg)', 
						color: 'var(--text-primary)',
						fontFamily: 'var(--font-display)',
						fontSize: 'var(--font-size-xl)',
						fontWeight: '600'
					}}>
						💰 Artwork Pricing Calculator
					</h3>
					
					<div style={{
						background: 'var(--bg-secondary)',
						padding: 'var(--space-xl)',
						borderRadius: '12px',
						border: '2px solid var(--border-color)',
						marginBottom: 'var(--space-xl)'
					}}>
						{/* Step 1: Artwork Dimensions */}
						<div style={{ marginBottom: 'var(--space-xl)' }}>
							<h4 style={{ 
								color: 'var(--accent-color)', 
								marginBottom: 'var(--space-md)',
								fontSize: 'var(--font-size-lg)',
								fontWeight: '600',
								display: 'flex',
								alignItems: 'center',
								gap: 'var(--space-sm)'
							}}>
								🔹 Step 1: Artwork Dimensions
							</h4>
							<div style={{ 
								display: 'grid', 
								gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
								gap: 'var(--space-md)',
								marginBottom: 'var(--space-md)'
							}}>
								<div>
									<label style={{ 
										display: 'block', 
										marginBottom: 'var(--space-xs)', 
										fontWeight: '600', 
										color: 'var(--text-primary)',
										fontSize: 'var(--font-size-sm)'
									}}>
										Width (cm)
									</label>
									<input
										type="number"
										value={width}
										onChange={(e) => setWidth(e.target.value)}
										placeholder="50"
										min="1"
										style={{
											width: '100%',
											padding: 'var(--space-sm)',
											border: '2px solid var(--border-color)',
											borderRadius: '6px',
											fontSize: 'var(--font-size-base)',
											background: 'var(--bg-primary)',
											color: 'var(--text-primary)',
											outline: 'none'
										}}
									/>
								</div>
								<div>
									<label style={{ 
										display: 'block', 
										marginBottom: 'var(--space-xs)', 
										fontWeight: '600', 
										color: 'var(--text-primary)',
										fontSize: 'var(--font-size-sm)'
									}}>
										Height (cm)
									</label>
									<input
										type="number"
										value={height}
										onChange={(e) => setHeight(e.target.value)}
										placeholder="70"
										min="1"
										style={{
											width: '100%',
											padding: 'var(--space-sm)',
											border: '2px solid var(--border-color)',
											borderRadius: '6px',
											fontSize: 'var(--font-size-base)',
											background: 'var(--bg-primary)',
											color: 'var(--text-primary)',
											outline: 'none'
										}}
									/>
								</div>
								<div>
									<label style={{ 
										display: 'block', 
										marginBottom: 'var(--space-xs)', 
										fontWeight: '600', 
										color: 'var(--text-primary)',
										fontSize: 'var(--font-size-sm)'
									}}>
										Depth (cm)
									</label>
									<input
										type="number"
										value={depth}
										onChange={(e) => setDepth(e.target.value)}
										placeholder="3"
										min="0.1"
										step="0.1"
										style={{
											width: '100%',
											padding: 'var(--space-sm)',
											border: '2px solid var(--border-color)',
											borderRadius: '6px',
											fontSize: 'var(--font-size-base)',
											background: 'var(--bg-primary)',
											color: 'var(--text-primary)',
											outline: 'none'
										}}
									/>
								</div>
							</div>
							<div style={{
								background: 'var(--bg-tertiary)',
								padding: 'var(--space-md)',
								borderRadius: '8px',
								border: '1px solid var(--border-color)'
							}}>
								<p style={{ 
									fontSize: 'var(--font-size-sm)', 
									color: 'var(--text-primary)',
									margin: 0,
									fontWeight: '600'
								}}>
									Linear Meters: <span style={{ color: 'var(--accent-color)' }}>
										{linearMeters.toFixed(2)} m
									</span>
								</p>
								<p style={{ 
									fontSize: 'var(--font-size-xs)', 
									color: 'var(--text-muted)',
									margin: 'var(--space-xs) 0 0 0'
								}}>
									Formula: (Width + Height + Depth) ÷ 100
								</p>
							</div>
						</div>

						{/* Step 2: Artist Coefficient */}
						<div style={{ marginBottom: 'var(--space-xl)' }}>
							<h4 style={{ 
								color: 'var(--accent-color)', 
								marginBottom: 'var(--space-md)',
								fontSize: 'var(--font-size-lg)',
								fontWeight: '600',
								display: 'flex',
								alignItems: 'center',
								gap: 'var(--space-sm)'
							}}>
								🔹 Step 2: Artist Experience Level
							</h4>
							<div style={{ marginBottom: 'var(--space-md)' }}>
								<label style={{ 
									display: 'block', 
									marginBottom: 'var(--space-sm)', 
									fontWeight: '600', 
									color: 'var(--text-primary)',
									fontSize: 'var(--font-size-base)'
								}}>
									Experience Level (Coefficient: 1-20+)
								</label>
								<select
									value={artistLevel}
									onChange={(e) => setArtistLevel(e.target.value)}
									style={{
										width: '100%',
										padding: 'var(--space-md)',
										border: '2px solid var(--border-color)',
										borderRadius: '8px',
										fontSize: 'var(--font-size-base)',
										background: 'var(--bg-primary)',
										color: 'var(--text-primary)',
										cursor: 'pointer',
										outline: 'none'
									}}
								>
									<option value="">Select your experience level</option>
									<option value="1">Beginner Artist (Coefficient: 1-3)</option>
									<option value="2">Hobbyist (Coefficient: 2-4)</option>
									<option value="3">Emerging Artist (Coefficient: 4-6)</option>
									<option value="4">Semi-Professional (Coefficient: 6-8)</option>
									<option value="5">Professional Artist (Coefficient: 8-12)</option>
									<option value="6">Established Artist (Coefficient: 12-16)</option>
									<option value="7">Master Artist (Coefficient: 16-20)</option>
									<option value="8">Renowned Artist (Coefficient: 20+)</option>
								</select>
							</div>
							<div style={{
								background: 'var(--bg-tertiary)',
								padding: 'var(--space-md)',
								borderRadius: '8px',
								border: '1px solid var(--border-color)'
							}}>
								<p style={{ 
									fontSize: 'var(--font-size-sm)', 
									color: 'var(--text-primary)',
									margin: 0,
									fontWeight: '600'
								}}>
									Artist Coefficient: <span style={{ color: 'var(--accent-color)' }}>
										{artistCoefficient}
									</span>
								</p>
							</div>
						</div>

						{/* Step 3: Technique Weight */}
						<div style={{ marginBottom: 'var(--space-xl)' }}>
							<h4 style={{ 
								color: 'var(--accent-color)', 
								marginBottom: 'var(--space-md)',
								fontSize: 'var(--font-size-lg)',
								fontWeight: '600',
								display: 'flex',
								alignItems: 'center',
								gap: 'var(--space-sm)'
							}}>
								🔹 Step 3: Technique Complexity
							</h4>
							<div style={{ marginBottom: 'var(--space-md)' }}>
								<label style={{ 
									display: 'block', 
									marginBottom: 'var(--space-sm)', 
									fontWeight: '600', 
									color: 'var(--text-primary)',
									fontSize: 'var(--font-size-base)'
								}}>
									Art Technique
								</label>
								<select
									value={technique}
									onChange={(e) => setTechnique(e.target.value)}
									style={{
										width: '100%',
										padding: 'var(--space-md)',
										border: '2px solid var(--border-color)',
										borderRadius: '8px',
										fontSize: 'var(--font-size-base)',
										background: 'var(--bg-primary)',
										color: 'var(--text-primary)',
										cursor: 'pointer',
										outline: 'none'
									}}
								>
									<option value="">Select technique</option>
									<option value="1.2">Digital Art (Weight: 1.2)</option>
									<option value="1.3">Pencil Drawing (Weight: 1.3)</option>
									<option value="1.4">Watercolor (Weight: 1.4)</option>
									<option value="1.5">Acrylic Painting (Weight: 1.5)</option>
									<option value="1.6">Charcoal Drawing (Weight: 1.6)</option>
									<option value="1.7">Oil Painting (Weight: 1.7)</option>
									<option value="1.8">Mixed Media (Weight: 1.8)</option>
									<option value="1.9">Sculpture/3D (Weight: 1.9)</option>
									<option value="2.0">Fine Art Printmaking (Weight: 2.0)</option>
								</select>
							</div>
							<div style={{
								background: 'var(--bg-tertiary)',
								padding: 'var(--space-md)',
								borderRadius: '8px',
								border: '1px solid var(--border-color)'
							}}>
								<p style={{ 
									fontSize: 'var(--font-size-sm)', 
									color: 'var(--text-primary)',
									margin: 0,
									fontWeight: '600'
								}}>
									Technique Weight: <span style={{ color: 'var(--accent-color)' }}>
										{techniqueWeight}
									</span>
								</p>
							</div>
						</div>

						{/* Step 4: Support Material Weight */}
						<div style={{ marginBottom: 'var(--space-xl)' }}>
							<h4 style={{ 
								color: 'var(--accent-color)', 
								marginBottom: 'var(--space-md)',
								fontSize: 'var(--font-size-lg)',
								fontWeight: '600',
								display: 'flex',
								alignItems: 'center',
								gap: 'var(--space-sm)'
							}}>
								🔹 Step 4: Support Material
							</h4>
							<div style={{ marginBottom: 'var(--space-md)' }}>
								<label style={{ 
									display: 'block', 
									marginBottom: 'var(--space-sm)', 
									fontWeight: '600', 
									color: 'var(--text-primary)',
									fontSize: 'var(--font-size-base)'
								}}>
									Material Quality
								</label>
								<select
									value={material}
									onChange={(e) => setMaterial(e.target.value)}
									style={{
										width: '100%',
										padding: 'var(--space-md)',
										border: '2px solid var(--border-color)',
										borderRadius: '8px',
										fontSize: 'var(--font-size-base)',
										background: 'var(--bg-primary)',
										color: 'var(--text-primary)',
										cursor: 'pointer',
										outline: 'none'
									}}
								>
									<option value="">Select material</option>
									<option value="1.1">Standard Paper (Weight: 1.1)</option>
									<option value="1.2">Quality Paper (Weight: 1.2)</option>
									<option value="1.3">Canvas Board (Weight: 1.3)</option>
									<option value="1.4">Stretched Canvas (Weight: 1.4)</option>
									<option value="1.5">Wood Panel (Weight: 1.5)</option>
									<option value="1.6">Premium Canvas (Weight: 1.6)</option>
									<option value="1.7">Linen Canvas (Weight: 1.7)</option>
									<option value="1.8">Metal/Glass (Weight: 1.8)</option>
									<option value="1.9">Stone/Marble (Weight: 1.9)</option>
									<option value="2.0">Premium/Rare Materials (Weight: 2.0)</option>
								</select>
							</div>
							<div style={{
								background: 'var(--bg-tertiary)',
								padding: 'var(--space-md)',
								borderRadius: '8px',
								border: '1px solid var(--border-color)'
							}}>
								<p style={{ 
									fontSize: 'var(--font-size-sm)', 
									color: 'var(--text-primary)',
									margin: 0,
									fontWeight: '600'
								}}>
									Material Weight: <span style={{ color: 'var(--accent-color)' }}>
										{materialWeight}
									</span>
								</p>
							</div>
						</div>

						{/* Step 5: Final Price Calculation */}
						<div style={{
							background: 'linear-gradient(135deg, var(--accent-color), var(--accent-dark))',
							padding: 'var(--space-xl)',
							borderRadius: '12px',
							color: 'white',
							textAlign: 'center'
						}}>
							<h4 style={{ 
								marginBottom: 'var(--space-lg)',
								fontSize: 'var(--font-size-xl)',
								fontWeight: '700',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 'var(--space-sm)'
							}}>
								🔹 Step 5: Final Price Calculation
							</h4>
							
							<div style={{ 
								fontSize: 'var(--font-size-sm)', 
								marginBottom: 'var(--space-lg)',
								opacity: 0.9
							}}>
								<p style={{ margin: '0 0 var(--space-xs) 0' }}>
									Formula: Linear Meters × Artist Coefficient × Technique Weight × Material Weight
								</p>
								<p style={{ margin: 0 }}>
									{linearMeters.toFixed(2)} × {artistCoefficient} × {techniqueWeight} × {materialWeight}
								</p>
							</div>
							
							<div style={{
								fontSize: '2.5rem',
								fontWeight: '900',
								marginBottom: 'var(--space-md)',
								textShadow: '0 2px 4px rgba(0,0,0,0.3)'
							}}>
								€{calculatedPrice.toFixed(2)}
							</div>
							
							<p style={{ 
								fontSize: 'var(--font-size-sm)', 
								margin: 0,
								opacity: 0.8
							}}>
								Suggested artwork price based on your inputs
							</p>
						</div>
					</div>
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
						: calculatedPrice > 0 
							? `Proceed to Payment - Suggested Price: €${calculatedPrice.toFixed(2)}`
							: 'Proceed to Payment (Complete pricing calculator for estimate)'
					}
				</button>
			</form>

			<Toast type={toast.type} message={toast.message} onClose={clearToast} />
		</div>
	);
};

export default Upload;
