import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  X,
  RefreshCw,
  Upload,
  Bold,
  Italic,
  Edit2,
  ArrowLeft,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Grid3X3,
  Grid2X2,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Loader2Icon,
  SaveIcon,
  ChevronUp,
  SaveAll,
  Trash2,
} from "lucide-react";

import NoteCard from "../components/Noteslist/NoteCard";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";

const notesAPI = {
  // Get all notes with filters
  getNotes: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        queryParams.append(key, value);
      }
    });

    const response = await fetch(`/api/notes?${queryParams}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Get single note
  getNote: async (id) => {
    const response = await fetch(`/api/notes/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Create new note
  createNote: async (noteData) => {
    const response = await fetch(`/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Update note
  updateNote: async (id, noteData) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Delete note
  deleteNote: async (id) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Upload single image
  uploadImage: async (noteId, file, caption = "", alt = "") => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    formData.append("alt", alt);

    const response = await fetch(`/api/notes/${noteId}/upload-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Upload multiple images
  uploadMultipleImages: async (noteId, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await fetch(`/api/notes/${noteId}/upload-images`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Add content block
  addContentBlock: async (noteId, type, contentData) => {
    const response = await fetch(`/api/notes/${noteId}/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, ...contentData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Remove content block
  removeContentBlock: async (noteId, blockIndex) => {
    const response = await fetch(`/api/notes/${noteId}/content/${blockIndex}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

const NotesPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mobileGridMode, setMobileGridMode] = useState("2x2");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const TITLE_MAX_LENGTH = 48;
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fileInputRef = useRef(null);
  const filtersRef = useRef(null);
  const [notes, setNotes] = useState([]);

  const filters = ["all", "this_week", "this_month", "this_year"];
  const [dateFilters, setDateFilters] = useState({
    startDate: "",
    endDate: "",
    dateRange: "all",
    priority: "all",
    category: "all",
  });
useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Load notes when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadNotes();
    }, 300); // Debounce API calls

    return () => clearTimeout(timeoutId);
  }, [searchQuery, dateFilters]);
useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint = 768px
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize); // Update on resize

    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);
  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      // Remove all filter parameters from the API call
      const response = await notesAPI.getNotes();

      if (response.success) {
        setNotes(response.data || []);
      } else {
        throw new Error(response.message || "Échec du chargement des notes");
      }
    } catch (error) {
      console.error("Error loading notes:", error);
      setError("Échec du chargement des notes. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  // Modal animation effect
  useEffect(() => {
    if (selectedNote) {
      setShowModal(true);
      setTitleCharCount(selectedNote.title ? selectedNote.title.length : 0);
    }
  }, [selectedNote]);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showFilters]);

  // Update dateFilters when activeFilter changes
  useEffect(() => {
    if (activeFilter !== "custom") {
      setDateFilters((prev) => ({
        ...prev,
        dateRange: activeFilter,
      }));
    }
  }, [activeFilter]);

