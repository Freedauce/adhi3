import { useState, useRef, useEffect } from "react";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { useRole } from "../../context/RoleContext";
import { houseTypes as initialHouseTypes, components as allComponents } from "../../mock/houseTypes";
import {
  Plus, Edit2, Copy, Archive, X, Upload, Trash2, Eye,
  Home, BedDouble, Bath, Ruler, DollarSign, Clock, Tag,
  Package, ChevronRight, ImagePlus, Save, RotateCcw,
  Search, Filter, MoreVertical, CheckCircle2, AlertCircle
} from "lucide-react";

/* ── Sample gallery images per house type for demo ── */
const defaultGallery = {
  "HT-002": [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  ],
  "HT-003": [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7a5a8e?w=600&h=400&fit=crop",
  ],
  "HT-004": [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&h=400&fit=crop",
  ],
};

/* ── Component category styling ── */
const categoryColors = {
  Structural: "bg-blue-100 text-blue-700",
  Envelope:   "bg-teal-100 text-teal-700",
  Interior:   "bg-amber-100 text-amber-700",
  MEP:        "bg-purple-100 text-purple-700",
  Finishes:   "bg-green-100 text-green-700",
};

/* ── blank form shape ── */
const blankForm = {
  modelCode: "",
  name: "",
  description: "",
  defaultBedrooms: 0,
  defaultBathrooms: 1,
  defaultFloorAreaM2: 0,
  basePriceUsd: 0,
  assemblyWeeks: 3,
  status: "ACTIVE",
  tag: "Standard",
  imageUrl: "",
  components: [],
  configurableInputs: [],
};

/* ══════════════════════════════════════════
   HOUSE MANAGEMENT — Full CRUD
   ══════════════════════════════════════════ */
