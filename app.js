"use strict";

/* ╔═══════════════════════════════════════════════════════╗
   ║  OOP PRINCIPLE: ABSTRACTION                         ║
   ║  Abstract base classes define the interface that     ║
   ║  all subclasses must implement.                      ║
   ╚═══════════════════════════════════════════════════════╝ */

/**
 * Abstract base class for any entity with an auto-incrementing ID.
 * Cannot be instantiated directly — subclasses must exist.
 */
class BaseEntity {
    #id; // Private field (ENCAPSULATION)

    constructor(id = null) {
        if (new.target === BaseEntity) {
            throw new Error("Cannot instantiate abstract class BaseEntity.");
        }
        this.#id = id || BaseEntity._nextId++;
    }

    get id() { return this.#id; }

    static _nextId = 1;

    // ABSTRACT methods — must be overridden
    get displayInfo() { throw new Error("Abstract getter must be implemented."); }
    get type() { throw new Error("Abstract getter must be implemented."); }
    toJSON() { throw new Error("Abstract method must be implemented."); }
}

/**
 * Abstract RepairItem — defines the contract all repairs must follow.
 * This is the core abstraction: every repair can calculate cost, show details, etc.
 */
class RepairItem extends BaseEntity {
    #status;       // ENCAPSULATION: private field
    #priority;
    #createdAt;

    constructor(id, status = "Pending", priority = "Normal") {
        super(id);
        this.#status = status;
        this.#priority = priority;
        this.#createdAt = new Date();
    }

    // ── ABSTRACTION: defining interface ──
    get type() { throw new Error("Subclasses must declare device type."); }

    /** Each subclass must compute cost differently → POLYMORPHISM */
    calculateCost() { throw new Error("Subclasses must implement calculateCost()."); }

    /** Each subclass formats its own detail string → POLYMORPHISM */
    getDeviceSpecs() { throw new Error("Subclasses must implement getDeviceSpecs()."); }

    /** Polymorphic display string */
    get displayInfo() { return `${this.type} Repair #${this.id}`; }

