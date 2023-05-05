import { useRef, useEffect } from "react";
import { MessageModalData } from '../../types/models';
import ReactDOM from "react-dom";
import React from "react";

const MessageModal = ({messageModalData, closeExecution, messageModalRef}: {
  messageModalData: MessageModalData, 
  closeExecution: (type: string) => void, 
  messageModalRef: React.RefObject<HTMLDivElement>
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeFunction = (messageModalData: MessageModalData) => {
    console.log({
      disableCloseButton: messageModalData.disableCloseButton
    })
    if (messageModalData.disableCloseButton) {
      console.log('huge wtf!!!')
      return;
    }
    closeExecution('messageModal');
  }
  useEffect(() => {
    const listenToClicks = (e: MouseEvent) => {
      e.stopImmediatePropagation();
      const target = e.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        console.log('this is weird')
        closeFunction(messageModalData);
      }
    }
    document.addEventListener('click', listenToClicks);
    return () => {
      document.removeEventListener('click', listenToClicks);
    }
  }, [messageModalData]);

  const body = <React.Fragment>
    <div ref={messageModalRef} className={`modal-container ${messageModalData.modalAnimation}`}>
      <div className="modal-background">
        <div className="modal" ref={modalRef}>
          <p id="modal-message">
            {messageModalData.message}
          </p>
          {!messageModalData.disableCloseButton && <span id="modal-close-button" onClick={() => closeFunction(messageModalData)}>&times;</span>}
        </div>
      </div>
    </div>
  </React.Fragment>;

  const noPortal = false;

  const content = !noPortal
    ? ReactDOM.createPortal(
      body,
      document.body
    ) : body;

  return messageModalData.visible ? content : null;
}

export default MessageModal;