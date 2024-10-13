import {
  AiFillCaretLeft,
  AiFillCloseSquare,
  AiFillCaretRight,
} from "react-icons/ai";
import { tutorialDataList } from "@constants/tutorial";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorialModal({
  isOpen,
  onClose,
}: Props): JSX.Element | null {
  const [pageIdx, setPageIdx] = useState<number>(0);

  const handlePrevBtn = () => {
    if (pageIdx > 0) {
      setPageIdx((prev) => (prev -= 1));
    }
  };

  const handleNextBtn = () => {
    if (tutorialDataList.length - 1 > pageIdx) {
      setPageIdx((prev) => (prev += 1));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-800">
      <div className="bg-slate-200 p-2 m-2 mx-8 sm:max-w-2xl sm:w-full sm:h-fit sm:p-8 sm:m-4 flex flex-col justify-center items-center shadow-lg rounded-lg">
        <div className="relative w-full text-center font-bold text-xs sm:text-2xl py-3 mx-auto">
          <AiFillCloseSquare
            className="absolute top-1.5 p-1 w-7 h-7 sm:w-11 sm:h-11 cursor-pointer hover:text-red-500"
            onClick={onClose}
          />
          {tutorialDataList[pageIdx].title}
        </div>

        <p className="text-[8px] sm:text-base self-start">
          {tutorialDataList[pageIdx].description}
        </p>
        <div className="w-full flex justify-between items-center mt-1">
          <button
            className="mx-1 my-0 p-1 disabled:opacity-0"
            onClick={handlePrevBtn}
            disabled={pageIdx <= 0}
          >
            <AiFillCaretLeft className="w-4 h-4 sm:w-8 sm:h-8 hover:text-red-500" />
          </button>
          <button
            className="mx-1 my-0 p-1 disabled:opacity-0"
            onClick={handleNextBtn}
            disabled={pageIdx >= tutorialDataList.length - 1}
          >
            <AiFillCaretRight className="w-4 h-4 sm:w-8 sm:h-8 hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
