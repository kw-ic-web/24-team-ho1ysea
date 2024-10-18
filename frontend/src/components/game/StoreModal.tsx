interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function StoreModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return <div>스토어</div>;
}