    // ── ENCAPSULATION: controlled access via getters/setters ──
    get status() { return this.#status; }
    set status(val) {
        const allowed = ["Pending", "In Progress", "Completed", "Ready for Pickup", "Cancelled"];
        if (!allowed.includes(val)) throw new Error(`Invalid status: ${val}`);
        this.#status = val;
    }

    get priority() { return this.#priority; }
    set priority(val) { this.#priority = val; }

    get createdAt() { return this.#createdAt; }
    set createdAt(d) { this.#createdAt = d; }

    // Polymorphic JSON serialization
    toJSON() {
        return {
            id: this.id,
            status: this.#status,
            priority: this.#priority,
            createdAt: this.#createdAt.toISOString(),
            ...this.getDeviceSpecs()    // each subclass provides its own data
        };
    }
}


/* ╔═══════════════════════════════════════════════════════╗
   ║  OOP PRINCIPLE: INHERITANCE + POLYMORPHISM          ║
   ║  ComputerRepair and SmartphoneRepair extend         ║
   ║  RepairItem and override its abstract methods.      ║
   ╚═══════════════════════════════════════════════════════╝ */

class ComputerRepair extends RepairItem {
    #deviceName;
    #os;
    #issue;
    #partsCost;
    #laborHours;
    #customerId;
    #technicianId;
    #notes;

    constructor(data = {}) {
        super(data.id, data.status, data.priority);
        this.#deviceName   = data.deviceName || "";
        this.#os           = data.os || "";
        this.#issue        = data.issue || "";
        this.#partsCost    = data.partsCost || 0;
        this.#laborHours   = data.laborHours || 1;
        this.#customerId   = data.customerId || null;
        this.#technicianId = data.technicianId || null;
        this.#notes        = data.notes || "";
        if (data.createdAt) this.createdAt = new Date(data.createdAt);
    }

    // POLYMORPHISM: override type getter
    get type() { return "Computer"; }

    // POLYMORPHISM: computer-specific cost formula (base rate $40/hr)
    calculateCost() {
        const laborCost = this.#laborHours * 40;
        return +(this.#partsCost + laborCost).toFixed(2);
    }

    // POLYMORPHISM: return computer-specific specs
    getDeviceSpecs() {
        return {
            deviceType: "Computer",
            deviceName: this.#deviceName,
            os: this.#os,
            issue: this.#issue,
            partsCost: this.#partsCost,
            laborHours: this.#laborHours,
            customerId: this.#customerId,
            technicianId: this.#technicianId,
            notes: this.#notes
        };
    }

    get displayInfo() { return `💻 ${this.#deviceName} (Computer #${this.id})`; }

    // Getters & setters (ENCAPSULATION)
    get deviceName() { return this.#deviceName; }
    set deviceName(v) { this.#deviceName = v; }
    get os() { return this.#os; }
    set os(v) { this.#os = v; }
    get issue() { return this.#issue; }
    set issue(v) { this.#issue = v; }
    get partsCost() { return this.#partsCost; }
    set partsCost(v) { this.#partsCost = v; }
    get laborHours() { return this.#laborHours; }
    set laborHours(v) { this.#laborHours = v; }
    get customerId() { return this.#customerId; }
    set customerId(v) { this.#customerId = v; }
    get technicianId() { return this.#technicianId; }
    set technicianId(v) { this.#technicianId = v; }
    get notes() { return this.#notes; }
    set notes(v) { this.#notes = v; }
}


class SmartphoneRepair extends RepairItem {
    #deviceName;
    #phoneOS;
    #issue;
    #partsCost;
    #laborHours;
    #customerId;
    #technicianId;
    #notes;

    constructor(data = {}) {
        super(data.id, data.status, data.priority);
        this.#deviceName   = data.deviceName || "";
        this.#phoneOS      = data.phoneOS || "";
        this.#issue        = data.issue || "";
        this.#partsCost    = data.partsCost || 0;
        this.#laborHours   = data.laborHours || 0.5;
        this.#customerId   = data.customerId || null;
        this.#technicianId = data.technicianId || null;
        this.#notes        = data.notes || "";
        if (data.createdAt) this.createdAt = new Date(data.createdAt);
    }

    // POLYMORPHISM
    get type() { return "Smartphone"; }

    // POLYMORPHISM: smartphone cost formula (base rate $30/hr)
    calculateCost() {
        const laborCost = this.#laborHours * 30;
        return +(this.#partsCost + laborCost).toFixed(2);
    }

    // POLYMORPHISM: smartphone-specific specs
    getDeviceSpecs() {
        return {
            deviceType: "Smartphone",
            deviceName: this.#deviceName,
            phoneOS: this.#phoneOS,
            issue: this.#issue,
            partsCost: this.#partsCost,
            laborHours: this.#laborHours,
            customerId: this.#customerId,
            technicianId: this.#technicianId,
            notes: this.#notes
        };
    }

    get displayInfo() { return `📱 ${this.#deviceName} (Phone #${this.id})`; }

    get deviceName() { return this.#deviceName; }
    set deviceName(v) { this.#deviceName = v; }
    get phoneOS() { return this.#phoneOS; }
    set phoneOS(v) { this.#phoneOS = v; }
    get issue() { return this.#issue; }
    set issue(v) { this.#issue = v; }
    get partsCost() { return this.#partsCost; }
    set partsCost(v) { this.#partsCost = v; }
    get laborHours() { return this.#laborHours; }
    set laborHours(v) { this.#laborHours = v; }
    get customerId() { return this.#customerId; }
    set customerId(v) { this.#customerId = v; }
    get technicianId() { return this.#technicianId; }
    set technicianId(v) { this.#technicianId = v; }
    get notes() { return this.#notes; }
    set notes(v) { this.#notes = v; }
}


/* ╔═══════════════════════════════════════════════════════╗
   ║  OOP PRINCIPLE: ENCAPSULATION                       ║
   ║  Person class hides private fields, Customer and     ║
   ║  Technician extend it.                               ║
   ╚═══════════════════════════════════════════════════════╝ */

class Person extends BaseEntity {
    #name;
    #email;
    #phone;
    #address;

    constructor(id, name, email, phone, address = "") {
        super(id);
        this.#name    = name;
        this.#email   = email;
        this.#phone   = phone;
        this.#address = address;
    }

    get name() { return this.#name; }
    set name(v) { this.#name = v; }
    get email() { return this.#email; }
    set email(v) { this.#email = v; }
    get phone() { return this.#phone; }
    set phone(v) { this.#phone = v; }
    get address() { return this.#address; }
    set address(v) { this.#address = v; }

    get displayInfo() { return this.#name; }
    get type() { return "Person"; }
    toJSON() { return { id: this.id, name: this.#name, email: this.#email, phone: this.#phone, address: this.#address }; }
}

class Customer extends Person {
    #loyaltyTier;

    constructor(data = {}) {
        super(data.id, data.name, data.email, data.phone, data.address);
        this.#loyaltyTier = data.loyaltyTier || "Standard";
    }

    get loyaltyTier() { return this.#loyaltyTier; }
    set loyaltyTier(v) { this.#loyaltyTier = v; }
    get type() { return "Customer"; }
    get displayInfo() { return `👤 ${this.name}`; }

    toJSON() { return { ...super.toJSON(), loyaltyTier: this.#loyaltyTier }; }
}

class Technician extends Person {
    #specialization;
    #hourlyRate;
    #skills;
    #rating;

    constructor(data = {}) {
        super(data.id, data.name, data.email, data.phone);
        this.#specialization = data.specialization || "";
        this.#hourlyRate     = data.hourlyRate || 25;
        this.#skills         = data.skills || [];
        this.#rating         = data.rating || 4.5;
    }

    get specialization() { return this.#specialization; }
    set specialization(v) { this.#specialization = v; }
    get hourlyRate() { return this.#hourlyRate; }
    set hourlyRate(v) { this.#hourlyRate = v; }
    get skills() { return [...this.#skills]; }
    set skills(v) { this.#skills = [...v]; }
    get rating() { return this.#rating; }
    set rating(v) { this.#rating = v; }

    get type() { return "Technician"; }
    get displayInfo() { return `🧑‍🔧 ${this.name} (${this.#specialization})`; }

    toJSON() {
        return { ...super.toJSON(), specialization: this.#specialization, hourlyRate: this.#hourlyRate, skills: this.#skills, rating: this.#rating };
    }
}


/* ╔═══════════════════════════════════════════════════════╗
   ║  Invoice — ENCAPSULATION + uses POLYMORPHISM via    ║
   ║  RepairItem.calculateCost()                          ║
   ╚═══════════════════════════════════════════════════════╝ */

class Invoice extends BaseEntity {
    #repairId;
    #customerId;
    #partsCost;
    #laborCost;
    #taxRate;
    #paid;

    constructor(data = {}) {
        super(data.id);
        this.#repairId  = data.repairId;
        this.#customerId = data.customerId;
        this.#partsCost = data.partsCost || 0;
        this.#laborCost = data.laborCost || 0;
        this.#taxRate   = data.taxRate || 0.08;
        this.#paid      = data.paid || false;
    }

    // Polymorphic: calls whatever repair's calculateCost is
    get subtotal() { return +(this.#partsCost + this.#laborCost).toFixed(2); }
    get tax() { return +(this.subtotal * this.#taxRate).toFixed(2); }
    get total() { return +(this.subtotal + this.tax).toFixed(2); }

    get repairId() { return this.#repairId; }
    get customerId() { return this.#customerId; }
    get partsCost() { return this.#partsCost; }
    get laborCost() { return this.#laborCost; }
    get paid() { return this.#paid; }
    set paid(v) { this.#paid = v; }
    get type() { return "Invoice"; }
    get displayInfo() { return `Invoice #${this.id}`; }

    toJSON() {
        return { id: this.id, repairId: this.#repairId, customerId: this.#customerId, partsCost: this.#partsCost, laborCost: this.#laborCost, taxRate: this.#taxRate, paid: this.#paid };
    }
}


/* ╔═══════════════════════════════════════════════════════╗
   ║  Data Store — ENCAPSULATION                          ║
   ║  Centralized CRUD with localStorage persistence      ║
   ╚═══════════════════════════════════════════════════════╝ */

class DataStore {
    #repairs = [];
    #customers = [];
    #technicians = [];
    #invoices = [];
    #listeners = [];

    constructor() { this.#load(); }

    // ── Persistence (ENCAPSULATION) ──
    #load() {
        try {
            const raw = localStorage.getItem("repairShopData");
            if (raw) {
                const d = JSON.parse(raw);
                this.#customers   = (d.customers || []).map(c => new Customer(c));
                this.#technicians = (d.technicians || []).map(t => new Technician(t));
                this.#invoices    = (d.invoices || []).map(i => new Invoice(i));
                // Reconstruct repair objects using polymorphic factory
                this.#repairs = (d.repairs || []).map(r => RepairFactory.create(r));
                // Restore BaseEntity._nextId
                const allIds = [...this.#repairs, ...this.#customers, ...this.#technicians, ...this.#invoices].map(e => e.id);
                BaseEntity._nextId = allIds.length ? Math.max(...allIds) + 1 : 1;
            }
        } catch (e) { console.warn("Failed to load data:", e); }
    }

    #save() {
        const d = {
            repairs:      this.#repairs.map(r => r.toJSON()),
            customers:    this.#customers.map(c => c.toJSON()),
            technicians:  this.#technicians.map(t => t.toJSON()),
            invoices:     this.#invoices.map(i => i.toJSON()),
        };
        localStorage.setItem("repairShopData", JSON.stringify(d));
        this.#notify();
    }

    // Observer pattern for UI updates
    subscribe(fn) { this.#listeners.push(fn); }
    #notify() { this.#listeners.forEach(fn => fn()); }

    // ── CRUD: Repairs ──
    get repairs() { return [...this.#repairs]; }

    addRepair(data) {
        const repair = RepairFactory.create(data);
        this.#repairs.push(repair);
        this.#save();
        return repair;
    }

    updateRepair(id, updates) {
        const idx = this.#repairs.findIndex(r => r.id === id);
        if (idx === -1) throw new Error("Repair not found");
        // Reconstruct to apply changes cleanly
        const old = this.#repairs[idx];
        const merged = { ...old.toJSON(), ...updates, id };
        this.#repairs[idx] = RepairFactory.create(merged);
        this.#save();
        return this.#repairs[idx];
    }

    deleteRepair(id) {
        this.#repairs = this.#repairs.filter(r => r.id !== id);
        this.#save();
    }

    getRepairById(id) { return this.#repairs.find(r => r.id === id); }

    // ── CRUD: Customers ──
    get customers() { return [...this.#customers]; }
    addCustomer(data) {
        const c = new Customer({ ...data });
        this.#customers.push(c);
        this.#save();
        return c;
    }
    updateCustomer(id, data) {
        const idx = this.#customers.findIndex(c => c.id === id);
        if (idx === -1) throw new Error("Customer not found");
        this.#customers[idx] = new Customer({ ...data, id });
        this.#save();
    }
    deleteCustomer(id) {
        this.#customers = this.#customers.filter(c => c.id !== id);
        this.#save();
    }
    getCustomerById(id) { return this.#customers.find(c => c.id === id); }

    // ── CRUD: Technicians ──
    get technicians() { return [...this.#technicians]; }
    addTechnician(data) {
        const t = new Technician({ ...data });
        this.#technicians.push(t);
        this.#save();
        return t;
    }
    updateTechnician(id, data) {
        const idx = this.#technicians.findIndex(t => t.id === id);
        if (idx === -1) throw new Error("Technician not found");
        this.#technicians[idx] = new Technician({ ...data, id });
        this.#save();
    }
    deleteTechnician(id) {
        this.#technicians = this.#technicians.filter(t => t.id !== id);
        this.#save();
    }
    getTechnicianById(id) { return this.#technicians.find(t => t.id === id); }

    // ── Invoices ──
    get invoices() { return [...this.#invoices]; }
    addInvoice(data) {
        const inv = new Invoice(data);
        this.#invoices.push(inv);
        this.#save();
        return inv;
    }

    // ── Stats (uses POLYMORPHISM: calculateCost() on each repair type) ──
    getStats() {
        const repairs = this.#repairs;
        return {
            totalRepairs:   repairs.length,
            pending:        repairs.filter(r => r.status === "Pending").length,
            inProgress:     repairs.filter(r => r.status === "In Progress").length,
            completed:      repairs.filter(r => r.status === "Completed").length,
            ready:          repairs.filter(r => r.status === "Ready for Pickup").length,
            computers:      repairs.filter(r => r.type === "Computer").length,
            smartphones:    repairs.filter(r => r.type === "Smartphone").length,
            totalRevenue:   repairs.reduce((sum, r) => sum + r.calculateCost(), 0),
            totalCustomers: this.#customers.length,
            totalTechs:     this.#technicians.length,
        };
    }
}


/* ╔═══════════════════════════════════════════════════════╗
   ║  Repair Factory — POLYMORPHISM                       ║
   ║  Creates the correct subclass based on deviceType    ║
   ╚═══════════════════════════════════════════════════════╝ */

const RepairFactory = {
    create(data) {
        switch (data.deviceType || data.device_type) {
            case "Computer":    return new ComputerRepair(data);
            case "Smartphone":  return new SmartphoneRepair(data);
            default:            return new ComputerRepair(data); // fallback
        }
    }
};


/* ═══════════════════════════════════════════════════════
   APPLICATION CONTROLLER
   ═══════════════════════════════════════════════════════ */

const store = new DataStore();

// ── Navigation ──
const navItems = document.querySelectorAll(".nav-item");
const pages    = document.querySelectorAll(".page");
const titles   = {
    dashboard:   ["Dashboard", "Overview of your repair shop"],
    repairs:     ["Repairs", "Manage all repair jobs"],
    customers:   ["Customers", "Your customer database"],
    technicians: ["Technicians", "Technician management"],
    billing:     ["Billing", "Invoices and revenue"],
};

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const page = item.dataset.page;
        navItems.forEach(n => n.classList.remove("active"));
        item.classList.add("active");
        pages.forEach(p => p.classList.remove("active"));
        document.getElementById(`page-${page}`).classList.add("active");
        document.getElementById("pageTitle").textContent = titles[page][0];
        document.getElementById("pageSubtitle").textContent = titles[page][1];
        renderAll();
    });
});

document.getElementById("addNewBtn").addEventListener("click", () => openRepairModal());

// ── Toast ──
function toast(msg, type = "success") {
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    document.getElementById("toastContainer").appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// ── Modal helpers ──
function openModal(id) { document.getElementById(id).classList.add("active"); }
function closeModal(id) { document.getElementById(id).classList.remove("active"); }

// Close modals on overlay click
document.querySelectorAll(".modal-overlay").forEach(ov => {
    ov.addEventListener("click", e => { if (e.target === ov) ov.classList.remove("active"); });
});

// ── Populate customer & technician dropdowns ──
function populateDropdowns() {
    const custSel = document.getElementById("repairCustomer");
    const techSel = document.getElementById("repairTechnician");

    custSel.innerHTML = '<option value="">Select customer...</option>' +
        store.customers.map(c => `<option value="${c.id}">${c.name}</option>`).join("");

    techSel.innerHTML = '<option value="">Unassigned</option>' +
        store.technicians.map(t => `<option value="${t.id}">${t.name} (${t.specialization})</option>`).join("");
}

function toggleDeviceFields() {
    const type = document.getElementById("repairDeviceType").value;
    document.getElementById("computerSpecGroup").style.display = type === "Computer" ? "" : "none";
    document.getElementById("phoneSpecGroup").style.display = type === "Smartphone" ? "" : "none";
}


/* ═══════════════════════════════════════════════════════
   REPAIR CRUD HANDLERS
   ═══════════════════════════════════════════════════════ */

function openRepairModal(id = null) {
    populateDropdowns();
    const form = document.getElementById("repairForm");
    form.reset();
    document.getElementById("repairId").value = "";
    document.getElementById("repairModalTitle").textContent = id ? "Edit Repair" : "New Repair";

    if (id) {
        const r = store.getRepairById(id);
        if (!r) return;
        const specs = r.getDeviceSpecs();
        document.getElementById("repairId").value = r.id;
        document.getElementById("repairDeviceType").value = specs.deviceType;
        document.getElementById("repairDeviceName").value = specs.deviceName;
        document.getElementById("repairCustomer").value = specs.customerId || "";
        document.getElementById("repairTechnician").value = specs.technicianId || "";
        document.getElementById("repairIssue").value = specs.issue;
        document.getElementById("repairStatus").value = r.status;
        document.getElementById("repairPriority").value = r.priority;
        document.getElementById("repairPartsCost").value = specs.partsCost;
        document.getElementById("repairLaborHours").value = specs.laborHours;
        document.getElementById("repairNotes").value = specs.notes || "";
        if (specs.deviceType === "Computer") {
            document.getElementById("repairOS").value = specs.os || "";
        } else if (specs.deviceType === "Smartphone") {
            document.getElementById("repairPhoneOS").value = specs.phoneOS || "";
        }
        toggleDeviceFields();
    } else {
        toggleDeviceFields();
    }
    openModal("repairModal");
}

function saveRepair(e) {
    e.preventDefault();
    const id = document.getElementById("repairId").value;
    const data = {
        deviceType:   document.getElementById("repairDeviceType").value,
        deviceName:   document.getElementById("repairDeviceName").value,
        customerId:   +document.getElementById("repairCustomer").value || null,
        technicianId: +document.getElementById("repairTechnician").value || null,
        issue:        document.getElementById("repairIssue").value,
        status:       document.getElementById("repairStatus").value,
        priority:     document.getElementById("repairPriority").value,
        partsCost:    +document.getElementById("repairPartsCost").value || 0,
        laborHours:   +document.getElementById("repairLaborHours").value || 1,
        notes:        document.getElementById("repairNotes").value,
        os:           document.getElementById("repairOS").value,
        phoneOS:      document.getElementById("repairPhoneOS").value,
    };

    if (id) {
        store.updateRepair(+id, data);
        toast("Repair updated successfully!");
    } else {
        store.addRepair(data);
        toast("Repair created successfully!");
    }
    closeModal("repairModal");
    renderAll();
}

function deleteRepair(id) {
    if (!confirm("Delete this repair?")) return;
    store.deleteRepair(id);
    toast("Repair deleted.", "info");
    renderAll();
}

function viewRepair(id) {
    const r = store.getRepairById(id);
    if (!r) return;
    const specs = r.getDeviceSpecs();
    const cust = store.getCustomerById(specs.customerId);
    const tech = store.getTechnicianById(specs.technicianId);
    const cost = r.calculateCost(); // POLYMORPHISM in action

    document.getElementById("detailContent").innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:.9rem;">
            <div><strong>Repair ID:</strong> #${r.id}</div>
            <div><strong>Type:</strong> <span class="badge badge-${r.type === 'Computer' ? 'computer' : 'phone'}">${r.type}</span></div>
            <div><strong>Device:</strong> ${specs.deviceName}</div>
            <div><strong>Status:</strong> <span class="badge badge-${statusClass(r.status)}">${r.status}</span></div>
            <div><strong>Priority:</strong> ${r.priority}</div>
            <div><strong>Date:</strong> ${r.createdAt.toLocaleDateString()}</div>
            <div><strong>Customer:</strong> ${cust ? cust.name : 'N/A'}</div>
            <div><strong>Technician:</strong> ${tech ? tech.name : 'N/A'}</div>
            <div style="grid-column:1/-1;"><strong>Issue:</strong> ${specs.issue}</div>
            ${specs.os ? `<div><strong>OS:</strong> ${specs.os}</div>` : ""}
            ${specs.phoneOS ? `<div><strong>Phone OS:</strong> ${specs.phoneOS}</div>` : ""}
            <div><strong>Parts Cost:</strong> $${specs.partsCost.toFixed(2)}</div>
            <div><strong>Labor Hours:</strong> ${specs.laborHours}h</div>
            <div style="grid-column:1/-1; border-top:1px solid var(--border); padding-top:12px;">
                <strong style="font-size:1.1rem;">Total Cost: $${cost.toFixed(2)}</strong>
                <span style="color:var(--text-muted); font-size:.8rem;"> (Polymorphic calculation: ${r.type === 'Computer' ? '$40/hr' : '$30/hr'} + parts)</span>
            </div>
            ${specs.notes ? `<div style="grid-column:1/-1;"><strong>Notes:</strong> ${specs.notes}</div>` : ""}
        </div>
    `;
    openModal("detailModal");
}


/* ═══════════════════════════════════════════════════════
   CUSTOMER CRUD
   ═══════════════════════════════════════════════════════ */

function openCustomerModal(id = null) {
    const form = document.getElementById("customerForm");
    form.reset();
    document.getElementById("customerId").value = "";
    document.getElementById("customerModalTitle").textContent = id ? "Edit Customer" : "New Customer";

    if (id) {
        const c = store.getCustomerById(id);
        if (!c) return;
        document.getElementById("customerId").value = c.id;
        document.getElementById("customerName").value = c.name;
        document.getElementById("customerEmail").value = c.email;
        document.getElementById("customerPhone").value = c.phone;
        document.getElementById("customerAddress").value = c.address || "";
    }
    openModal("customerModal");
}

function saveCustomer(e) {
    e.preventDefault();
    const id = document.getElementById("customerId").value;
    const data = {
        name:    document.getElementById("customerName").value,
        email:   document.getElementById("customerEmail").value,
        phone:   document.getElementById("customerPhone").value,
        address: document.getElementById("customerAddress").value,
    };
    if (id) {
        store.updateCustomer(+id, data);
        toast("Customer updated!");
    } else {
        store.addCustomer(data);
        toast("Customer added!");
    }
    closeModal("customerModal");
    renderAll();
}

function deleteCustomer(id) {
    if (!confirm("Delete this customer?")) return;
    store.deleteCustomer(id);
    toast("Customer deleted.", "info");
    renderAll();
}


/* ═══════════════════════════════════════════════════════
   TECHNICIAN CRUD
   ═══════════════════════════════════════════════════════ */

function openTechnicianModal(id = null) {
    const form = document.getElementById("technicianForm");
    form.reset();
    document.getElementById("technicianId").value = "";
    document.getElementById("techModalTitle").textContent = id ? "Edit Technician" : "New Technician";

    if (id) {
        const t = store.getTechnicianById(id);
        if (!t) return;
        document.getElementById("technicianId").value = t.id;
        document.getElementById("techName").value = t.name;
        document.getElementById("techSpecialization").value = t.specialization;
        document.getElementById("techPhone").value = t.phone || "";
        document.getElementById("techRate").value = t.hourlyRate;
        document.getElementById("techSkills").value = t.skills.join(", ");
    }
    openModal("technicianModal");
}

function saveTechnician(e) {
    e.preventDefault();
    const id = document.getElementById("technicianId").value;
    const data = {
        name:           document.getElementById("techName").value,
        specialization: document.getElementById("techSpecialization").value,
        phone:          document.getElementById("techPhone").value,
        hourlyRate:     +document.getElementById("techRate").value || 25,
        skills:         document.getElementById("techSkills").value.split(",").map(s => s.trim()).filter(Boolean),
    };
    if (id) {
        store.updateTechnician(+id, data);
        toast("Technician updated!");
    } else {
        store.addTechnician(data);
        toast("Technician added!");
    }
    closeModal("technicianModal");
    renderAll();
}

function deleteTechnician(id) {
    if (!confirm("Delete this technician?")) return;
    store.deleteTechnician(id);
    toast("Technician deleted.", "info");
    renderAll();
}


/* ═══════════════════════════════════════════════════════
   STATUS / UTILITY HELPERS
   ═══════════════════════════════════════════════════════ */

function statusClass(s) {
    const map = { "Pending":"pending", "In Progress":"progress", "Completed":"completed", "Ready for Pickup":"ready", "Cancelled":"cancelled" };
    return map[s] || "pending";
}


/* ═══════════════════════════════════════════════════════
   RENDERING — calls POLYMORPHIC methods on repair objects
   ═══════════════════════════════════════════════════════ */

function renderAll() {
    renderDashboard();
    renderRepairs();
    renderCustomers();
    renderTechnicians();
    renderBilling();
}

function renderDashboard() {
    const s = store.getStats();
    document.getElementById("statsGrid").innerHTML = `
        <div class="stat-card"><div class="stat-icon blue">🔩</div><div class="stat-info"><h3>${s.totalRepairs}</h3><p>Total Repairs</p></div></div>
        <div class="stat-card"><div class="stat-icon orange">⏳</div><div class="stat-info"><h3>${s.pending + s.inProgress}</h3><p>Active Jobs</p></div></div>
        <div class="stat-card"><div class="stat-icon green">✅</div><div class="stat-info"><h3>${s.completed}</h3><p>Completed</p></div></div>
        <div class="stat-card"><div class="stat-icon red">💰</div><div class="stat-info"><h3>$${s.totalRevenue.toFixed(2)}</h3><p>Total Revenue</p></div></div>
    `;

    // Type chart
    const maxType = Math.max(s.computers, s.smartphones, 1);
    document.getElementById("typeChart").innerHTML = `
        <div class="chart-bar-group">
            <div class="chart-bar" style="height:${(s.computers/maxType)*100}%;background:#7c3aed;">
                <span class="tooltip">${s.computers}</span>
            </div>
            <span class="chart-label">💻 Computers</span>
        </div>
        <div class="chart-bar-group">
            <div class="chart-bar" style="height:${(s.smartphones/maxType)*100}%;background:#db2777;">
                <span class="tooltip">${s.smartphones}</span>
            </div>
            <span class="chart-label">📱 Phones</span>
        </div>
    `;

    // Status chart
    const maxStatus = Math.max(s.pending, s.inProgress, s.completed, s.ready, 1);
    document.getElementById("statusChart").innerHTML = `
        <div class="chart-bar-group">
            <div class="chart-bar" style="height:${(s.pending/maxStatus)*100}%;background:#d97706;"><span class="tooltip">${s.pending}</span></div>
            <span class="chart-label">Pending</span>
        </div>
        <div class="chart-bar-group">
            <div class="chart-bar" style="height:${(s.inProgress/maxStatus)*100}%;background:#2563eb;"><span class="tooltip">${s.inProgress}</span></div>
            <span class="chart-label">In Progress</span>
        </div>
        <div class="chart-bar-group">
            <div class="chart-bar" style="height:${(s.completed/maxStatus)*100}%;background:#16a34a;"><span class="tooltip">${s.completed}</span></div>
            <span class="chart-label">Completed</span>
        </div>
        <div class="chart-bar-group">
            <div class="chart-bar" style="height:${(s.ready/maxStatus)*100}%;background:#0891b2;"><span class="tooltip">${s.ready}</span></div>
            <span class="chart-label">Ready</span>
        </div>
    `;

    // Recent activity
    const recent = store.repairs.slice(-5).reverse();
    document.getElementById("recentActivity").innerHTML = recent.length ? recent.map(r => {
        const specs = r.getDeviceSpecs(); // POLYMORPHISM
        const dotColor = r.status === "Completed" ? "var(--success)" : r.status === "In Progress" ? "var(--primary)" : r.status === "Cancelled" ? "var(--danger)" : "var(--warning)";
        return `<div class="activity-item">
            <div class="activity-dot" style="background:${dotColor}"></div>
            <div>
                <div><strong>${specs.deviceName}</strong> — ${specs.issue.substring(0, 60)}${specs.issue.length > 60 ? '...' : ''}</div>
                <div class="activity-time">${r.createdAt.toLocaleDateString()} · $${r.calculateCost().toFixed(2)} · <span class="badge badge-${statusClass(r.status)}">${r.status}</span></div>
            </div>
        </div>`;
    }).join("") : '<div class="empty-state"><p>No recent activity</p></div>';
}

function renderRepairs() {
    const filterStatus = document.getElementById("filterStatus").value;
    const filterType   = document.getElementById("filterType").value;
    const search       = document.getElementById("globalSearch").value.toLowerCase();

    let repairs = store.repairs;

    if (filterStatus) repairs = repairs.filter(r => r.status === filterStatus);
    if (filterType)   repairs = repairs.filter(r => r.type === filterType);
    if (search) {
        repairs = repairs.filter(r => {
            const specs = r.getDeviceSpecs();
            const cust  = store.getCustomerById(specs.customerId);
            return specs.deviceName.toLowerCase().includes(search) ||
                   specs.issue.toLowerCase().includes(search) ||
                   (cust && cust.name.toLowerCase().includes(search));
        });
    }

    const tbody = document.getElementById("repairsTable");
    const empty = document.getElementById("repairsEmpty");

    if (repairs.length === 0) {
        tbody.innerHTML = "";
        empty.style.display = "";
        return;
    }

    empty.style.display = "none";
    tbody.innerHTML = repairs.map(r => {
        const specs = r.getDeviceSpecs(); // POLYMORPHISM
        const cust  = store.getCustomerById(specs.customerId);
        const cost  = r.calculateCost(); // POLYMORPHISM: different cost per type
        return `<tr>
            <td><strong>#${r.id}</strong></td>
            <td>${cust ? cust.name : '<em style="color:var(--text-muted)">N/A</em>'}</td>
            <td>${specs.deviceName}</td>
            <td><span class="badge badge-${r.type === 'Computer' ? 'computer' : 'phone'}">${r.type}</span></td>
            <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${specs.issue}">${specs.issue}</td>
            <td><span class="badge badge-${statusClass(r.status)}">${r.status}</span></td>
            <td><strong>$${cost.toFixed(2)}</strong></td>
            <td>${r.createdAt.toLocaleDateString()}</td>
            <td class="actions">
                <button class="btn btn-sm btn-outline" onclick="viewRepair(${r.id})" title="View">👁</button>
                <button class="btn btn-sm btn-outline" onclick="openRepairModal(${r.id})" title="Edit">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRepair(${r.id})" title="Delete">🗑</button>
            </td>
        </tr>`;
    }).join("");
}

function renderCustomers() {
    const customers = store.customers;
    const tbody = document.getElementById("customersTable");
    const empty = document.getElementById("customersEmpty");

    if (customers.length === 0) {
        tbody.innerHTML = "";
        empty.style.display = "";
        return;
    }

    empty.style.display = "none";
    tbody.innerHTML = customers.map(c => {
        const cRepairs = store.repairs.filter(r => r.getDeviceSpecs().customerId === c.id);
        const totalSpent = cRepairs.reduce((sum, r) => sum + r.calculateCost(), 0); // POLYMORPHISM
        return `<tr>
            <td><strong>#${c.id}</strong></td>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td>${cRepairs.length}</td>
            <td><strong>$${totalSpent.toFixed(2)}</strong></td>
            <td class="actions">
                <button class="btn btn-sm btn-outline" onclick="openCustomerModal(${c.id})" title="Edit">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${c.id})" title="Delete">🗑</button>
            </td>
        </tr>`;
    }).join("");
}

function renderTechnicians() {
    const techs = store.technicians;
    const tbody = document.getElementById("techniciansTable");
    const empty = document.getElementById("techniciansEmpty");

    if (techs.length === 0) {
        tbody.innerHTML = "";
        empty.style.display = "";
        return;
    }

    empty.style.display = "none";
    tbody.innerHTML = techs.map(t => {
        const active  = store.repairs.filter(r => r.getDeviceSpecs().technicianId === t.id && r.status !== "Completed" && r.status !== "Cancelled").length;
        const done    = store.repairs.filter(r => r.getDeviceSpecs().technicianId === t.id && r.status === "Completed").length;
        return `<tr>
            <td><strong>#${t.id}</strong></td>
            <td>${t.name}</td>
            <td>${t.specialization}</td>
            <td>${active}</td>
            <td>${done}</td>
            <td>⭐ ${t.rating.toFixed(1)}</td>
            <td class="actions">
                <button class="btn btn-sm btn-outline" onclick="openTechnicianModal(${t.id})" title="Edit">✏️</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTechnician(${t.id})" title="Delete">🗑</button>
            </td>
        </tr>`;
    }).join("");
}

function renderBilling() {
    const completed = store.repairs.filter(r => r.status === "Completed" || r.status === "Ready for Pickup");

    // Auto-generate invoices for completed repairs without one
    const invoicedIds = new Set(store.invoices.map(i => i.repairId));
    completed.forEach(r => {
        if (!invoicedIds.has(r.id)) {
            const specs = r.getDeviceSpecs();
            const laborCost = specs.laborHours * (r.type === "Computer" ? 40 : 30);
            store.addInvoice({ repairId: r.id, customerId: specs.customerId, partsCost: specs.partsCost, laborCost });
        }
    });

    const invoices = store.invoices;
    const tbody = document.getElementById("billingTable");
    const empty = document.getElementById("billingEmpty");

    // Billing stats
    const totalRev = invoices.reduce((s, i) => s + i.total, 0);
    const paid = invoices.filter(i => i.paid).reduce((s, i) => s + i.total, 0);
    const unpaid = totalRev - paid;

    document.getElementById("billingStats").innerHTML = `
        <div class="stat-card"><div class="stat-icon blue">📄</div><div class="stat-info"><h3>${invoices.length}</h3><p>Total Invoices</p></div></div>
        <div class="stat-card"><div class="stat-icon green">💵</div><div class="stat-info"><h3>$${paid.toFixed(2)}</h3><p>Paid</p></div></div>
        <div class="stat-card"><div class="stat-icon orange">⏳</div><div class="stat-info"><h3>$${unpaid.toFixed(2)}</h3><p>Outstanding</p></div></div>
        <div class="stat-card"><div class="stat-icon red">📊</div><div class="stat-info"><h3>$${totalRev.toFixed(2)}</h3><p>Total Revenue</p></div></div>
    `;

    if (invoices.length === 0) {
        tbody.innerHTML = "";
        empty.style.display = "";
        return;
    }

    empty.style.display = "none";
    tbody.innerHTML = invoices.map(inv => {
        const repair = store.getRepairById(inv.repairId);
        const cust   = store.getCustomerById(inv.customerId);
        return `<tr>
            <td><strong>INV-${String(inv.id).padStart(4, '0')}</strong></td>
            <td>${cust ? cust.name : 'N/A'}</td>
            <td>#${inv.repairId}${repair ? ' (' + repair.getDeviceSpecs().deviceName + ')' : ''}</td>
            <td>$${inv.partsCost.toFixed(2)}</td>
            <td>$${inv.laborCost.toFixed(2)}</td>
            <td>$${inv.tax.toFixed(2)}</td>
            <td><strong>$${inv.total.toFixed(2)}</strong></td>
            <td><span class="badge badge-${inv.paid ? 'completed' : 'pending'}">${inv.paid ? 'Paid' : 'Unpaid'}</span></td>
        </tr>`;
    }).join("");
}

// ── Filter event listeners ──
document.getElementById("filterStatus").addEventListener("change", renderRepairs);
document.getElementById("filterType").addEventListener("change", renderRepairs);
document.getElementById("globalSearch").addEventListener("input", renderRepairs);

// ── Subscribe to data changes ──
store.subscribe(renderAll);

// ═══════════════════════════════════════════════════════
// SEED DEMO DATA (only if empty)
// ═══════════════════════════════════════════════════════
function seedDemoData() {
    if (store.customers.length > 0) return;

    // Customers
    const c1 = store.addCustomer({ name: "Alice Johnson", email: "alice@email.com", phone: "+1 555-0101", address: "123 Oak St" });
    const c2 = store.addCustomer({ name: "Bob Martinez", email: "bob@email.com", phone: "+1 555-0102", address: "456 Pine Ave" });
    const c3 = store.addCustomer({ name: "Carol Lee", email: "carol@email.com", phone: "+1 555-0103", address: "789 Elm Blvd" });

    // Technicians
    const t1 = store.addTechnician({ name: "Mike Chen", specialization: "Computer Hardware", phone: "+1 555-0201", hourlyRate: 40, skills: ["Diagnostics", "Soldering", "Motherboard repair"], rating: 4.8 });
    const t2 = store.addTechnician({ name: "Sara Patel", specialization: "Smartphone Software", phone: "+1 555-0202", hourlyRate: 35, skills: ["iOS", "Android", "Data recovery"], rating: 4.6 });
    const t3 = store.addTechnician({ name: "Tom Wilson", specialization: "General", phone: "+1 555-0203", hourlyRate: 30, skills: ["Screen replacement", "Battery swap", "Diagnostics"], rating: 4.3 });

    // Repairs — demonstrating POLYMORPHISM (different cost formulas)
    store.addRepair({ deviceType: "Computer", deviceName: "Dell XPS 15", customerId: c1.id, technicianId: t1.id, issue: "Overheating and random shutdowns during heavy workloads", status: "In Progress", partsCost: 45, laborHours: 3, priority: "High", os: "Windows 11", notes: "Thermal paste replacement needed" });
    store.addRepair({ deviceType: "Smartphone", deviceName: "iPhone 15 Pro", customerId: c2.id, technicianId: t2.id, issue: "Cracked screen after drop, touch not responding", status: "Completed", partsCost: 120, laborHours: 1.5, priority: "Normal", phoneOS: "iOS", notes: "OEM screen used" });
    store.addRepair({ deviceType: "Computer", deviceName: "MacBook Air M2", customerId: c3.id, technicianId: t1.id, issue: "Keyboard keys sticking, Trackpad erratic behavior", status: "Pending", partsCost: 80, laborHours: 2, priority: "Normal", os: "macOS Ventura", notes: "Customer authorized up to $200" });
    store.addRepair({ deviceType: "Smartphone", deviceName: "Samsung Galaxy S24", customerId: c1.id, technicianId: t3.id, issue: "Battery draining in 3 hours, gets hot during charging", status: "In Progress", partsCost: 35, laborHours: 1, priority: "Normal", phoneOS: "Android", notes: "" });
    store.addRepair({ deviceType: "Smartphone", deviceName: "Google Pixel 8", customerId: c3.id, technicianId: t2.id, issue: "Water damage — fell in pool, won't turn on", status: "Completed", partsCost: 60, laborHours: 2, priority: "Urgent", phoneOS: "Android", notes: "Rice drying didn't work, ultrasonic cleaning done" });
    store.addRepair({ deviceType: "Computer", deviceName: "HP Pavilion Desktop", customerId: c2.id, technicianId: t3.id, issue: "Blue screen of death (BSOD) on boot", status: "Ready for Pickup", partsCost: 0, laborHours: 1.5, priority: "High", os: "Windows 10", notes: "RAM replaced, all tests passed" });
}

seedDemoData();
renderAll();
