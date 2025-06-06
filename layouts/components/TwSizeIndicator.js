const TwSizeIndicator = () => {
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed top-0 left-0 z-50 flex w-[30px] items-center justify-center bg-secondary py-[2.5px] text-[12px] uppercase text-foreground sm:bg-red-200 md:bg-yellow-200 lg:bg-green-200 xl:bg-blue-200 2xl:bg-pink-200">
        <span className="block sm:hidden">all</span>
        <span className="hidden sm:block md:hidden">sm</span>
        <span className="hidden md:block lg:hidden">md</span>
        <span className="hidden lg:block xl:hidden">lg</span>
        <span className="hidden xl:block 2xl:hidden">xl</span>
        <span className="hidden 2xl:block">2xl</span>
      </div>
    );
  } else {
    return null;
  }
};
export default TwSizeIndicator;
