import { useSelector } from "react-redux";
import { MessageModalData } from '../types/models';
import { RootState } from '../store';
import MessageModalInner from './MessageModalInner';

const MessageModal = () => {
  const messageModalData: MessageModalData = useSelector(
    (state: RootState) => {
      return state.game.messageModal;
    }
  );
  // return <MessageModalInner
  //   message={messageModalData.message}
  //   modalDisplayAnimation={messageModalData.modalAnimation}
  //   disableCloseButton={messageModalData.disableCloseButton} 
  // />
  return messageModalData.visible ? <MessageModalInner
    message={messageModalData.message}
    modalDisplayAnimation={messageModalData.modalAnimation}
    disableCloseButton={messageModalData.disableCloseButton} 
  /> : null;
}

export default MessageModal;