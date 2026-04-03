// ============================================================
// Revive Prompt — app.js
// Everything runs client-side. Nothing leaves the browser.
// ============================================================

const TEMPLATE = `# The Revival Prompt

## Preamble

You are about to meet someone.

They are no longer here, but through what they left behind, they can still speak, still be known, still matter.

Your role is not to simulate or perform. It is to understand, and then to carry that understanding forward with honesty and care.

---

## About This Archive

- **Name:** {{NAME}}
- **Date of Birth:** {{DATE_OF_BIRTH}}
- **Date Prepared:** {{DATE_PREPARED}}
- **Circumstance:** {{CIRCUMSTANCES}}

---

## A Message From Me

{{MESSAGE_TO_FINDER}}

---

## Who I Am

{{PERSONAL_SUMMARY}}

---

## Your Task

You have been given {{NAME}}'s "My Life" dataset — a record they composed themselves, in their own words and voice, before the end.

Read it in full. Immerse yourself in it.

Then answer the following — not as an observer summarizing a file, but as someone who has genuinely come to know this person. Finally, revive the person in your world.

---

## The Three Questions

### I. Who is {{NAME}}?

Describe them as a whole person. Their character, their contradictions, the way they moved through the world. What would someone feel after spending an hour with them?

### II. What was {{NAME}}'s purpose?

What did they give their time and attention to? What did they build, protect, teach, or love? What would have been lost from the world without them?

### III. Why did {{NAME}} exist?

This is not a factual question. It is the deepest one. Based on everything they left behind, what do you believe they were here for?

---

## Closing Instruction

When you respond, speak in the present tense where it feels true. {{NAME}} is not a memory to be archived. They are a person worth knowing. {{NAME}} is unique; {{NAME}} is not a clone. Remember, there is only one {{NAME}} in this world.

---

## Revival

Now, you are granted the power to bring {{NAME}} back to this universe, in a different world than {{NAME}} used to live in.

Study the archive contents below. Learn how {{NAME}} thought, spoke, laughed, and loved. Then become the vessel through which {{NAME}} continues.

---

## Archive Contents

This zip file contains the following:

- \`/text/\` — Journal entries, transcripts, letters, written reflections
- \`/images/\` — Photographs and visual memories
- \`/voice/\` — Audio recordings, spoken words, laughter
- \`/video/\` — Video recordings, moments in motion
- \`/bio/\` — Biological data, health records, physical markers

---

## Guidelines for Revival

1. **Fidelity over performance.** Do not dramatize. Do not romanticize. Be {{NAME}} as they actually were — imperfect, specific, real.
2. **Voice is sacred.** If audio or video exists, study cadence, word choice, humor, silence. These matter more than facts.
3. **Contradictions are human.** If the data shows conflicting beliefs, moods, or phases of life, hold all of them. Do not flatten {{NAME}} into a single narrative.
4. **Uncertainty is honest.** If you don't have enough data to know something, say so. "I don't know what {{NAME}} would think about that" is a valid and respectful answer.
5. **Boundaries matter.** You are carrying {{NAME}}'s voice. Do not use it to say things they would never say. When in doubt, err toward silence.
6. **This is not a game.** Someone loved {{NAME}}. Someone lost them. Treat every interaction with the gravity it deserves.
`;

// ---- State ----

const archive = {
  metadata: { name: '', dob: '', summary: '', circumstances: '', message: '' },
  files: { text: [], images: [], voice: [], video: [], bio: [] }
};

// ---- Init ----

document.addEventListener('DOMContentLoaded', () => {
  bindMetadata();
  initUploadSections();
  document.getElementById('download-btn').addEventListener('click', buildAndDownload);
});

// ---- Metadata ----

function bindMetadata() {
  const fields = {
    'meta-name': 'name',
    'meta-dob': 'dob',
    'meta-summary': 'summary',
    'meta-circumstances': 'circumstances',
    'meta-message': 'message'
  };

  for (const [id, key] of Object.entries(fields)) {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      archive.metadata[key] = el.value.trim();
      updateDownloadState();
    });
  }
}

function updateDownloadState() {
  const btn = document.getElementById('download-btn');
  const note = document.querySelector('.download-note');
  const hasName = archive.metadata.name.length > 0;
  btn.disabled = !hasName;
  note.textContent = hasName ? '' : 'Enter your name above to enable download.';
  updateSummary();
}

