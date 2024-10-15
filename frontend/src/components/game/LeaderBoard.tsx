export default function LeaderBoard(): JSX.Element {
  // 추후 API로 받아오는 데이터로 교체
  const mockData = [
    { nickName: "닉네임1", score: 84 },
    { nickName: "닉네임2", score: 72 },
    { nickName: "닉네임3", score: 65 },
    { nickName: "닉네임4", score: 22 },
    { nickName: "닉네임5", score: 10 },
    { nickName: "내 닉네임", score: 3 },
  ];

  const getBgStyle = (idx: number) => {
    if (idx === 0) {
      return "bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500";
    } else if (idx === 1) {
      return "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400";
    } else if (idx === 2) {
      return "bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400";
    } else if (idx === mockData.length - 1) {
      return "bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500";
    } else {
      return "bg-black bg-opacity-50";
    }
  };

  return (
    <div className="absolute rounded-lg bg-black bg-opacity-40 text-slate-100 text-center p-1.5 m-1 right-0 top-0 w-36 text-[6px] sm:text-[10px] sm:top-2 sm:right-2 sm:w-48 sm:p-3 sm:m-2 md:text-[20px] md:w-60 md:top-4 md:right-4 lg:top-6  lg:right-8 xl:top-6 xl:right-12">
      <div className="mb-2 font-bold">🏆 리더보드 🏆</div>
      <ul className="space-y-1 sm:space-y-2">
        {mockData.map((data, idx) => (
          <li
            key={idx}
            className={`flex justify-between p-1 sm:p-2 
              ${getBgStyle(idx)} rounded-lg`}
          >
            <span>{data.nickName}</span> <span>{data.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
