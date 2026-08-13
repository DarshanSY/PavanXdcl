import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ShieldAlert, Download, UploadCloud, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const { refreshStudents } = useAdmin();
  const password = 'PavanAdmin@2026';
  const [successMsg, setSuccessMsg] = useState('');

  const keysToBackup = [
    'pavanxdcl_users',
    'pavanxdcl_admin_dsa_content',
    'pavanxdcl_admin_fs_content',
    'pavanxdcl_admin_apt_content',
    'pavanxdcl_success_stories',
    'pavanxdcl_announcements'
  ];

  const handleExportBackup = () => {
    const backupData: Record<string, string | null> = {};
    keysToBackup.forEach(key => {
      backupData[key] = localStorage.getItem(key);
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pavanxdcl_admin_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMsg('Backup database JSON file downloaded successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backupData = JSON.parse(event.target?.result as string);
        
        // Validate keys
        Object.keys(backupData).forEach(key => {
          if (keysToBackup.includes(key) && backupData[key] !== null) {
            localStorage.setItem(key, backupData[key]);
          }
        });

        refreshStudents();
        alert('Database restore complete! Refreshing active workspace elements.');
        window.location.reload();
      } catch (err) {
        alert('Failed to parse database backup file. Ensure it is a valid backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleWipeDatabase = () => {
    if (window.confirm('🚨 WARNING: You are about to clear all local databases. This will delete all student progress logs, success stories, and custom videos. Are you sure?')) {
      if (window.confirm('Final Confirmation: Are you absolutely certain you want to wipe local databases?')) {
        keysToBackup.forEach(key => localStorage.removeItem(key));
        alert('Database wiped completely. Reloading layout...');
        window.location.reload();
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="section-header">
        <div>
          <h2 className="section-title">Site Settings & Utilities</h2>
          <p className="text-xs text-secondary mt-1 font-mono">// Configure security metrics, export local backups, and run diagnostics</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald/10 border border-emerald/20 rounded-2xl text-emerald text-xs font-semibold font-mono">
          ✓ {successMsg}
        </div>
      )}

      {/* Security Credentials info */}
      <div className="glass-card glass-card-glow-purple rounded-3xl p-6 flex flex-col gap-4">
        <h3 className="font-syne text-sm font-bold text-white mb-2 flex items-center gap-2">
          <ShieldAlert className="text-purple" size={16} /> Admin Portal Credentials
        </h3>
        <p className="text-xs text-secondary leading-relaxed font-mono">
          // Admin portal parameters are securely compiled into the build client. Credentials cannot be modified dynamically from localStorage for enhanced local security.
        </p>
        <div className="grid-2 mt-2">
          <div>
            <label className="label">Admin Username</label>
            <input type="text" className="input bg-white/5 border-white/10" value="admin@pavanxdcl.in" disabled />
          </div>
          <div>
            <label className="label">Portal Security Password</label>
            <input type="text" className="input bg-white/5 border-white/10" value={password} disabled />
          </div>
        </div>
      </div>

      {/* Database Backup & Restore */}
      <div className="glass-card rounded-3xl p-6 flex flex-col gap-5">
        <h3 className="font-syne text-sm font-bold text-white flex items-center gap-2">
          <RefreshCw className="text-purple" size={16} /> Database Lifecycle Management
        </h3>
        <p className="text-xs text-secondary leading-relaxed font-mono">
          // Because the website currently uses browser storage, we highly recommend exporting periodically to safeguard user progress logs and syllabus additions.
        </p>

        <div className="flex flex-wrap gap-4 mt-2">
          <button onClick={handleExportBackup} className="btn btn-primary text-white">
            <Download size={14} /> Export Backup JSON
          </button>
          
          <div className="relative inline-flex items-center">
            <button className="btn btn-ghost hover:border-purple/20 transition-all">
              <UploadCloud size={14} /> Import Backup File
            </button>
            <input 
              type="file" 
              accept=".json"
              onChange={handleImportBackup}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-3xl p-6 border-red/20 bg-red/5 flex flex-col gap-4">
        <h3 className="font-syne text-sm font-bold text-red flex items-center gap-2">
          🚨 Danger Zone
        </h3>
        <p className="text-xs text-secondary leading-relaxed font-mono">
          // Operations here are permanent and destructive. Ensure you have exported a valid backup before performing any sweeps.
        </p>
        <div>
          <button onClick={handleWipeDatabase} className="btn btn-danger font-bold text-xs py-3 rounded-xl transition-all font-syne">
            Wipe Local Databases Completely
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
