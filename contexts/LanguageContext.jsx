'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const dictionary = {
  en: {
    // Common Actions
    save: "Save",
    saving: "Saving...",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    discard: "Discard",
    edit: "Edit",
    create: "Create",
    search: "Search...",
    actions: "Actions",
    status: "Status",
    notes: "Notes",
    add: "Add",
    close: "Close",
    loading: "Loading...",
    success: "Success",
    error: "Error",
    all: "All",

    // Sidebar
    operationalViews: "Operational Views",
    centerManagement: "Center Management",
    adminTerminal: "Admin Terminal",
    doctorSuite: "Doctor Suite",
    staffHub: "Staff Hub",
    patients: "Patients",
    doctors: "Doctors",
    staff: "Staff",
    admins: "Admins",
    rooms: "Rooms",
    payments: "Payments",
    appointments: "Appointments",
    myAppointments: "My Appointments",
    analytics: "Analytics",
    settings: "Settings",
    logout: "Log Out",

    // Login Page
    welcomeBack: "Welcome Back",
    loginSubtitle: "Sign in to access your siha dashboard",
    email: "Email Address",
    password: "Password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    invalidCredentials: "Invalid credentials. Please check your email and password.",

    // Navbar
    searchNavbar: "Search patients, appointments, payments...",
    profile: "Profile",

    // Admin Dashboard / General stats
    totalPatients: "Total Patients",
    activeDoctors: "Active Doctors",
    totalStaff: "Total Staff",
    scheduledApp: "Scheduled Sessions",
    weeklyRevenue: "Weekly Revenue",
    monthlyRevenue: "Monthly Revenue",
    occupancy: "Room Occupancy",
    avgWait: "Avg Wait Time",
    pendingBilling: "Pending Billing",
    recentActivity: "Recent Activity",

    // Patient Page / Directory
    patientDirectory: "Patient Directory",
    patientSub: "Manage and record hospital patient profiles",
    newPatient: "New Patient",
    gender: "Gender",
    dob: "Date of Birth",
    phone: "Phone Number",
    dept: "Department",
    filterDept: "Filter by Department",
    resetFilter: "Reset Filter",
    noPatients: "No patients found for this department.",
    patientName: "Patient Name",
    patientDetails: "Patient Details",
    male: "Male",
    female: "Female",

    // Doctor Directory
    doctorDirectory: "Specialist Directory",
    doctorSub: "Manage medical specialists & clinic departments",
    newDoctor: "New Doctor",
    specialty: "Specialty",
    docName: "Doctor Name",

    // Staff Directory
    staffDirectory: "Staff Directory",
    staffSub: "Manage clinic administrative and nursing staff",
    newStaff: "New Staff member",

    // Admin Management
    adminDirectory: "Administrator Directory",
    adminSub: "Manage platform superusers and system operators",
    newAdmin: "New Admin",

    // Rooms
    roomDirectory: "Room Directory",
    roomSub: "Real-time clinical space allocation and occupancy",
    newRoom: "New Room",
    roomNumber: "Room Number",
    roomType: "Room Type",
    capacity: "Capacity",
    available: "Available",
    occupied: "Occupied",
    maintenance: "Maintenance",
    noRoomAssigned: "No Room Assigned",

    // Appointments
    appointmentHub: "Appointment Hub",
    appointmentSub: "Coordinate clinical sessions and specialist availability",
    bookSession: "Book Session",
    modifyBooking: "Modify Booking",
    scheduleNew: "Schedule New Session",
    date: "Date",
    time: "Time",
    sessionType: "Session Type",
    cancelSession: "Cancel Session",
    keepIt: "Keep It",
    areYouSureCancel: "Are you sure you want to cancel the appointment for",
    doctorDuty: "Staff Duty",
    waitingArea: "Waiting Area",

    // Payments
    financialLedger: "Financial Ledger",
    financialSub: "Real-time billing transactions, receipts, and revenue tracker",
    recordPayment: "Record Payment",
    amount: "Amount",
    method: "Method",
    invoiceId: "Invoice ID",
    cash: "Cash",
    card: "Card",
    insurance: "Insurance",
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",

    // Settings
    systemSettings: "System Settings",
    settingsSub: "Configure your workspace environment and security preferences",
    appearance: "Appearance",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    languageRegion: "Language & Region",
    systemLanguage: "System Language",
    timeZone: "Time Zone",
    general: "General",
    notifications: "Notifications",
    security: "Security",
    account: "Account",
    api: "API & Integrations"
  },
  fr: {
    // Common Actions
    save: "Enregistrer",
    saving: "Enregistrement...",
    saveChanges: "Enregistrer les modifications",
    cancel: "Annuler",
    delete: "Supprimer",
    discard: "Abandonner",
    edit: "Modifier",
    create: "Créer",
    search: "Rechercher...",
    actions: "Actions",
    status: "Statut",
    notes: "Remarques",
    add: "Ajouter",
    close: "Fermer",
    loading: "Chargement...",
    success: "Succès",
    error: "Erreur",
    all: "Tous",

    // Sidebar
    operationalViews: "Vues Opérationnelles",
    centerManagement: "Gestion du Centre",
    adminTerminal: "Terminal Admin",
    doctorSuite: "Suite Médecin",
    staffHub: "Hub Personnel",
    patients: "Patients",
    doctors: "Médecins",
    staff: "Personnel",
    admins: "Admins",
    rooms: "Salles",
    payments: "Paiements",
    appointments: "Rendez-vous",
    myAppointments: "Mes Rendez-vous",
    analytics: "Analyses",
    settings: "Paramètres",
    logout: "Déconnexion",

    // Login Page
    welcomeBack: "Bon retour",
    loginSubtitle: "Connectez-vous pour accéder à votre tableau de bord siha",
    email: "Adresse e-mail",
    password: "Mot de passe",
    signIn: "Se connecter",
    signingIn: "Connexion en cours...",
    invalidCredentials: "Identifiants invalides. Veuillez vérifier votre adresse e-mail et votre mot de passe.",

    // Navbar
    searchNavbar: "Rechercher patients, rendez-vous, paiements...",
    profile: "Profil",

    // Admin Dashboard / General stats
    totalPatients: "Total Patients",
    activeDoctors: "Médecins Actifs",
    totalStaff: "Total Personnel",
    scheduledApp: "Rendez-vous programmés",
    weeklyRevenue: "Revenu Hebdomadaire",
    monthlyRevenue: "Revenu Mensuel",
    occupancy: "Occupation des Salles",
    avgWait: "Temps d'attente moyen",
    pendingBilling: "Facturation en attente",
    recentActivity: "Activité Récente",

    // Patient Page / Directory
    patientDirectory: "Répertoire des Patients",
    patientSub: "Gérer et enregistrer les profils des patients de l'hôpital",
    newPatient: "Nouveau Patient",
    gender: "Genre",
    dob: "Date de naissance",
    phone: "Numéro de téléphone",
    dept: "Département",
    filterDept: "Filtrer par Département",
    resetFilter: "Réinitialiser le filtre",
    noPatients: "Aucun patient trouvé pour ce département.",
    patientName: "Nom du Patient",
    patientDetails: "Détails du Patient",
    male: "Homme",
    female: "Femme",

    // Doctor Directory
    doctorDirectory: "Répertoire des Spécialistes",
    doctorSub: "Gérer les spécialistes médicaux et les départements de la clinique",
    newDoctor: "Nouveau Médecin",
    specialty: "Spécialité",
    docName: "Nom du médecin",

    // Staff Directory
    staffDirectory: "Répertoire du Personnel",
    staffSub: "Gérer le personnel administratif et soignant de la clinique",
    newStaff: "Nouveau membre du personnel",

    // Admin Management
    adminDirectory: "Répertoire des Administrateurs",
    adminSub: "Gérer les superutilisateurs et les opérateurs système de la plateforme",
    newAdmin: "Nouveau Admin",

    // Rooms
    roomDirectory: "Répertoire des Salles",
    roomSub: "Attribution des espaces cliniques et occupation en temps réel",
    newRoom: "Nouvelle Salle",
    roomNumber: "Numéro de salle",
    roomType: "Type de salle",
    capacity: "Capacité",
    available: "Disponible",
    occupied: "Occupée",
    maintenance: "Maintenance",
    noRoomAssigned: "Aucune salle attribuée",

    // Appointments
    appointmentHub: "Gestion des Rendez-vous",
    appointmentSub: "Coordonner les sessions cliniques et la disponibilité des spécialistes",
    bookSession: "Réserver une session",
    modifyBooking: "Modifier la réservation",
    scheduleNew: "Planifier une nouvelle session",
    date: "Date",
    time: "Heure",
    sessionType: "Type de session",
    cancelSession: "Annuler la session",
    keepIt: "La conserver",
    areYouSureCancel: "Êtes-vous sûr de vouloir annuler le rendez-vous pour",
    doctorDuty: "Personnel de garde",
    waitingArea: "Salle d'attente",

    // Payments
    financialLedger: "Journal Financier",
    financialSub: "Transactions de facturation, reçus et suivi des revenus en temps réel",
    recordPayment: "Enregistrer un paiement",
    amount: "Montant",
    method: "Méthode",
    invoiceId: "ID de facture",
    cash: "Espèces",
    card: "Carte bancaire",
    insurance: "Assurance",
    paid: "Payé",
    pending: "En attente",
    failed: "Échoué",

    // Settings
    systemSettings: "Paramètres du Système",
    settingsSub: "Configurez l'environnement de votre espace de travail et vos préférences de sécurité",
    appearance: "Apparence",
    darkMode: "Mode Sombre",
    lightMode: "Mode Clair",
    languageRegion: "Langue & Région",
    systemLanguage: "Langue du système",
    timeZone: "Fuseau horaire",
    general: "Général",
    notifications: "Notifications",
    security: "Sécurité",
    account: "Compte",
    api: "API & Intégrations"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('systemLanguage');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('systemLanguage', lang);
  };

  const t = (key) => {
    if (!dictionary[language]) return key;
    return dictionary[language][key] || dictionary['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
