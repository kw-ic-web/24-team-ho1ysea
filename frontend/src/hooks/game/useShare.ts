import { useState } from "react";

export const useShare = () => {
  const [isShare, setIsShare] = useState<boolean>(false);

  const handleOpenShare = () => {
    setIsShare(true);
  };
  const handleCloseShare = () => {
    setIsShare(false);
  };

  return { isShare, handleOpenShare, handleCloseShare };
};
