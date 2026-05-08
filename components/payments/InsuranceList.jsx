'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

const STATUS_STYLES = {
  pending: 'bg-yellow-50 text-yellow-600',
  approved: 'bg-green-50 text-green-600',
  rejected: 'bg-red-50 text-red-600',
  partially_approved: 'bg-blue-50 text-blue-600',
};

const Badge = ({ status }) => {
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    partially_approved: 'Partial',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        STATUS_STYLES[status] || 'bg-slate-100 text-slate-500'
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <h2 className="text-lg font-bold">{title}</h2>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="p-6">{children}</div>
    </div>
  </div>
);

function AddCompanyModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    default_coverage_percentage: 80,
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSaving(true);

    try {
      await api.insurance.createCompany(form);
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="🏢 Add Insurance Company" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Company Name *
          </label>

          <input
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Contact Person
          </label>

          <input
            value={form.contact_person}
            onChange={(e) => set('contact_person', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone
            </label>

            <input
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Default Coverage (%)
          </label>

          <input
            type="number"
            min="0"
            max="100"
            value={form.default_coverage_percentage}
            onChange={(e) =>
              set('default_coverage_percentage', e.target.value)
            }
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold"
          >
            {saving ? 'Saving...' : 'Add Company'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CreateClaimModal({
  patients,
  companies,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState({
    patient_id: '',
    insurance_company_id: '',
    policy_number: '',
    claimed_amount: '',
    notes: '',
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const selectedCompany = companies.find(
    (c) => String(c.id) === String(form.insurance_company_id)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSaving(true);

    try {
      await api.insurance.createClaim(form);
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="📋 New Insurance Claim" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Patient *
          </label>

          <select
            required
            value={form.patient_id}
            onChange={(e) => set('patient_id', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select patient...</option>

            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom} {p.prenom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Insurance Company *
          </label>

          <select
            required
            value={form.insurance_company_id}
            onChange={(e) =>
              set('insurance_company_id', e.target.value)
            }
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select company...</option>

            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.default_coverage_percentage}%)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Policy Number *
          </label>

          <input
            required
            value={form.policy_number}
            onChange={(e) => set('policy_number', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Claimed Amount (MAD) *
          </label>

          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.claimed_amount}
            onChange={(e) => set('claimed_amount', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {selectedCompany && form.claimed_amount && (
          <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-1">
            <div>
              Coverage ({selectedCompany.default_coverage_percentage}%):
              <span className="font-bold text-blue-600 ml-1">
                {(
                  form.claimed_amount *
                  selectedCompany.default_coverage_percentage /
                  100
                ).toFixed(2)}{' '}
                MAD
              </span>
            </div>

            <div>
              Patient pays:
              <span className="font-bold text-red-600 ml-1">
                {(
                  form.claimed_amount *
                  (1 -
                    selectedCompany.default_coverage_percentage / 100)
                ).toFixed(2)}{' '}
                MAD
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Notes
          </label>

          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold"
          >
            {saving ? 'Submitting...' : 'Submit Claim'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function InsuranceList() {
  const [claims, setClaims] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showClaim, setShowClaim] = useState(false);
  const [showCompany, setShowCompany] = useState(false);

  const [view, setView] = useState('claims');

  const load = useCallback(() => {
    setLoading(true);

    Promise.all([
      api.insurance.claims(),
      api.insurance.companies(),
      api.patients.getAll(),
    ])
      .then(([cl, co, pt]) => {
        setClaims(cl.data || cl || []);
        setCompanies(Array.isArray(co) ? co : []);
        setPatients(Array.isArray(pt) ? pt : pt.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await api.insurance.updateClaim(id, { status });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex bg-slate-100 rounded-lg p-1">
          {['claims', 'companies'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                view === v
                  ? 'bg-white text-indigo-600 shadow'
                  : 'text-slate-500'
              }`}
            >
              {v === 'claims' ? '📋 Claims' : '🏢 Companies'}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCompany(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
          >
            + Company
          </button>

          <button
            onClick={() => setShowClaim(true)}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold"
          >
            + New Claim
          </button>
        </div>
      </div>

      {/* CLAIMS */}
      {view === 'claims' ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                {[
                  'Patient',
                  'Company',
                  'Policy #',
                  'Claimed',
                  'Approved',
                  'Status',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-slate-400"
                  >
                    No claims found.
                  </td>
                </tr>
              ) : (
                claims.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 text-sm">
                      {c.patient
                        ? `${c.patient.nom} ${c.patient.prenom}`
                        : '—'}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {c.insurance_company?.name || '—'}
                    </td>

                    <td className="px-4 py-3 text-sm font-semibold text-indigo-600">
                      {c.policy_number}
                    </td>

                    <td className="px-4 py-3 text-sm font-semibold">
                      {Number(c.claimed_amount).toFixed(2)} MAD
                    </td>

                    <td className="px-4 py-3 text-sm text-green-600">
                      {Number(c.approved_amount).toFixed(2)} MAD
                    </td>

                    <td className="px-4 py-3">
                      <Badge status={c.status} />
                    </td>

                    <td className="px-4 py-3">
                      {c.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateStatus(c.id, 'approved')
                            }
                            className="px-2 py-1 text-xs rounded bg-green-50 text-green-600 hover:bg-green-100"
                          >
                            ✓ Approve
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(c.id, 'rejected')
                            }
                            className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : companies.length === 0 ? (
            <p className="text-slate-400">
              No companies added yet.
            </p>
          ) : (
            companies.map((co) => (
              <div
                key={co.id}
                className="bg-white rounded-2xl p-5 shadow-sm border-t-4 border-indigo-500"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  🏢 {co.name}
                </h3>

                <div className="text-sm text-slate-500 space-y-2">
                  {co.contact_person && (
                    <div>👤 {co.contact_person}</div>
                  )}

                  {co.phone && <div>📞 {co.phone}</div>}

                  {co.email && <div>✉️ {co.email}</div>}
                </div>

                <div className="mt-4 bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {co.default_coverage_percentage}%
                  </div>

                  <div className="text-xs text-slate-500">
                    Default Coverage
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showClaim && (
        <CreateClaimModal
          patients={patients}
          companies={companies}
          onClose={() => setShowClaim(false)}
          onCreated={() => {
            setShowClaim(false);
            load();
          }}
        />
      )}

      {showCompany && (
        <AddCompanyModal
          onClose={() => setShowCompany(false)}
          onCreated={() => {
            setShowCompany(false);
            load();
          }}
        />
      )}
    </div>
  );
}