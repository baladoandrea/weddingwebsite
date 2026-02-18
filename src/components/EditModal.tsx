interface Section {
  id: string;
  title: string;
  content: string;
  page: string;
}

interface EditModalProps {
  section: Section;
  onSave: (section: Section) => void;
  onClose: () => void;
  onChange: (section: Section) => void;
}

export default function EditModal({ section, onSave, onClose, onChange }: EditModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Editar Sección</h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <form className="modal-form">
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              value={section.title}
              onChange={e => onChange({...section, title: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Contenido</label>
            <textarea
              value={section.content}
              onChange={e => onChange({...section, content: e.target.value})}
              rows={10}
            />
          </div>

          <div className="form-group">
            <label>Página</label>
            <select
              value={section.page}
              onChange={e => onChange({...section, page: e.target.value})}
            >
              <option value="principal">Principal</option>
              <option value="info">Información</option>
              <option value="coruna">Sobre A Coruña</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn-save"
              onClick={() => onSave(section)}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
