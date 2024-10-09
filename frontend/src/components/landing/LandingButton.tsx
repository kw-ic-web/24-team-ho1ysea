import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  onClick: () => void;
}

export default function LandingButton({ children, onClick }: Props) {
  return (
    <div>
      <button
        className={`bg-blue-500 hover:bg-blue-600 min-w-28 px-3 py-2 m-2 border rounded-xl text-slate-200`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
