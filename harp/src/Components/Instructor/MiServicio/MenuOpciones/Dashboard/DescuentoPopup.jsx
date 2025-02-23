import React, { useState } from 'react';

const DescuentoPopup = ({ isOpen, onClose, onConfirm }) => {
    const [descuento, setDescuento] = useState('');

    if (!isOpen) return null;

    return (
        <div style={styles.popupOverlay}>
            <div style={styles.popupContent}>
                <h3>Ingrese el monto a descontar</h3>
                <input
                    type="number"
                    value={descuento}
                    onChange={(e) => setDescuento(e.target.value)}
                    placeholder="Monto a descontar"
                    style={styles.input}
                />
                <div style={styles.popupButtons}>
                    <button onClick={() => onConfirm(descuento)} style={styles.popupButtonConfirm}>
                        Guardar
                    </button>
                    <button onClick={onClose} style={styles.popupButtonCancel}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popupContent: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '300px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    popupButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    popupButtonConfirm: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    popupButtonCancel: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default DescuentoPopup;