import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect, useRef } from 'react';
import { useDispatch } from "react-redux";
import { MessageModalInnerProps } from '../types/props';
import {
  hideMessageModal,
} from "../slices/gameSlice";

const MessageModalInner = ({message, modalDisplayAnimation, disableCloseButton} : MessageModalInnerProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const closeFunction = () => {
    if (disableCloseButton) {
      return;
    }
    dispatch(hideMessageModal())
  }
  useEffect(() => {
    const listenToClicks = (e: MouseEvent) => {
      const target = e.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        closeFunction();
      }
    }
    document.addEventListener('click', listenToClicks);
    return () => {
      document.removeEventListener('click', listenToClicks);
    }
  }, []);
  return ReactDOM.createPortal(
    <React.Fragment>
      <div id="modal-container" className={modalDisplayAnimation}>
        <div className="modal-background">
          <div className="modal" ref={modalRef}>
            <p id="modal-message">{message}</p>
            <span id="modal-close-button" onClick={closeFunction}>&times;</span>
          </div>
        </div>
      </div>
    </React.Fragment>,
    document.body
  )
}

export default MessageModalInner;