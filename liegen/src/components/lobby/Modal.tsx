import ReactDOM from 'react-dom';
import { ModalAnimationStyles } from '../../constants';

export interface ModalProps {
  show: boolean,
  onCloseButtonClick: () => void,
  message?: string,
  animationStyle?: ModalAnimationStyles
}

const Modal = ({ show, onCloseButtonClick, message = '', animationStyle = ModalAnimationStyles.REGULAR }: ModalProps) => {
  if (!show) {
    return null;
  }

  return ReactDOM.createPortal(
    <div id="modal-container" className={animationStyle}>
      <div className="modal-background">
        <div className="modal">
          <p id="modal-message">{message}</p>
          <span id="modal-close-button" onClick={onCloseButtonClick}>&times;</span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;