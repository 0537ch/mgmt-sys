import React, { useEffect, useState } from 'react';
import { fetchMenuGroupSelect } from '../../api/menugroupApi';

const MenuGroupSelector = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk menyimpan FULL OBJECT dari item yang dipilih
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await fetchMenuGroupSelect();
        setOptions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadOptions();
  }, []);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    // Cari object lengkap berdasarkan value yang dipilih
    const item = options.find(opt => opt.value === selectedValue);
    setSelectedItem(item || null);
  };

  // Helper untuk membersihkan label agar tidak ada "(  )"
  const cleanLabel = (label) => {
    return label.replace('(  )', '').trim();
  };

  if (loading) return <div>Memuat pilihan menu...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-100">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Pilih Menu Group
      </label>
      
      {/* DROPDOWN / SELECT */}
      <div className="relative">
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
          onChange={handleSelectChange}
          defaultValue=""
        >
          <option value="" disabled>-- Silakan Pilih --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {/* Kita bersihkan labelnya di sini */}
              {cleanLabel(opt.label)}
            </option>
          ))}
        </select>
      </div>

      {/* PREVIEW DETAIL (Hanya muncul jika item dipilih & punya data sistem) */}
      {selectedItem && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100 animate-fadeIn">
          <h3 className="text-md font-bold text-gray-800 mb-2">Informasi Terpilih</h3>
          <p className="text-sm text-gray-600">ID: <span className="font-mono font-bold">{selectedItem.value}</span></p>
          <p className="text-sm text-gray-600">Label Asli: {selectedItem.label}</p>

          {/* Logic: Jika field 'sistem' ada isinya (seperti ID 30) */}
          {selectedItem.sistem ? (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                Terhubung ke Sistem
              </span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">Nama Sistem:</span>
                  <p className="font-semibold">{selectedItem.sistem.nama}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">URL:</span>
                  <p className="font-mono text-xs">{selectedItem.sistem.destination}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                Tidak ada data sistem
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuGroupSelector;