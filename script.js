const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['link', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean']
      ]
    }
  });
  
  const titleInput = document.getElementById("title");
  const genreSelect = document.getElementById("genre");
  const previewBtn = document.getElementById("previewBtn");
  
  function updateStats() {
    const text = quill.getText().trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    document.getElementById("wordCount").textContent = `Words: ${words}`;
    document.getElementById("charCount").textContent = `Characters: ${chars}`;
    document.getElementById("readTime").textContent = `Read Time: ${Math.ceil(words / 200)} min`;
  }
  
  function autoSave() {
    const story = {
      title: titleInput.value,
      genre: genreSelect.value,
      content: quill.root.innerHTML
    };
    localStorage.setItem("story", JSON.stringify(story));
  }
  
  function loadDraft() {
    const saved = JSON.parse(localStorage.getItem("story"));
    if (saved) {
      titleInput.value = saved.title || '';
      genreSelect.value = saved.genre || '';
      quill.root.innerHTML = saved.content || '';
      updateStats();
    }
  }
  
  function saveDraft() {
    autoSave();
    alert("Draft saved successfully.");
  }
  
  function publishStory() {
    const title = titleInput.value.trim();
    const genre = genreSelect.value;
    const content = quill.root.innerHTML.trim();
  
    if (!title || genre === "Select Genre" || !content) {
      alert("Please fill in all fields before publishing.");
      return;
    }
  
    const newStory = {
      title: title,
      genre: genre,
      content: content,
      author: "You",  // Replace with dynamic user name if needed
      date: new Date().toLocaleString()
    };
  
    let stories = JSON.parse(localStorage.getItem("publishedStories")) || [];
    stories.push(newStory);
    localStorage.setItem("publishedStories", JSON.stringify(stories));
  
    localStorage.removeItem("story");
    titleInput.value = "";
    genreSelect.selectedIndex = 0;
    quill.setContents([]);
    updateStats();
  
    alert("Your story has been published!");
  
    // Optionally redirect to index.html to view the published story
    // window.location.href = "index.html";
  }
  
  function toggleTheme() {
    document.body.classList.toggle('light-mode');
  }
  
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  
  let previewing = false;
  function togglePreview() {
    previewing = !previewing;
    quill.enable(!previewing);
    document.getElementById("editor").style.pointerEvents = previewing ? "none" : "auto";
    previewBtn.textContent = previewing ? "❌ Exit Preview" : "👁️ Preview";
  }
  
  quill.on('text-change', () => {
    updateStats();
    autoSave();
  });
  