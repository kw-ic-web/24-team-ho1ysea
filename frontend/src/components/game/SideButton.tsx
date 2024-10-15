import { AiFillSetting } from "react-icons/ai";
import { AiFillQuestionCircle } from "react-icons/ai";
import { AiOutlineShareAlt } from "react-icons/ai";

interface Props {
  handleOpenTutorial: () => void;
}

export default function SideButton({ handleOpenTutorial }: Props): JSX.Element {
  return (
    <div className="absolute flex justify-center items-center p-1 m-1 rounded-lg text-slate-200 bg-black bg-opacity-40 left-0 top-0 sm:top-2 sm:left-2 sm:m-2 md:top-4 md:left-4 lg:top-6 lg:left-8 xl:top-6 xl:left-12">
      <button>
        <AiFillSetting className="w-3 h-3 m-0.5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:text-stone-600" />
      </button>
      <button onClick={handleOpenTutorial}>
        <AiFillQuestionCircle className="w-3 h-3 m-0.5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:text-stone-600" />
      </button>
      <button>
        <AiOutlineShareAlt className="w-3 h-3 m-0.5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:text-stone-600" />
      </button>
    </div>
  );
}
