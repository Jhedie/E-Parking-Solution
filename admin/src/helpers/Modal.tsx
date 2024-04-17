import cn from "classnames";
import React, { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
type Props = {
  children: React.ReactNode;
  open: boolean;
  // add disableClickOutside
  disableClickOutside?: boolean;
  //add onClose event so that we can close the modal from inside the component
  onClose(): void;
};

const Modal = ({ children, open, disableClickOutside, onClose }: Props) => {
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    if (!disableClickOutside) {
      onClose();
    }
  });

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle backdrop-blur-2xl text-black": true,
    "modal-open": open,
  });
  return (
    <div className={modalClass}>
      <div className="modal-box" ref={ref}>
        {children}
      </div>
    </div>
  );
};

// source: "https://github.com/jmarioste/daisyui-modal/blob/main/components/Modal.tsx";

export default Modal;
