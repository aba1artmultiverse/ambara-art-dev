import state from '../store';

const FilePicker = ({ file, setFile, readFile }) => (
  <div className="side-panel" style={{ minWidth: 200 }}>
    <p className="panel-label">upload artwork</p>
    <div className="filepicker-container">
      <input id="file-upload" type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <label htmlFor="file-upload" className="filepicker-label">choose file</label>
      <p style={{ fontSize: '0.68rem', color: 'rgba(232,213,255,0.4)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {file === '' ? 'no file selected' : file.name}
      </p>
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <button
          onClick={() => readFile('logo')}
          style={{
            flex: 1, padding: '7px 0',
            background: 'transparent',
            border: '1px solid rgba(201,162,39,0.4)',
            borderRadius: 7, color: '#c9a227',
            fontFamily: "'Major Mono Display', monospace",
            fontSize: '0.58rem', letterSpacing: '0.08em',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseOver={e => e.target.style.background = 'rgba(201,162,39,0.12)'}
          onMouseOut={e => e.target.style.background = 'transparent'}
        >
          logo
        </button>
        <button
          onClick={() => readFile('full')}
          style={{
            flex: 1, padding: '7px 0',
            background: 'linear-gradient(135deg, #c9a227, #ff8c00)',
            border: 'none', borderRadius: 7,
            color: '#030008',
            fontFamily: "'Major Mono Display', monospace",
            fontSize: '0.58rem', letterSpacing: '0.08em',
            cursor: 'pointer', transition: 'all 0.2s',
            fontWeight: 700,
          }}
        >
          full wrap
        </button>
      </div>
    </div>
  </div>
);

export default FilePicker;
