'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
}

export default function Select({ value, onChange, options, placeholder = 'Select…', label }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((o) => o.value === value);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
  }, []);

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, [open]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
      }
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>
          {label}
        </label>
      )}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '11px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          fontSize: 14,
          background: 'var(--bg)',
          color: selected ? 'var(--text)' : 'var(--text-muted)',
          outline: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          transition: 'border-color 0.2s',
          textAlign: 'left',
        }}
        className="cust-select-trigger"
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, opacity: 0.5 }}
        >
          <path d="M6 9l6 6 6-6"/>
        </motion.svg>
      </button>

      {typeof window === 'object' && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scaleY: 0.97, transformOrigin: 'top' }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: pos.top,
                left: pos.left,
                width: pos.width,
                zIndex: 9999,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
                overflow: 'hidden',
                maxHeight: 240,
                overflowY: 'auto',
              }}
              className="cust-select-dropdown"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: 'none',
                    background: option.value === value ? 'var(--gray-50)' : 'transparent',
                    color: 'var(--text)',
                    fontSize: 14,
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'background 0.12s',
                    fontWeight: option.value === value ? 600 : 400,
                  }}
                  className="cust-select-option"
                >
                  {option.value === value && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                  <span style={{ marginLeft: option.value === value ? 0 : 22 }}>{option.label}</span>
                </button>
              ))}
              {options.length === 0 && (
                <div style={{ padding: '14px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                  No options
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <style>{`
        .cust-select-trigger:focus {
          border-color: var(--black) !important;
        }
        .cust-select-trigger:hover {
          border-color: var(--gray-400) !important;
        }
        .cust-select-option:hover {
          background: var(--gray-50) !important;
        }
        .cust-select-dropdown::-webkit-scrollbar {
          width: 4px;
        }
        .cust-select-dropdown::-webkit-scrollbar-thumb {
          background: var(--gray-300);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
