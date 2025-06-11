const PostSkeleton = () => (
  <div className="bg-white border-4 border-black p-4 rounded-xl mb-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-pulse space-y-2">
    <div className="h-4 bg-gray-300 rounded w-1/4" />
    <div className="h-4 bg-gray-300 rounded w-full" />
    <div className="h-4 bg-gray-200 rounded w-5/6" />
    <div className="h-3 bg-gray-200 rounded w-1/3" />
    <div className="flex gap-4 mt-2">
      <div className="h-4 w-20 bg-blue-200 rounded-full" />
      <div className="h-4 w-24 bg-blue-200 rounded-full" />
    </div>
    <div className="h-8 w-32 bg-yellow-300 rounded-md border-[3px] border-black shadow-[2px_2px_0px_black]" />
  </div>
);

export default PostSkeleton;