export default function HouseManagement() {
  const { roleConfig } = useRole();

  /* ── State ── */
  const [houses, setHouses] = useState(() => {
    // Attach gallery arrays
    return initialHouseTypes.map(h => ({
      ...h,
      gallery: defaultGallery[h.id] || [h.imageUrl],
    }));
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal: create / edit
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...blankForm });
  const [formImages, setFormImages] = useState([]); // preview URLs from file input
  const fileRef = useRef(null);

  // Detail drawer
  const [detailHouse, setDetailHouse] = useState(null);
  const [activeThumb, setActiveThumb] = useState(0);

  // Toast
  const [toast, setToast] = useState(null);

  const statusVariant = { ACTIVE: "active", DRAFT: "pending", ARCHIVED: "delayed" };

  /* ── Helpers ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const nextId = () => {
    const max = houses.reduce((m, h) => {
      const n = parseInt(h.id.replace("HT-", ""), 10);
      return n > m ? n : m;
    }, 0);
    return `HT-${String(max + 1).padStart(3, "0")}`;
  };

  /* ── CRUD ── */
  const openCreateForm = () => {
    setEditingId(null);
    setForm({ ...blankForm });
    setFormImages([]);
    setShowForm(true);
  };

  const openEditForm = (house) => {
    setEditingId(house.id);
    setForm({
      modelCode: house.modelCode,
      name: house.name,
      description: house.description,
      defaultBedrooms: house.defaultBedrooms,
      defaultBathrooms: house.defaultBathrooms,
      defaultFloorAreaM2: house.defaultFloorAreaM2,
      basePriceUsd: house.basePriceUsd,
      assemblyWeeks: house.assemblyWeeks,
      status: house.status,
      tag: house.tag,
      imageUrl: house.imageUrl,
      components: [...house.components],
      configurableInputs: [...house.configurableInputs],
    });
    setFormImages(house.gallery || [house.imageUrl]);
    setShowForm(true);
  };

  const handleSave = () => {
    // Validation
    if (!form.modelCode.trim() || !form.name.trim()) {
      showToast("Model code and name are required.", "error");
      return;
    }
    if (form.basePriceUsd <= 0) {
      showToast("Base price must be greater than 0.", "error");
      return;
    }

    if (editingId) {
      // Update
      setHouses(prev =>
        prev.map(h =>
          h.id === editingId
            ? {
                ...h,
                ...form,
                gallery: formImages.length > 0 ? formImages : h.gallery,
                imageUrl: formImages[0] || h.imageUrl,
              }
            : h
        )
      );
      showToast(`${form.name} updated successfully.`);
    } else {
      // Create
      const newHouse = {
        ...form,
        id: nextId(),
        gallery: formImages.length > 0 ? formImages : [form.imageUrl || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop"],
        imageUrl: formImages[0] || form.imageUrl || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop",
      };
      setHouses(prev => [...prev, newHouse]);
      showToast(`${form.name} created successfully.`);
    }
    setShowForm(false);
  };

  const handleDuplicate = (house) => {
    const dup = {
      ...house,
      id: nextId(),
      modelCode: house.modelCode + "-COPY",
      name: house.name + " (Copy)",
      status: "DRAFT",
      components: [...house.components],
      configurableInputs: [...house.configurableInputs],
      gallery: [...(house.gallery || [house.imageUrl])],
    };
    setHouses(prev => [...prev, dup]);
    showToast(`Duplicated as ${dup.name}.`);
  };

  const handleArchive = (house) => {
    setHouses(prev =>
      prev.map(h =>
        h.id === house.id
          ? { ...h, status: h.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED" }
          : h
      )
    );
    showToast(
      house.status === "ARCHIVED"
        ? `${house.name} restored.`
        : `${house.name} archived.`
    );
  };

  const handleDelete = (house) => {
    setHouses(prev => prev.filter(h => h.id !== house.id));
    showToast(`${house.name} deleted.`, "error");
    if (detailHouse?.id === house.id) setDetailHouse(null);
  };

  /* ── Image handling ── */
  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormImages(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFormImage = (idx) => {
    setFormImages(prev => prev.filter((_, i) => i !== idx));
  };

  /* ── Component toggle ── */
  const toggleComponent = (compId) => {
    setForm(prev => ({
      ...prev,
      components: prev.components.includes(compId)
        ? prev.components.filter(c => c !== compId)
        : [...prev.components, compId],
    }));
  };

  /* ── Filtered list ── */
  const filteredHouses = houses.filter(h => {
    const matchSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.modelCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || h.status === statusFilter;
    return matchSearch && matchStatus;
  });

  /* ── Detail drawer — keep thumb in range ── */
  useEffect(() => {
    if (detailHouse) setActiveThumb(0);
  }, [detailHouse]);

  /* ══════════════════════════════════════
     RENDER
     ══════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6 relative">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold text-white transition-all duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
          }`}
          style={{ animation: "slideInRight .3s ease" }}
        >
          {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <Breadcrumb items={["ADHI DASHBOARD", roleConfig.perspectiveLabel, "HOUSE MANAGEMENT"]} />
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">House Kit Definitions</h2>
          <p className="text-sm text-gray-500 mt-1">Create, edit, and manage all house types.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-adhi-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-all duration-200 flex items-center gap-2 shadow-lg shadow-adhi-primary/20 hover:shadow-xl hover:shadow-adhi-primary/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={16} /> New House Type
        </button>
      </div>

      {/* ── Search / Filter bar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by model code or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {["ALL", "ACTIVE", "DRAFT", "ARCHIVED"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === s
                  ? "bg-adhi-primary text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Model</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Beds</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Baths</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Floor Area</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Base Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHouses.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                  <Home size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold">No house types found</p>
                  <p className="text-xs mt-1">Adjust your filters or create a new house type.</p>
                </td>
              </tr>
            )}
            {filteredHouses.map(house => (
              <tr
                key={house.id}
                className="border-t border-gray-50 hover:bg-adhi-light/40 transition-colors cursor-pointer group"
                onClick={() => setDetailHouse(house)}
              >
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-adhi-primary bg-adhi-surface px-2.5 py-1 rounded-lg text-xs">
                    {house.modelCode}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={house.imageUrl}
                      alt={house.name}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{house.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{house.tag} · {house.assemblyWeeks}wk assembly</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-gray-700 font-medium">{house.defaultBedrooms}</td>
                <td className="px-6 py-4 text-center text-gray-700 font-medium">{house.defaultBathrooms}</td>
                <td className="px-6 py-4 text-right text-gray-700">{house.defaultFloorAreaM2}m²</td>
                <td className="px-6 py-4 text-right font-bold text-gray-900">${house.basePriceUsd.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Badge label={house.status} variant={statusVariant[house.status] || "ontrack"} />
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEditForm(house)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-adhi-surface hover:border-adhi-primary/30 text-gray-500 hover:text-adhi-primary transition-all"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(house)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 text-gray-500 hover:text-blue-600 transition-all"
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => handleArchive(house)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-amber-50 hover:border-amber-200 text-gray-500 hover:text-amber-600 transition-all"
                      title={house.status === "ARCHIVED" ? "Restore" : "Archive"}
                    >
                      <Archive size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(house)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 text-gray-500 hover:text-red-600 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════
         DETAIL DRAWER (right side)
         ══════════════════════════════════════ */}
      {detailHouse && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            onClick={() => setDetailHouse(null)}
            style={{ animation: "fadeIn .2s ease" }}
          />
          {/* Drawer */}
          <div
            className="fixed top-0 right-0 h-full w-full max-w-[560px] bg-white shadow-2xl z-[101] flex flex-col overflow-hidden"
            style={{ animation: "slideInRight .3s ease" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-adhi-surface rounded-xl flex items-center justify-center">
                  <Home size={20} className="text-adhi-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{detailHouse.name}</h3>
                  <p className="text-xs text-gray-400 font-mono">{detailHouse.modelCode} · {detailHouse.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { openEditForm(detailHouse); setDetailHouse(null); }}
                  className="px-4 py-2 rounded-lg bg-adhi-primary text-white text-xs font-bold hover:bg-adhi-dark transition-colors flex items-center gap-1.5"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => setDetailHouse(null)}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* ── Hero gallery ── */}
              <div className="relative">
                <img
                  src={(detailHouse.gallery || [detailHouse.imageUrl])[activeThumb] || detailHouse.imageUrl}
                  alt={detailHouse.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <Badge label={detailHouse.status} variant={statusVariant[detailHouse.status] || "ontrack"} />
                  <span className="ml-2">
                    <Badge label={detailHouse.tag} variant="processing" />
                  </span>
                </div>
              </div>

              {/* ── Thumbnail strip ── */}
              {(detailHouse.gallery || []).length > 1 && (
                <div className="flex gap-2 px-6 py-3 overflow-x-auto bg-gray-50 border-b border-gray-100">
                  {detailHouse.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveThumb(i)}
                      className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        activeThumb === i
                          ? "border-adhi-primary shadow-md shadow-adhi-primary/20 scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* ── Description ── */}
              <div className="px-6 py-5 border-b border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">{detailHouse.description}</p>
              </div>

              {/* ── Quick stats ── */}
              <div className="grid grid-cols-4 gap-3 px-6 py-5 border-b border-gray-100">
                {[
                  { icon: BedDouble, label: "Beds", value: detailHouse.defaultBedrooms },
                  { icon: Bath, label: "Baths", value: detailHouse.defaultBathrooms },
                  { icon: Ruler, label: "Area", value: `${detailHouse.defaultFloorAreaM2}m²` },
                  { icon: Clock, label: "Assembly", value: `${detailHouse.assemblyWeeks}wk` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <Icon size={18} className="mx-auto text-adhi-primary mb-1.5" />
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
                  </div>
                ))}
              </div>

              {/* ── Price ── */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <DollarSign size={16} />
                  <span>Base Price (USD)</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">${detailHouse.basePriceUsd.toLocaleString()}</span>
              </div>

              {/* ── Kit Components ── */}
              <div className="px-6 py-5">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={16} className="text-adhi-primary" />
                  <h4 className="font-bold text-gray-900">Kit Components</h4>
                  <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {detailHouse.components.length} items
                  </span>
                </div>
                <div className="space-y-2">
                  {detailHouse.components.map(compId => {
                    const comp = allComponents.find(c => c.id === compId);
                    if (!comp) return null;
                    return (
                      <div
                        key={compId}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-adhi-light/50 transition-colors"
                      >
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${categoryColors[comp.category] || "bg-gray-100 text-gray-500"}`}>
                          {comp.category}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{comp.name}</p>
                          <p className="text-[11px] text-gray-400">{comp.description}</p>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">{comp.id}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════
         CREATE / EDIT MODAL
         ══════════════════════════════════════ */}
      {showForm && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={() => setShowForm(false)}
            style={{ animation: "fadeIn .2s ease" }}
          />
          {/* Modal */}
          <div
            className="fixed inset-0 z-[101] flex items-start justify-center pt-8 pb-8 overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[720px] mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: "popIn .3s ease" }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingId ? "Edit House Type" : "New House Type"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {editingId ? `Editing ${form.modelCode}` : "Fill in all the details below to create a new kit."}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-7 py-6 max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
                {/* ── Row 1: Model Code + Name ── */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Model Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MODEL-XL"
                      value={form.modelCode}
                      onChange={(e) => setForm(prev => ({ ...prev, modelCode: e.target.value.toUpperCase() }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Model XL — Estate"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    />
                  </div>
                </div>

                {/* ── Description ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe this house kit…"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all resize-none"
                  />
                </div>

                {/* ── Row 2: Specs grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bedrooms</label>
                    <input
                      type="number"
                      min="0"
                      value={form.defaultBedrooms}
                      onChange={(e) => setForm(prev => ({ ...prev, defaultBedrooms: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bathrooms</label>
                    <input
                      type="number"
                      min="1"
                      value={form.defaultBathrooms}
                      onChange={(e) => setForm(prev => ({ ...prev, defaultBathrooms: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Floor Area (m²)</label>
                    <input
                      type="number"
                      min="1"
                      value={form.defaultFloorAreaM2}
                      onChange={(e) => setForm(prev => ({ ...prev, defaultFloorAreaM2: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Assembly (wks)</label>
                    <input
                      type="number"
                      min="1"
                      value={form.assemblyWeeks}
                      onChange={(e) => setForm(prev => ({ ...prev, assemblyWeeks: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    />
                  </div>
                </div>

                {/* ── Row 3: Price + Status + Tag ── */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Base Price (USD) *</label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={form.basePriceUsd}
                      onChange={(e) => setForm(prev => ({ ...prev, basePriceUsd: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tag</label>
                    <select
                      value={form.tag}
                      onChange={(e) => setForm(prev => ({ ...prev, tag: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                      <option value="Project">Project</option>
                    </select>
                  </div>
                </div>

                {/* ── Image Upload ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    House Kit Images
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 hover:border-adhi-primary/40 transition-colors">
                    {/* Preview grid */}
                    {formImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {formImages.map((img, i) => (
                          <div key={i} className="relative group rounded-xl overflow-hidden aspect-[3/2]">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeFormImage(i)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X size={12} />
                            </button>
                            {i === 0 && (
                              <span className="absolute bottom-1 left-1 bg-adhi-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                COVER
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload button */}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full flex flex-col items-center gap-2 py-4 text-gray-400 hover:text-adhi-primary transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                        <ImagePlus size={22} className="text-gray-400" />
                      </div>
                      <span className="text-sm font-medium">Click to upload images</span>
                      <span className="text-[11px] text-gray-300">PNG, JPG, or WEBP · Max 5MB each</span>
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileInput}
                    />

                    {/* Or paste URL */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Or paste URL</span>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-adhi-primary/20 focus:border-adhi-primary transition-all"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.target.value) {
                            setFormImages(prev => [...prev, e.target.value]);
                            e.target.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Component Selection ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Kit Components
                  </label>
                  <p className="text-[11px] text-gray-400 mb-3">Select the building components included in this house kit.</p>
                  <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-1">
                    {allComponents.map(comp => {
                      const selected = form.components.includes(comp.id);
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => toggleComponent(comp.id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                            selected
                              ? "border-adhi-primary bg-adhi-light/60 shadow-sm"
                              : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                              selected
                                ? "bg-adhi-primary border-adhi-primary"
                                : "border-gray-300"
                            }`}
                          >
                            {selected && <CheckCircle2 size={14} className="text-white" />}
                          </div>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${categoryColors[comp.category] || "bg-gray-100 text-gray-500"}`}>
                            {comp.category}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{comp.name}</p>
                            <p className="text-[11px] text-gray-400 truncate">{comp.description}</p>
                          </div>
                          <span className="text-[10px] font-mono text-gray-300 shrink-0">{comp.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  {editingId && (
                    <button
                      onClick={() => {
                        const original = houses.find(h => h.id === editingId);
                        if (original) openEditForm(original);
                      }}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw size={14} /> Reset
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="bg-adhi-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-adhi-dark transition-all flex items-center gap-2 shadow-lg shadow-adhi-primary/20"
                  >
                    <Save size={14} />
                    {editingId ? "Save Changes" : "Create House Type"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── CSS animations ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
