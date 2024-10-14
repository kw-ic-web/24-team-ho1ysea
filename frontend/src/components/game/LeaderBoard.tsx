export default function LeaderBoard(): JSX.Element {
  return (
    <div className="absolute rounded-lg bg-black bg-opacity-40 text-slate-100 text-center p-1.5 m-1 right-0 top-0 w-36 text-[6px] sm:text-[10px] sm:top-2 sm:right-2 sm:w-48 sm:p-3 sm:m-2 md:text-[20px] md:w-60 md:top-4 md:right-4 lg:top-6  lg:right-8 xl:top-6 xl:right-12">
      <div className="mb-2 font-bold">🏆 리더보드 🏆</div>
      <ul className="space-y-1 sm:space-y-2">
        <li className="flex justify-between p-1 sm:p-2 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 rounded-lg">
          <span>닉네임1</span> <span>84</span>
        </li>
        <li className="flex justify-between p-1 sm:p-2 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-lg">
          <span>닉네임2</span> <span>72</span>
        </li>
        <li className="flex justify-between p-1 sm:p-2 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 rounded-lg">
          <span>닉네임3</span> <span>65</span>
        </li>
        <li className="flex justify-between p-1 sm:p-2 bg-black bg-opacity-50 rounded-lg">
          <span>닉네임4</span> <span>22</span>
        </li>
        <li className="flex justify-between p-1 sm:p-2 bg-black bg-opacity-50 rounded-lg">
          <span>닉네임5</span> <span>10</span>
        </li>
        <li className="flex justify-between p-1 sm:p-2 bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 text-white rounded-lg">
          <span>내 닉네임</span> <span>3</span>
        </li>
      </ul>
    </div>
  );
}