const filteredNotes = React.useMemo(() => {
  // --- helpers for French month names and parsing ---
  const FRENCH_MONTHS = {
    janvier: 0,
    fevrier: 1, février: 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    aout: 7, août: 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    decembre: 11, décembre: 11,
  };

  // Normalize spaces, accents removed variant for matching
  const normalize = (s = "") =>
    s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // remove diacritics

  // Try to interpret the search query as a French date or month/year or ISO or numeric
  // Returns an object describing the interpreted date range or exact date
  function interpretFrenchDateQuery(q) {
    if (!q) return null;
    const raw = q.trim();
    const nq = normalize(raw);

    const now = new Date();
    const currentYear = now.getFullYear();

    // helper to build day-range (start & end inclusive)
    const dayRange = (year, month, day) => {
      const start = new Date(year, month, day, 0, 0, 0, 0);
      const end = new Date(year, month, day, 23, 59, 59, 999);
      return { type: "day", start, end };
    };
    const monthRange = (year, month) => {
      const start = new Date(year, month, 1, 0, 0, 0, 0);
      const end = new Date(year, month + 1, 0, 23, 59, 59, 999); // last day of month
      return { type: "month", start, end };
    };
    const yearRange = (year) => {
      const start = new Date(year, 0, 1, 0, 0, 0, 0);
      const end = new Date(year, 11, 31, 23, 59, 59, 999);
      return { type: "year", start, end };
    };

    // 1) ISO yyyy-mm-dd
    const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
      const y = +isoMatch[1];
      const m = +isoMatch[2] - 1;
      const d = +isoMatch[3];
      return dayRange(y, m, d);
    }

    // 2) dd/mm/yyyy or d/m/yyyy or dd-mm-yyyy
    const slashMatch = raw.match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?$/);
    if (slashMatch) {
      const day = +slashMatch[1];
      const month = +slashMatch[2] - 1;
      let year = slashMatch[3] ? +slashMatch[3] : currentYear;
      if (String(year).length === 2) year += year > 50 ? 1900 : 2000; // basic 2-digit handling
      // If only month/year provided like 08/2024 -> day will be NaN because first part is 08 -> treat as day below only if day <= 31
      if (day >= 1 && day <= 31) {
        // dd/mm or dd/mm/yyyy
        return dayRange(year, month, day);
      }
      // fallback: treat as month/year
      return monthRange(year, month);
    }

    // 3) year only e.g. "2024"
    const yearOnly = nq.match(/^(\d{4})$/);
    if (yearOnly) {
      const y = +yearOnly[1];
      return yearRange(y);
    }

    // 4) french textual forms:
    // examples: "12 aout 2024", "12 août", "aout 2024", "août", "août 24"
    // tokenise
    const tokens = nq.split(/[\s\-\/]+/).filter(Boolean);

    // find month token if present
    const monthTokenIndex = tokens.findIndex((t) => Object.keys(FRENCH_MONTHS).includes(t));
    if (monthTokenIndex !== -1) {
      const monthName = tokens[monthTokenIndex];
      const monthIndex = FRENCH_MONTHS[monthName];
      // check for day (token before month) and year (token after month)
      let day = null;
      let year = null;
      const before = tokens[monthTokenIndex - 1];
      const after = tokens[monthTokenIndex + 1];

      if (before && /^\d{1,2}$/.test(before)) day = +before;
      if (after && /^\d{2,4}$/.test(after)) {
        year = +after;
        if (String(year).length === 2) year += year > 50 ? 1900 : 2000;
      }

      if (!year) year = currentYear;

      if (day) {
        return dayRange(year, monthIndex, day);
      } else {
        return monthRange(year, monthIndex);
      }
    }

    // 5) french readable date like "12 août 2024" but with accents removed matched earlier,
    // covered by tokens/month detection. If no month found but tokens match "12" or "12 janvier" covered above.

    // 6) fallback: try Date.parse on localized candidate (may work for some inputs)
    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) {
      const d = new Date(parsed);
      return dayRange(d.getFullYear(), d.getMonth(), d.getDate());
    }

    // Nothing matched -> return null
    return null;
  }

  // Use the interpreter once for the searchQuery (if any)
  const dateQueryInterpretation = interpretFrenchDateQuery(searchQuery.trim());

  // --- main filtering chain ---
  let filtered = [...notes];

  // Apply search filter - includes title/content and French date search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((note) => {
      // title match
      const titleMatch = note.title?.toLowerCase().includes(query);

      // content match (blocks)
      const contentMatch = note.content?.some(
        (block) =>
          (block.text && block.text.toLowerCase().includes(query)) ||
          (block.title && block.title.toLowerCase().includes(query)) ||
          (block.items && block.items.some((item) => item.toLowerCase().includes(query)))
      );

      // date string matching: check French & ISO & readable forms
      const noteDateObj = new Date(note.createdAt || note.date);
      const noteIsValid = !Number.isNaN(noteDateObj.getTime());
      let dateMatch = false;

      if (noteIsValid) {
        // localized French short and long forms
        const dateFrShort = noteDateObj.toLocaleDateString("fr-FR").toLowerCase();
        const dateFrLong = noteDateObj
          .toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })
          .toLowerCase();
        const dateEnLong = noteDateObj
          .toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
          .toLowerCase();
        const dateIso = noteDateObj.toISOString().split("T")[0];

        // simple substring match against common string forms
        if (
          dateFrShort.includes(query) ||
          dateFrLong.includes(query) ||
          dateEnLong.includes(query) ||
          dateIso.includes(query)
        ) {
          dateMatch = true;
        }

        // If search query interprets as a date range (french forms), test if note falls within it
        if (!dateMatch && dateQueryInterpretation) {
          const s = dateQueryInterpretation.start;
          const e = dateQueryInterpretation.end;
          const nt = noteDateObj.getTime();
          if (s && e && nt >= s.getTime() && nt <= e.getTime()) {
            dateMatch = true;
          }
        }
      }

      return titleMatch || contentMatch || dateMatch;
    });
  }

  // Apply category filter
  if (dateFilters.category !== "all") {
    filtered = filtered.filter((note) => note.category === dateFilters.category);
  }

  // Apply priority filter
  if (dateFilters.priority !== "all") {
    filtered = filtered.filter((note) => note.priority === dateFilters.priority);
  }

  // Apply date range filter (existing behavior)
  if (dateFilters.dateRange !== "all") {
    const now = new Date();
    const noteDate = (note) => new Date(note.createdAt || note.date);
    switch (dateFilters.dateRange) {
      case "this_week": {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((note) => noteDate(note) >= weekAgo);
        break;
      }
      case "this_month": {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((note) => noteDate(note) >= monthAgo);
        break;
      }
      case "this_year": {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((note) => noteDate(note) >= yearAgo);
        break;
      }
      case "custom": {
        if (dateFilters.startDate) {
          const startDate = new Date(dateFilters.startDate);
          filtered = filtered.filter((note) => noteDate(note) >= startDate);
        }
        if (dateFilters.endDate) {
          const endDate = new Date(dateFilters.endDate);
          endDate.setHours(23, 59, 59, 999);
          filtered = filtered.filter((note) => noteDate(note) <= endDate);
        }
        break;
      }
      default:
        break;
    }
  }

  return filtered;
}, [notes, searchQuery, dateFilters]);

  const handleImageUpload = async (file, blockIndex) => {
    if (!file || !selectedNote) return;

    try {
      setIsSubmitting(true);
      setSubmitMessage("Téléchargement de l'image...");

      if (blockIndex !== undefined) {
        // For existing blocks, store file temporarily for upload on save
        const reader = new FileReader();
        reader.onload = (e) => {
          const newContent = [...selectedNote.content];
          newContent[blockIndex] = {
            ...newContent[blockIndex],
            url: e.target.result, // Temporary preview URL
            file: file, // Store file for upload
            pendingUpload: true,
          };
          setSelectedNote((prev) => ({ ...prev, content: newContent }));
        };
        reader.readAsDataURL(file);
      } else {
        // For new uploads, immediately upload to server
        const response = await notesAPI.uploadImage(selectedNote.id, file);
        if (response.success) {
          setSelectedNote(response.data.note);
          setSubmitMessage("Image téléchargée avec succès !");
        } else {
          throw new Error(response.message || "Échec du téléchargement de l'image");
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Échec du téléchargement de l'image. Veuillez réessayer.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitMessage("");
      }, 1000);
    }
  };

  const addNewNote = async () => {
  // Prevent multiple note creation
  if (isCreatingNote) return;
  
  try {
    setIsCreatingNote(true);
    setIsSubmitting(true);
    setSubmitMessage("Création d'une nouvelle note...");
    const now = new Date();

    const newNoteData = {
      title: "",
      date: now,
      content: [],
      priority: "medium",
    };

    const response = await notesAPI.createNote(newNoteData);

    if (response.success) {
      const newNote = response.data;
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
      setEditMode(true);
      setSubmitMessage("Note créée avec succès !");
    } else {
      throw new Error(response.message || "Échec de la création de la note");
    }
  } catch (error) {
    console.error("Error creating note:", error);
    setError("Échec de la création de la note. Veuillez réessayer.");
  } finally {
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage("");
      setIsCreatingNote(false); // Reset creation flag
    }, 1000);
  }
};

  const handleInputChange = (field, value) => {
    if (!selectedNote) return;
    if (field === "title" && value.length > TITLE_MAX_LENGTH) return;
    setSelectedNote((prev) => ({ ...prev, [field]: value }));
    if (field === "title") setTitleCharCount(value.length);
  };

  const addContentBlock = async (type) => {
    if (!selectedNote) return;

    try {
      let contentData = {};

      switch (type) {
        case "text":
          contentData = { text: "", bold: false, italic: false, align: "left" };
          break;
        case "image": {
          const newContent = [...selectedNote.content];
          newContent.push({
            type: "image",
            url: "", // Use empty string instead of null
            file: null,
            caption: "",
            alt: "",
          });
          setSelectedNote((prev) => ({ ...prev, content: newContent }));
          return;
        }
        case "list":
          contentData = { items: [""], listType: "bullet" };
          break;
        case "title":
          contentData = { title: "", headingLevel: "h2", align: "left" };
          break;
        default:
          return;
      }

      // Add content block locally for immediate UI update
      const newContent = [...selectedNote.content];
      newContent.push({ type, ...contentData });
      setSelectedNote((prev) => ({ ...prev, content: newContent }));
    } catch (error) {
      console.error("Error adding content block:", error);
      setError("Échec de l'ajout du bloc de contenu. Veuillez réessayer.");
    }
  };

  const removeContentBlock = (blockIndex) => {
    if (!selectedNote) return;
    const newContent = selectedNote.content.filter(
      (_, index) => index !== blockIndex
    );
    setSelectedNote((prev) => ({ ...prev, content: newContent }));
  };

  const updateContentBlock = (blockIndex, updates) => {
    if (!selectedNote) return;
    const newContent = [...selectedNote.content];
    newContent[blockIndex] = { ...newContent[blockIndex], ...updates };
    setSelectedNote((prev) => ({ ...prev, content: newContent }));
  };

  const addListItem = (blockIndex) => {
    const content = selectedNote.content[blockIndex];
    updateContentBlock(blockIndex, { items: [...content.items, ""] });
  };

  const removeListItem = (blockIndex, itemIndex) => {
    const content = selectedNote.content[blockIndex];
    const newItems = content.items.filter((_, index) => index !== itemIndex);
    updateContentBlock(blockIndex, { items: newItems });
  };

  const updateListItem = (blockIndex, itemIndex, value) => {
    const content = selectedNote.content[blockIndex];
    const newItems = [...content.items];
    newItems[itemIndex] = value;
    updateContentBlock(blockIndex, { items: newItems });
  };

  const toggleTextFormat = (blockIndex, format) => {
    const content = selectedNote.content[blockIndex];
    updateContentBlock(blockIndex, { [format]: !content[format] });
  };

  const setTextAlignment = (blockIndex, alignment) => {
    updateContentBlock(blockIndex, { align: alignment });
  };

  const getAlignmentClasses = (align) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

 const handleSave = async () => {
  if (!selectedNote) return;

  try {
    setIsSubmitting(true);
    setSubmitMessage("Enregistrement de la note...");

    // Handle pending image uploads
    const contentWithUploadedImages = await Promise.all(
      selectedNote.content.map(async (block) => {
        if (block.type === "image" && block.pendingUpload && block.file) {
          try {
            const uploadResponse = await notesAPI.uploadImage(
              selectedNote.id,
              block.file,
              block.caption || "",
              block.alt || ""
            );
            if (uploadResponse.success) {
              return {
                type: "image",
                url: uploadResponse.data.imageUrl,
                caption: block.caption || "",
                alt: block.alt || "",
              };
            }
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            throw new Error("Échec du téléchargement de l'image");
          }
        }
        
        const { ...cleanBlock } = block;
        return cleanBlock;
      })
    );

    const noteData = {
      title: selectedNote.title,
      content: contentWithUploadedImages,
      priority: selectedNote.priority,
      category: selectedNote.category,
    };

    const response = await notesAPI.updateNote(selectedNote.id, noteData);

    if (response.success) {
      const updatedNote = response.data;

      setNotes((prev) =>
        prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );

      setSelectedNote(updatedNote);
      setSubmitMessage("Note enregistrée avec succès !");
      setIsCreatingNote(false); // Reset creation flag after save

      setTimeout(() => {
        setEditMode(false);
      }, 1000);
    } else {
      throw new Error(response.message || "Échec de l'enregistrement de la note");
    }
  } catch (error) {
    console.error("Error saving note:", error);
    setError("Échec de l'enregistrement de la note. Veuillez réessayer.");
  } finally {
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage("");
    }, 1000);
  }
};

  const handleDelete = async (noteId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) return;

    try {
      setIsSubmitting(true);
      setSubmitMessage("Suppression de la note...");

      const response = await notesAPI.deleteNote(noteId);

      if (response.success) {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));

        if (selectedNote && selectedNote.id === noteId) {
          closeModal();
        }

        setSubmitMessage("Note supprimée avec succès !");
      } else {
        throw new Error(response.message || "Échec de la suppression de la note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      setError("Échec de la suppression de la note. Veuillez réessayer.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitMessage("");
      }, 1000);
    }
  };

 const closeModal = () => {
  setShowModal(false);
  setTimeout(() => {
    setSelectedNote(null);
    setEditMode(false);
    setIsCreatingNote(false); // Reset when modal closes
  }, 200);
};

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    if (selectedNote) {
      // Reload the note from the server to discard changes
      loadNoteById(selectedNote.id);
    }
    setEditMode(false);
  };

  const loadNoteById = async (noteId) => {
    try {
      const response = await notesAPI.getNote(noteId);
      if (response.success) {
        setSelectedNote(response.data);
      }
    } catch (error) {
      console.error("Error loading note:", error);
    }
  };

  const toggleMobileGridMode = () => {
    setMobileGridMode((prev) => (prev === "2x2" ? "1x1" : "2x2"));
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const applyDateFilter = (range) => {
    const today = new Date();
    let startDate = "";
    let endDate = "";

    switch (range) {
      case "today": {
        startDate = today.toISOString().split("T")[0];
        endDate = startDate;
        break;
      }
      case "this_week": {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(today.setDate(diff));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        startDate = weekStart.toISOString().split("T")[0];
        endDate = weekEnd.toISOString().split("T")[0];
        break;
      }
      case "this_month": {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];
        break;
      }
      case "this_year": {
        startDate = new Date(today.getFullYear(), 0, 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date(today.getFullYear(), 11, 31)
          .toISOString()
          .split("T")[0];
        break;
      }
      default:
        startDate = "";
        endDate = "";
    }
 setDateFilters((prev) => ({
      ...prev,
      dateRange: range,
      startDate,
      endDate,
    }));

    
  
    setDateFilters((prev) => ({
      ...prev,
      dateRange: range,
      startDate,
      endDate,
    }));

    if (range !== "custom") {
      setActiveFilter(range);
    } else {
      setActiveFilter(""); 
            setActiveFilter(range);

    }
  };

  const clearFilters = () => {
    setDateFilters({
      startDate: "",
      endDate: "",
      dateRange: "all",
      priority: "all",
      category: "all",
    });
    setSearchQuery("");
    setActiveFilter("all");
  };

  // Get grid classes based on mobile grid mode
  const getGridClasses = () => {
    const baseClasses = "grid gap-6";
    const desktopClasses = "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

    if (mobileGridMode === "1x1") {
      return `${baseClasses} grid-cols-1 ${desktopClasses}`;
    } else {
      return `${baseClasses} grid-cols-2 ${desktopClasses}`;
    }
  };

  const ImageUploadArea = ({ onUpload, file, label, index }) => {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUpload(e.target.files[0], index);
            }
          }}
          className="hidden"
          id={`upload-${label}-${index}`}
        />
        <label htmlFor={`upload-${label}-${index}`} className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">
            {file && file.name ? file.name : `Cliquez ou glissez ${label}`}
          </p>
          <p className="text-sm text-gray-500">
            Télécharger une photo (taille max : 10 MB)
          </p>
        </label>
      </div>
    );
  };

  const getHeadingClasses = (level, align = "left") => {
    const alignClass = getAlignmentClasses(align);
    switch (level) {
      case "h1":
        return `text-3xl font-bold text-gray-900 ${alignClass}`;
      case "h2":
        return `text-2xl font-semibold text-gray-900 ${alignClass}`;
      case "h3":
        return `text-xl font-medium text-gray-900 ${alignClass}`;
      default:
        return `text-xl font-semibold text-gray-900 ${alignClass}`;
    }
  };

  const AlignmentButtons = ({ currentAlign, onAlignChange, blockIndex }) => {
    const alignments = [
      { value: "left", icon: AlignLeft, label: "Gauche" },
      { value: "center", icon: AlignCenter, label: "Centre" },
      { value: "right", icon: AlignRight, label: "Droite" },
    ];

    return (
      <div className="flex gap-1">
        {alignments.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => onAlignChange(blockIndex, value)}
            className={`p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
              currentAlign === value
                ? "bg-red-100 border-red-300 text-red-800"
                : "text-gray-600"
            }`}
            title={`Aligner à ${label}`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    );
  };

  const renderContent = (content, blockIndex, isEditable = false) => {
    const containerClasses = `mb-4 ${
      isEditable ? "border border-gray-200 p-4 rounded-lg" : ""
    }`;

    if (content.type === "title") {
      const HeadingTag = content.headingLevel || "h2";

      return (
        <div key={`title-${blockIndex}`} className={containerClasses}>
          {isEditable ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Titre
                </label>
                <button
                  onClick={() => removeContentBlock(blockIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex  gap-2 mb-2 flex-wrap">
                {["h1", "h2", "h3"].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      updateContentBlock(blockIndex, { headingLevel: level })
                    }
                    className={`px-2 py-1  border-2 rounded-md text-sm font-medium transition-colors ${
                      (content.headingLevel || "h2") === level
                        ? "bg-red-100 border-red-300 text-red-800"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
                                <div className="border-l border-gray-300 mx-2"></div>
 <div className="flex gap-2 mb-2">
                <AlignmentButtons
                  currentAlign={content.align || "left"}
                  onAlignChange={setTextAlignment}
                  blockIndex={blockIndex}
                />
              </div>
              <input
                value={content.title || ""}
                onChange={(e) =>
                  updateContentBlock(blockIndex, { title: e.target.value })
                }
                placeholder="Titre de section"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${getHeadingClasses(
                  content.headingLevel,
                  content.align
                )}`}
              />
              </div>

             
            </div>
          ) : (
            React.createElement(
              HeadingTag,
              {
                className: getHeadingClasses(
                  content.headingLevel,
                  content.align
                ),
              },
              content.title
            )
          )}
        </div>
      );
    }
    if (content.type === "text") {
      const textClasses = `text-gray-700 leading-relaxed ${
        content.bold ? "font-bold" : ""
      } ${content.italic ? "italic" : ""} ${getAlignmentClasses(
        content.align || "left"
      )}`;

      return (
        <div key={`text-${blockIndex}`} className={containerClasses}>
          {isEditable && (
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Texte
              </label>
              <button
                onClick={() => removeContentBlock(blockIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {isEditable ? (
            <div>
              <div className="flex gap-2 mb-2 flex-wrap">
                <button
                  onClick={() => toggleTextFormat(blockIndex, "bold")}
                  className={`p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
                    content.bold
                      ? "bg-red-100 border-red-300 text-red-800"
                      : "text-gray-600"
                  }`}
                  title="Gras"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleTextFormat(blockIndex, "italic")}
                  className={`p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
                    content.italic
                      ? "bg-red-100 border-red-300 text-red-800"
                      : "text-gray-600"
                  }`}
                  title="Italique"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <div className="border-l border-gray-300 mx-2"></div>
                <AlignmentButtons
                  currentAlign={content.align || "left"}
                  onAlignChange={setTextAlignment}
                  blockIndex={blockIndex}
                />
              </div>
              <textarea
                value={content.text || ""}
                onChange={(e) =>
                  updateContentBlock(blockIndex, { text: e.target.value })
                }
                placeholder="Entrez votre texte ici..."
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[100px] ${textClasses}`}
                rows={4}
              />
            </div>
          ) : (
            <p className={textClasses}>{content.text}</p>
          )}
        </div>
      );
    }

    if (content.type === "image") {
      return (
        <div key={`image-${blockIndex}`} className={containerClasses}>
          {isEditable && (
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <button
                onClick={() => removeContentBlock(blockIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {isEditable ? (
            <div>
              {!content.url || content.url === "" ? (
                <ImageUploadArea
                  onUpload={(file) => handleImageUpload(file, blockIndex)}
                  file={content.file || null}
                  label="image"
                  index={blockIndex}
                />
              ) : (
                <div>
                  <img
                    src={content.url}
                    alt={content.alt || "Contenu de note"}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      // Clear the image to show upload area again
                      updateContentBlock(blockIndex, { url: "", file: null });
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Changer l'image
                  </button>
                </div>
              )}

           
            </div>
          ) : (
            content.url &&
            content.url !== "" && (
              <div>
                <img
                  src={content.url}
                  alt={content.alt || "Contenu de note"}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {content.caption && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    {content.caption}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      );
    }

    if (content.type === "list") {
      return (
        <div key={`list-${blockIndex}`} className={containerClasses}>
          {isEditable && (
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Liste
              </label>
              <button
                onClick={() => removeContentBlock(blockIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {isEditable ? (
            <div className="space-y-2">
              <div className="flex gap-2 mb-2">
                <select
                  value={content.listType || "bullet"}
                  onChange={(e) =>
                    updateContentBlock(blockIndex, { listType: e.target.value })
                  }
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                >
                  <option value="bullet">Puces</option>
                  <option value="numbered">Liste numérotée</option>
                </select>
              </div>
              {content.items &&
                content.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center space-x-2">
                    <input
                      value={item}
                      onChange={(e) =>
                        updateListItem(blockIndex, itemIndex, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Élément de liste"
                    />
                    <button
                      onClick={() => removeListItem(blockIndex, itemIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              <button
                onClick={() => addListItem(blockIndex)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                + Ajouter un élément
              </button>
            </div>
          ) : content.listType === "numbered" ? (
            <ol className="list-decimal list-inside space-y-1">
              {content.items &&
                content.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700">
                    {item}
                  </li>
                ))}
            </ol>
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {content.items &&
                content.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700">
                    {item}
                  </li>
                ))}
            </ul>
          )}
        </div>
      );
    }

    return null;
  };

  const isNewSelectedNote =
    !!selectedNote &&
    selectedNote.title === "" &&
    selectedNote.content.length === 0;

  if (loading && notes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sm:hidden h-12"></div>

        <TopNavigation />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des notes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden file input for image uploads */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Error Alert */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-3 text-white hover:text-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Submission Alert */}
      {isSubmitting && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
            {submitMessage}
          </div>
        </div>
      )}

      {/* Floating Add Button for Mobile */}
      <button
        onClick={addNewNote}
        disabled={isCreatingNote || isSubmitting}
        className="fixed bottom-24 right-6 md:hidden z-30 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal Overlay */}
      {selectedNote && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            showModal ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeModal}
        >
          <div
            className={`fixed inset-4 md:inset-8 lg:inset-16 mx-6 mb-16 md:mb-0 lg:mb-0 md:mx-16 lg:mx-64  bg-white rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-300 transform ${
              showModal ? "scale-100 opacity-100 mt-12" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {editMode ? (
              /* Edit/Add Note Modal Content */
              <div className="flex flex-col h-full sm:hidden mt-12">

                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 hidden sm:inline">
                      {isNewSelectedNote ? "Créer une nouvelle note" : "Créer/Modifier la note"}
                    </h2>
                    <h2 className="text-lg font-semibold text-gray-900 sm:hidden">
                      {isNewSelectedNote ? "Créer" : "Créer/Modifier"}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      disabled={isSubmitting}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hidden sm:inline"
                    >
                      {isSubmitting ? "Enregistrement..." : "Enregistrer la note"}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="px-4 py-1.5 text-xs font-light bg-red-600 sm:hidden text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? <Loader2Icon /> : <SaveAll />}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-4xl mx-auto space-y-6">
                    {/* Explanation */}
                    

                    {/* Title Input */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Titre
                        </label>
                        <span className={`text-sm ${titleCharCount >= TITLE_MAX_LENGTH ? 'text-red-600' : 'text-gray-500'}`}>
                          {titleCharCount}/{TITLE_MAX_LENGTH}
                        </span>
                        
                      </div>
                      <input
                        type="text"
                        value={selectedNote.title || ""}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Entrez le titre de la note..."
                        maxLength={TITLE_MAX_LENGTH}
                        className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-600">
                      {isNewSelectedNote
                        ? "Ajoutez un titre, définissez la priorité et ajoutez du contenu comme du texte, des images ou des listes."
                        : "Modifiez le titre, la priorité ou le contenu de votre note. Ajoutez ou supprimez des blocs selon vos besoins."}
                    </p>
                    </div>

                    {/* Priority Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priorité
                      </label>
                      <select
                        value={selectedNote.priority || "medium"}
                        onChange={(e) =>
                          handleInputChange("priority", e.target.value)
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                      </select>
                      
                    </div>

                    {/* Content Blocks */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Contenu
                      </label>
                      <div className="space-y-4">
                        {selectedNote.content &&
                          selectedNote.content.map((content, index) =>
                            renderContent(content, index, true)
                          )}
                      </div>

                    </div>

                    {/* Add Content Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                      
                      <button
                        onClick={() => addContentBlock("text")}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        + Bloc de texte
                      </button>
                      <button
                        onClick={() => addContentBlock("title")}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        + Titre
                      </button>
                      <button
                        onClick={() => addContentBlock("list")}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        + Liste
                      </button>
                      <button
                        onClick={() => addContentBlock("image")}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        + Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* View Note Modal Content */
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
       <div className="max-w-full">
  <div className="flex items-start justify-between gap-2">
    <h1 className={`font-bold text-gray-900 text-[clamp(1.25rem,4vw,1.5rem)] 
                    leading-tight break-words transition-all duration-200 flex-1
                    ${isExpanded ? '' : 'line-clamp-1'}`}>
      {selectedNote.title === "Untitled Note" || !selectedNote.title
        ? "Sans titre"
        : selectedNote.title}
    </h1>
    {selectedNote.title && selectedNote.title.length > 30 && (
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex-shrink-0 p-1 text-red-600 hover:text-red-700  rounded-md transition-colors">
        {isExpanded ? 
          <ChevronUp className="w-6 h-6 md:mt-2  -ml-8 hover:bg-red-50"  /> : 
          <ChevronDown className="w-6 h-6  md:mt-2 -ml-8 hover:bg-red-50 " />
        }
      </button>
    )}
  </div>
</div>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedNote.date || selectedNote.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Edit2 className="lg:w-4 lg:h-4 h-5 w-5" />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDelete(selectedNote.id)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Trash2 className="lg:w-4 lg:h-4 h-5 w-5  "  />
                      <span className="hidden sm:inline">Supprimer</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 mb-16">
                  <div className="max-w-4xl mx-auto">
                    {selectedNote.content && selectedNote.content.length > 0 ? (
                      <div className="space-y-6">
                        {selectedNote.content.map((content, index) =>
                          renderContent(content, index, false)
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Cette note est vide.</p>
                      </div>
                    )}
                  </div>
                </div>
                
              </div>
              
            )}

          </div>

        </div>
      )}

      <div className="sm:hidden h-12"></div>
      <TopNavigation />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          {/* Search and Filters Bar */}
{isMobile && !showModal ? (
  <div
    className={`bg-white text-center sticky top-12 transition-shadow duration-300 ${
      scrolled ? "shadow-sm border-b z-50 border-gray-200" : ""
    }`}
  >
  
      <div
  className={`max-w-7xl mx-auto px-4  transition-all duration-300 ${
    scrolled ? "translate-y-[-0.5rem] pt-4" : "translate-y-0 py-4"
  }`}
>
              {/* Search and Filters Row */}
              <div className="flex items-center space-x-3 mb-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                 <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des notes par titre, contenu, ou date (ex: '15/01/2024', 'janvier 2024')..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent focus:bg-white transition-colors"
                />

                </div>

                {/* Advanced Filters Button */}
                <div className="relative" ref={filtersRef}>
                  <button
                    onClick={toggleFilters}
                    className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors font-medium"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filtres Avancés</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Filters Popup */}
                  {showFilters && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-30 overflow-hidden">
                      <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Filtres Avancés
                          </h3>
                          <button
                            onClick={clearFilters}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Effacer tout
                          </button>
                        </div>

                        {/* Date Range Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Période
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: "all", label: "Toutes les dates" },
                              { value: "this_week", label: "Cette semaine" },
                              { value: "this_month", label: "Ce mois" },
                              { value: "this_year", label: "Cette année" },
                              {
                                value: "custom",
                                label: "Période personnalisée",
                              },
                            ].map(({ value, label }) => (
                              <label key={value} className="flex items-center">
                                <input
                                  type="radio"
                                  name="dateRange"
                                  value={value}
                                  checked={dateFilters.dateRange === value}
                                  onChange={(e) =>
                                    applyDateFilter(e.target.value)
                                  }
                                  className="mr-3 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {label}
                                </span>
                              </label>
                            ))}
                          </div>

                          {/* Custom Date Range */}
                          {dateFilters.dateRange === "custom" && (
                            <div className="mt-3 space-y-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Date de début
                                </label>
                                <input
                                  type="date"
                                  value={dateFilters.startDate}
                                  onChange={(e) =>
                                    setDateFilters((prev) => ({
                                      ...prev,
                                      startDate: e.target.value,
                                      dateRange: "custom",
                                    }))
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Date de fin
                                </label>
                                <input
                                  type="date"
                                  value={dateFilters.endDate}
                                  onChange={(e) =>
                                    setDateFilters((prev) => ({
                                      ...prev,
                                      endDate: e.target.value,
                                      dateRange: "custom",
                                    }))
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Priority Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Priorité
                          </label>
                          <select
                            value={dateFilters.priority}
                            onChange={(e) =>
                              setDateFilters((prev) => ({
                                ...prev,
                                priority: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                          >
                            <option value="all">Toutes les priorités</option>
                            <option value="high">Haute</option>
                            <option value="medium">Moyenne</option>
                            <option value="low">Faible</option>
                          </select>
                        </div>

                        {/* Results Count */}
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            {filteredNotes.length} note
                            {filteredNotes.length !== 1 ? "s" : ""} trouvée
                            {filteredNotes.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Grid Toggle - Only visible on mobile */}
                <button
                  onClick={toggleMobileGridMode}
                  className="md:hidden flex items-center space-x-2 px-3 py-3 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  title={`Basculer vers la grille ${
                    mobileGridMode === "2x2" ? "1x1" : "2x2"
                  }`}
                >
                  {mobileGridMode === "2x2" ? (
                    <Grid3X3 className="w-4 h-4" />
                  ) : (
                    <Grid2X2 className="w-4 h-4" />
                  )}
                </button>
              </div>

             {/* Filter Tags - Only visible when NOT scrolled */}
{!scrolled  && (
  <div className="flex items-center space-x-1">
    {filters.map((filter) => {
      const filterLabels = {
        all: "Toutes",
        this_week: "Cette semaine",
        this_month: "Ce mois",
        this_year: "Cette année",
      };

      return (
        <button
          key={filter}
          onClick={() => {
            setActiveFilter(filter);
            applyDateFilter(filter);
          }}
          className={`md:px-4 md:py-2 px-2 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeFilter === filter
              ? "bg-red-100 text-red-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {filterLabels[filter]}
        </button>
      );
    })}

    {/* Desktop Create Note Button - Hidden on mobile */}
    <div className="flex-1"></div>
    <button
      onClick={addNewNote}
      disabled={isCreatingNote || isSubmitting}
      className="hidden md:flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Plus className="w-4 h-4" />
      <span>{isCreatingNote ? "Création..." : "Créer une note"}</span>
    </button>
  </div>
)}

            </div>
  </div>
) : (
  <div className="bg-white border-b border-gray-200">
       <div className="max-w-7xl mx-auto px-4 p-4">
              {/* Search and Filters Row */}
              <div className="flex items-center space-x-3 mb-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                 <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des notes par titre, contenu, ou date (ex: '15/01/2024', 'janvier 2024')..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent focus:bg-white transition-colors"
                />

                </div>

                {/* Advanced Filters Button */}
                <div className="relative" ref={filtersRef}>
                  <button
                    onClick={toggleFilters}
                    className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors font-medium"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filtres Avancés</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Filters Popup */}
                  {showFilters && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-30 overflow-hidden">
                      <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Filtres Avancés
                          </h3>
                          <button
                            onClick={clearFilters}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Effacer tout
                          </button>
                        </div>

                        {/* Date Range Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Période
                          </label>
                          <div className="space-y-2">
                            {[
                              { value: "all", label: "Toutes les dates" },
                              { value: "this_week", label: "Cette semaine" },
                              { value: "this_month", label: "Ce mois" },
                              { value: "this_year", label: "Cette année" },
                              {
                                value: "custom",
                                label: "Période personnalisée",
                              },
                            ].map(({ value, label }) => (
                              <label key={value} className="flex items-center">
                                <input
                                  type="radio"
                                  name="dateRange"
                                  value={value}
                                  checked={dateFilters.dateRange === value}
                                  onChange={(e) =>
                                    applyDateFilter(e.target.value)
                                  }
                                  className="mr-3 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {label}
                                </span>
                              </label>
                            ))}
                          </div>

                          {/* Custom Date Range */}
                          {dateFilters.dateRange === "custom" && (
                            <div className="mt-3 space-y-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Date de début
                                </label>
                                <input
                                  type="date"
                                  value={dateFilters.startDate}
                                  onChange={(e) =>
                                    setDateFilters((prev) => ({
                                      ...prev,
                                      startDate: e.target.value,
                                      dateRange: "custom",
                                    }))
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Date de fin
                                </label>
                                <input
                                  type="date"
                                  value={dateFilters.endDate}
                                  onChange={(e) =>
                                    setDateFilters((prev) => ({
                                      ...prev,
                                      endDate: e.target.value,
                                      dateRange: "custom",
                                    }))
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Priority Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Priorité
                          </label>
                          <select
                            value={dateFilters.priority}
                            onChange={(e) =>
                              setDateFilters((prev) => ({
                                ...prev,
                                priority: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                          >
                            <option value="all">Toutes les priorités</option>
                            <option value="high">Haute</option>
                            <option value="medium">Moyenne</option>
                            <option value="low">Faible</option>
                          </select>
                        </div>

                        {/* Results Count */}
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            {filteredNotes.length} note
                            {filteredNotes.length !== 1 ? "s" : ""} trouvée
                            {filteredNotes.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Grid Toggle - Only visible on mobile */}
                <button
                  onClick={toggleMobileGridMode}
                  className="md:hidden flex items-center space-x-2 px-3 py-3 text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  title={`Basculer vers la grille ${
                    mobileGridMode === "2x2" ? "1x1" : "2x2"
                  }`}
                >
                  {mobileGridMode === "2x2" ? (
                    <Grid3X3 className="w-4 h-4" />
                  ) : (
                    <Grid2X2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Filter Tags */}
              <div className="flex items-center space-x-1">
                {filters.map((filter) => {
                  const filterLabels = {
                    all: "Toutes",
                    this_week: "Cette semaine",
                    this_month: "Ce mois",
                    this_year: "Cette année",
                  };

                  return (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        applyDateFilter(filter);
                      }}
                      className={`md:px-4 md:py-2 px-2 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        activeFilter === filter
                          ? "bg-red-100 text-red-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {filterLabels[filter]}
                    </button>
                  );
                })}

                {/* Desktop Create Note Button - Hidden on mobile */}
                <div className="flex-1"></div>
               <button
                  onClick={addNewNote}
                  disabled={isCreatingNote || isSubmitting}
                  className="hidden md:flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingNote ? "Création..." : "Créer une note"}</span>
                </button>
              </div>
            </div>
  </div>
)}            

          <div className="max-w-7xl mx-auto px-4 py-6">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune note trouvée
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ||
                  Object.values(dateFilters).some(
                    (v) => v !== "all" && v !== ""
                  )
                    ? "Essayez de modifier vos critères de recherche ou filtres."
                    : "Commencez par créer votre première note."}
                </p>
                {(searchQuery ||
                  Object.values(dateFilters).some(
                    (v) => v !== "all" && v !== ""
                  )) && (
                  <button
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className={getGridClasses()}>
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onClick={setSelectedNote}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;