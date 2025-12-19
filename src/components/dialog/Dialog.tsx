import React from 'react';
import Portal from './Portal';
import { IoMdClose } from "react-icons/io";


const Dialog = React.memo<{ isOpen: boolean, onClose: () => void, title:string, children: React.ReactNode }>(({ isOpen, title, onClose, children }) => {
  console.log("Dialog isOpen:", isOpen);
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <h1 style={{'position':'absolute', 'left':'50%', 'transform':'translateX(-50%)'}}>{title}</h1>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Stop events from bubbling to overlay */}
          {children}
          <button onClick={onClose}><IoMdClose /></button>
        </div>
      </div>
    </Portal>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