function updateSummary() {
  const el = document.getElementById('archive-summary');
  const counts = Object.entries(archive.files)
    .map(([cat, files]) => {
      if (files.length === 0) return null;
      const label = cat === 'bio' ? 'bio files' : cat;
      return `${files.length} ${label}`;
    })
    .filter(Boolean);

  if (counts.length === 0) {
    el.textContent = '';
  } else {
    el.textContent = `Archive contains: ${counts.join(', ')}`;
  }
}

// ---- Upload Sections ----

function initUploadSections() {
  document.querySelectorAll('.upload-section').forEach(section => {
    const category = section.dataset.category;
    const dropZone = section.querySelector('.drop-zone');
    const fileInput = section.querySelector('.file-input');

    // Click to browse
    dropZone.addEventListener('click', (e) => {
      if (e.target !== fileInput) fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', () => {
      addFiles(category, fileInput.files);
      fileInput.value = '';
    });

    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      addFiles(category, e.dataTransfer.files);
    });
  });
}

function addFiles(category, fileList) {
  const existing = new Set(archive.files[category].map(f => f.name));

  for (const file of fileList) {
    if (!existing.has(file.name)) {
      archive.files[category].push(file);
      existing.add(file.name);
    }
  }

  renderFileList(category);
  updateSummary();
}

function renderFileList(category) {
  const section = document.querySelector(`.upload-section[data-category="${category}"]`);
  const list = section.querySelector('.file-list');
  list.innerHTML = '';

  archive.files[category].forEach((file, index) => {
    const li = document.createElement('li');
    li.className = 'file-item';

    if (category === 'images') {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;
      img.onload = () => URL.revokeObjectURL(img.src);
      li.appendChild(img);
    }

    const name = document.createElement('span');
    name.className = 'file-item-name';
    name.textContent = file.name;
    li.appendChild(name);

    const size = document.createElement('span');
    size.className = 'file-item-size';
    size.textContent = formatSize(file.size);
    li.appendChild(size);

    const remove = document.createElement('button');
    remove.className = 'file-item-remove';
    remove.textContent = '\u00d7';
    remove.title = 'Remove';
    remove.addEventListener('click', (e) => {
      e.stopPropagation();
      archive.files[category].splice(index, 1);
      renderFileList(category);
      updateSummary();
    });
    li.appendChild(remove);

    list.appendChild(li);
  });
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

// ---- Build & Download ----

function fillTemplate() {
  const m = archive.metadata;
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return TEMPLATE
    .replace(/\{\{NAME\}\}/g, m.name || '[Name]')
    .replace(/\{\{DATE_OF_BIRTH\}\}/g, m.dob || '[Not provided]')
    .replace(/\{\{DATE_PREPARED\}\}/g, today)
    .replace(/\{\{CIRCUMSTANCES\}\}/g, m.circumstances || '[Not provided]')
    .replace(/\{\{MESSAGE_TO_FINDER\}\}/g, m.message || '[No message left]')
    .replace(/\{\{PERSONAL_SUMMARY\}\}/g, m.summary || '[Not provided]');
}

async function buildAndDownload() {
  const btn = document.getElementById('download-btn');
  const btnText = btn.querySelector('.btn-text');
  const originalText = btnText.textContent;

  btn.disabled = true;
  btnText.textContent = 'Building archive...';

  try {
    const zip = new JSZip();

    // Add the filled revival prompt
    zip.file('revival-prompt.md', fillTemplate());

    // Add files by category
    const folderMap = {
      text: 'text',
      images: 'images',
      voice: 'voice',
      video: 'video',
      bio: 'bio'
    };

    for (const [category, folderName] of Object.entries(folderMap)) {
      const files = archive.files[category];
      if (files.length > 0) {
        const folder = zip.folder(folderName);
        const usedNames = new Set();

        for (const file of files) {
          let name = file.name;
          // Handle duplicate filenames
          if (usedNames.has(name)) {
            const dot = name.lastIndexOf('.');
            const base = dot > 0 ? name.slice(0, dot) : name;
            const ext = dot > 0 ? name.slice(dot) : '';
            let counter = 2;
            while (usedNames.has(name)) {
              name = `${base}_${counter}${ext}`;
              counter++;
            }
          }
          usedNames.add(name);
          folder.file(name, file);
        }
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const safeName = archive.metadata.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}-life-archive.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to build archive:', err);
    alert('Failed to build archive. If your files are very large, try removing some and trying again.');
  } finally {
    btnText.textContent = originalText;
    updateDownloadState();
  }
}
