(function() {
  var game;
  var ui;
  var currentTheme = 'light';

  var DateOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Initialize the interface
    initializeInterface();
    
    // Load saved theme
    loadTheme();
  };

  function initializeInterface() {
    // Initialize sidebar toggles
    document.getElementById('progress-toggle').addEventListener('click', toggleProgressSidebar);
    document.getElementById('context-toggle').addEventListener('click', toggleContextSidebar);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Initialize sidebar overlay
    var overlay = document.getElementById('sidebar-overlay');
    overlay.addEventListener('click', closeSidebars);

    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Initialize keyboard navigation
    initializeKeyboardNavigation();
    
    // Handle initial responsive state
    handleResize();
    
    // Add scroll behavior for smooth chat scrolling
    var chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.style.scrollBehavior = 'smooth';
    }
  }

  function initializeKeyboardNavigation() {
    // Add keyboard support for header buttons
    var headerButtons = document.querySelectorAll('.header-btn');
    headerButtons.forEach(function(button) {
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });

    // Add escape key to close sidebars
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSidebars();
      }
    });
  }

  function handleResize() {
    var isMobile = window.innerWidth <= 768;
    var progressSidebar = document.getElementById('progress-sidebar');
    var contextSidebar = document.getElementById('context-sidebar');
    
    if (isMobile) {
      // On mobile, sidebars are hidden by default
      progressSidebar.classList.remove('active');
      contextSidebar.classList.remove('active');
      closeSidebars();
    } else {
      // On desktop, show sidebars by default
      progressSidebar.classList.remove('hidden');
      contextSidebar.classList.remove('hidden');
      closeSidebars();
    }
  }

  function toggleProgressSidebar() {
    var sidebar = document.getElementById('progress-sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    var isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      var isActive = sidebar.classList.contains('active');
      closeSidebars(); // Close any open sidebars first
      
      if (!isActive) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
      }
    } else {
      sidebar.classList.toggle('hidden');
    }
  }

  function toggleContextSidebar() {
    var sidebar = document.getElementById('context-sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    var isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      var isActive = sidebar.classList.contains('active');
      closeSidebars(); // Close any open sidebars first
      
      if (!isActive) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
      }
    } else {
      sidebar.classList.toggle('hidden');
    }
  }

  function closeSidebars() {
    var progressSidebar = document.getElementById('progress-sidebar');
    var contextSidebar = document.getElementById('context-sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    
    progressSidebar.classList.remove('active');
    contextSidebar.classList.remove('active');
    overlay.classList.remove('active');
  }

  function toggleTheme() {
    var body = document.body;
    var themeIcon = document.querySelector('#theme-toggle i');
    
    if (body.classList.contains('theme-light')) {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
      currentTheme = 'dark';
    } else {
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
      currentTheme = 'light';
    }
    
    // Save theme preference
    localStorage.setItem('fullquest-theme', currentTheme);
  }

  function loadTheme() {
    var savedTheme = localStorage.getItem('fullquest-theme') || 'light';
    var body = document.body;
    var themeIconElement = document.querySelector('#theme-toggle i');
    
    if (savedTheme === 'dark') {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      if (themeIconElement) themeIconElement.className = 'fas fa-moon';
      currentTheme = 'dark';
    } else {
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      if (themeIconElement) themeIconElement.className = 'fas fa-sun';
      currentTheme = 'light';
    }
  }

  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
    const mapping = {
      'Me: ':          'me',
      'Facilitator: ': 'fa',
      'Librarian: ':   'li',
      'Archivist: ':   'ar',
      'Scholar: ':     'sc',
      'Historian: ':   'hi',
      'Curator: ':     'cu',
      'Narration: ':   'na'
    };

    for (const prefix in mapping) {
      if (text.startsWith(prefix)) {
        const cls = mapping[prefix];
        const content = text.slice(prefix.length);

        if (cls === 'na') {
          // Narration – centered, with .na
          return `
            <div class="chat-line narration">
              <div class="bubble na">${content}</div>
            </div>`;
        }
        else if (cls === 'me') {
          // Me – right, profileabbrevation right
          return `
            <div class="chat-line me">
              <div class="bubble me">${content}</div>
              <span class="profile me">Me</span>
            </div>`;
        }
        else {
          // Other characters – profileabbrevation left
          const label = prefix.trim().slice(0,2);
          return `
            <div class="chat-line">
              <span class="profile ${cls}">${label}</span>
              <div class="bubble ${cls}">${content}</div>
            </div>`;
        }
      }
    }

    // No known prefix → just text
    return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root') {
        window.autosave();
    }
  };
    
  // This function updates the game left sidebar (status/qualities).
  window.updateSidebar = function() {
      $('#qualities').empty();
      var scene = dendryUI.game.scenes.status;
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
  };

  // This function updates the game right sidebar (context/holtext).
  window.updateRightSidebar = function() {
      $('#holtext').empty();
      var scene = dendryUI.game.scenes.holtext;
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#holtext').append(dendryUI.contentToHTML.convert(displayContent));
  };
  
  // This function runs on every new content display. Currently, all it does is update the sidebars.
  window.onDisplayContent = function() {
      window.updateSidebar();
      window.updateRightSidebar();
      
      // Add smooth scroll to bottom after content update
      setTimeout(function() {
        var chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
  };

  // TODO: change this!
  var TITLE = "Full Quest" + '_' + "storyde";

  window.quickSave = function() {
      var saveString = JSON.stringify(window.dendryUI.dendryEngine.getExportableState());
      localStorage[TITLE+'_save_q'] = saveString;
      window.alert("Saved.");
  };

  window.saveSlot = function(slot) {
      var saveString = JSON.stringify(window.dendryUI.dendryEngine.getExportableState());
      localStorage[TITLE+'_save_' + slot] = saveString;
      var scene = window.dendryUI.dendryEngine.state.sceneId;
      var date = new Date(Date.now());
      date = scene + '\n(' + date.toLocaleString(undefined, DateOptions) + ')';
      localStorage[TITLE+'_save_timestamp_' + slot] = date;
      window.populateSaveSlots(8, 2);
  };
  
  // writes an autosave slot
  window.autosave = function() {
      var oldData = localStorage[TITLE+'_save_' + 'a0'];
      if (oldData) {
          localStorage[TITLE+'_save_'+'a1'] = oldData;
          localStorage[TITLE+'_save_timestamp_'+'a1'] = localStorage[TITLE+'_save_timestamp_'+'a0'];
      }
      var slot = 'a0';
      var saveString = JSON.stringify(window.dendryUI.dendryEngine.getExportableState());
      localStorage[TITLE+'_save_' + slot] = saveString;
      var scene = window.dendryUI.dendryEngine.state.sceneId;
      var date = new Date(Date.now());
      date = scene + '\n(' + date.toLocaleString(undefined, DateOptions) + ')';
      localStorage[TITLE+'_save_timestamp_' + slot] = date;
      window.populateSaveSlots(8, 2);
  };

  window.quickLoad = function() {
      if (localStorage[TITLE+'_save_q']) {
          var saveString = localStorage[TITLE+'_save_q'];
          window.dendryUI.dendryEngine.setState(JSON.parse(saveString));
          window.alert("Loaded.");
      } else {
          window.alert("No save available.");
      }
  };

  window.loadSlot = function(slot) {
      if (localStorage[TITLE+'_save_' + slot]) {
          var saveString = localStorage[TITLE+'_save_' + slot];
          window.dendryUI.dendryEngine.setState(JSON.parse(saveString));
          window.hideSaveSlots();
          // Show a subtle notification instead of alert
          showNotification("Game loaded successfully", "success");
      } else {
          showNotification("No save available", "error");
      }
  };

  window.deleteSlot = function(slot) {
      if (localStorage[TITLE+'_save_' + slot]) {
          localStorage[TITLE+'_save_' + slot] = '';
          localStorage[TITLE+'_save_timestamp_' + slot] = '';
          window.populateSaveSlots(8, 2);
          showNotification("Save deleted", "info");
      } else {
          showNotification("No save available", "error");
      }
  };

  // Enhanced notification system
  function showNotification(message, type) {
    var notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: var(--secondary-bg);
      color: var(--text-primary);
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px var(--shadow-medium);
      border-left: 4px solid var(--electric-blue);
      z-index: 3000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-size: 14px;
      font-weight: 500;
      max-width: 300px;
    `;
    
    if (type === 'error') {
      notification.style.borderLeftColor = '#EF4444';
    } else if (type === 'success') {
      notification.style.borderLeftColor = 'var(--neon-green)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(function() {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(function() {
      notification.style.transform = 'translateX(100%)';
      setTimeout(function() {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  window.populateSaveSlots = function(max_slots, max_auto_slots) {
      // this fills in the save information
      function createLoadListener(i) {
          return function(evt) {
                evt.target.style.transform = 'scale(0.95)';
                setTimeout(function() {
                  evt.target.style.transform = 'scale(1)';
                }, 150);
                window.loadSlot(i);
          };
      }
      function createSaveListener(i) {
          return function(evt) {
                evt.target.style.transform = 'scale(0.95)';
                setTimeout(function() {
                  evt.target.style.transform = 'scale(1)';
                }, 150);
                window.saveSlot(i);
          };
      }
      function createDeleteListener(i) {
          return function(evt) {
                evt.target.style.transform = 'scale(0.95)';
                setTimeout(function() {
                  evt.target.style.transform = 'scale(1)';
                }, 150);
                window.deleteSlot(i);
          };
      }
      function populateSlot(id) {
          var save_element = document.getElementById('save_info_' + id);
          var save_button = document.getElementById('save_button_' + id);
          var delete_button = document.getElementById('delete_button_' + id);
          if (localStorage[TITLE+'_save_' + id]) {
              var timestamp = localStorage[TITLE+'_save_timestamp_' + id];
              save_element.textContent = timestamp;
              save_button.textContent = "Load";
              save_button.onclick = createLoadListener(id);
              delete_button.onclick = createDeleteListener(id);
          } else {
              save_button.textContent = "Save";
              save_element.textContent = "Empty";
              save_button.onclick = createSaveListener(id);
          }

      }
      for (var i = 0; i < max_slots; i++) {
          populateSlot(i);
      }
      for (i = 0; i < max_auto_slots; i++) {
          populateSlot('a'+i);
      }
  };

  window.showSaveSlots = function() {
      var save_element = document.getElementById('save');
      save_element.style.display = "flex";
      // magic number lol
      window.populateSaveSlots(8, 2);
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('save');
              if (target == save_element) {
                  window.hideSaveSlots();
              }
          };
      }
  };

  window.hideSaveSlots = function() {
      var save_element = document.getElementById('save');
      save_element.style.display = "none";
  };

  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.onload = function() {
    window.dendryUI.loadSettings();
  };

}());