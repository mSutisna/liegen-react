import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MessageModalData } from '../../types/models';
import { RootState } from '../../store';
import ReactDOM from "react-dom";
import {
  setVisibilityMessageModal,
} from "../../slices/gameSlice";
import React from "react";

const MessageModal = ({messageModalData, closeExecution, messageModalRef}: {
  messageModalData: MessageModalData, 
  closeExecution: (type: string) => void, 
  messageModalRef: React.RefObject<HTMLDivElement>
}) => {
  // const messageModalData: MessageModalData = useSelector(
  //   (state: RootState) => {
  //     return state.game.messageModal;
  //   }
  // );

  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const closeFunction = () => {
    if (messageModalData.disableCloseButton) {
      return;
    }
    closeExecution('messageModal');
  }
  useEffect(() => {
    const listenToClicks = (e: MouseEvent) => {
      e.stopImmediatePropagation();
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

  const body = <React.Fragment>
    <div ref={messageModalRef} className={`modal-container ${messageModalData.modalAnimation}`}>
      <div className="modal-background">
        <div className="modal" ref={modalRef}>
          <p id="modal-message">{messageModalData.message}</p>
          {!messageModalData.disableCloseButton && <span id="modal-close-button" onClick={closeFunction}>&times;</span>}
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


