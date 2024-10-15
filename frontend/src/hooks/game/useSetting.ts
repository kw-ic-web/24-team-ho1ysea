import { useState } from "react";

export const useSetting = () => {
  const [isSetting, setIsSetting] = useState<boolean>(false);

  const handleOpenSetting = () => {
    setIsSetting(true);
  };
  const handleCloseSetting = () => {
    setIsSetting(false);
  };

  return { isSetting, handleOpenSetting, handleCloseSetting };
};
