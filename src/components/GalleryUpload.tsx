import { useState } from 'react';

interface GalleryUploadProps {
  onUpload: (file: File, tags: string[]) => void;
}

export default function GalleryUpload({ onUpload }: GalleryUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState('');
  const [preview, setPreview] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Selecciona una foto');
      return;
    }

    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onUpload(file, tagsArray);
    setFile(null);
    setTags('');
    setPreview('');
  };

  return (
    <div className="gallery-upload-container">
      <h3>Subir Nueva Foto</h3>

      <div className="upload-form">
        <div className="file-input-wrapper">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="photo-input"
          />
          <label htmlFor="photo-input" className="file-label">
            {preview ? 'Foto seleccionada' : 'Seleccionar foto'}
          </label>
        </div>

        {preview && (
          <div className="preview-container">
            <img src={preview} alt="preview" />
          </div>
        )}

        <div className="tags-input">
          <label htmlFor="tags">Etiquetas (separadas por comas)</label>
          <input
            id="tags"
            type="text"
            placeholder="ej: ceremonia, aperitivo, convite"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
          <small>Disponibles: ceremonia, aperitivo, convite</small>
        </div>

        <button
          type="button"
          className="upload-btn"
          onClick={handleUpload}
          disabled={!file}
        >
          Subir Foto
        </button>
      </div>
    </div>
  );
}
