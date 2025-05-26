import React, { useState, useEffect, useRef } from 'react';

const sampleTopSecurities = [
  { symbol: "FTSE 100", value: 8559.33, change: -0.44 },
  { symbol: "S&P 500", value: 5616.10, change: 0.16 },
  { symbol: "Pound/Dollar", value: 1.33, change: -0.46 },
  { symbol: "Euro/Pound", value: 0.85, change: 0.06 },
  { symbol: "Crude Oil", value: 58.15, change: -1.59 },
  { symbol: "Nasdaq", value: 17640.25, change: -0.28 },
  { symbol: "DAX", value: 23115.96, change: -0.57 },
];

const sampleMarketIndices = [
  { symbol: "FTSE 100", value: 8559.33, change: -0.44 },
  { symbol: "S&P 500", value: 5616.10, change: 0.16 },
  { symbol: "Nasdaq", value: 17640.25, change: -0.28 },
  { symbol: "DAX", value: 23115.96, change: -0.57 },
  { symbol: "Dow Jones", value: 41084.11, change: 0.62 },
  { symbol: "Russell 2000", value: 1985.38, change: 0.11 },
  { symbol: "Nikkei 225", value: 36779.66, change: -0.14 },
  { symbol: "Hang Seng", value: 20000.00, change: 0.30 },
];

const sampleRatesAndBonds = [
  { symbol: "US 5 Yr", value: 3.87, change: 0.09 },
  { symbol: "US 10 Yr", value: 4.28, change: 0.25 },
  { symbol: "JPN 10 Yr", value: 1.29, change: -0.37 },
  { symbol: "UK 10 Yr", value: 4.46, change: 0.43 },
  { symbol: "Fra 10 Yr", value: 3.19, change: 0.54 },
  { symbol: "Bund 10 Yr", value: 2.47, change: 0.56 },
  { symbol: "CAD 10 Yr", value: 3.10, change: 0.34 },
];

const sampleCryptoData = [
  { symbol: "BTC", value: 96300, change: 1.25 },
  { symbol: "ETH", value: 1800, change: 0.74 },
  { symbol: "SOL", value: 146.35, change: 1.06 },
];

const dataCategories = {
  "Top Securities": sampleTopSecurities,
  "Market Indices": sampleMarketIndices,
  "Rates & Bonds": sampleRatesAndBonds,
  "Crypto": sampleCryptoData,
};

type MarketDataType = {
  symbol: string;
  value: number;
  change: number;
};

const MarketRibbon: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof dataCategories>("Top Securities");
  const [marketData, setMarketData] = useState<MarketDataType[]>(dataCategories[selectedCategory]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchData = () => {
    // In a real application, this would fetch live data
    console.log(`Fetching latest data for ${selectedCategory}...`);
    setMarketData(dataCategories[selectedCategory]);
  };

  useEffect(() => {
    setMarketData(dataCategories[selectedCategory]);
  }, [selectedCategory]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5; // Adjust for speed

    const animateScroll = () => {
      if (!isPaused && scrollContainer) {
        scrollAmount += scrollSpeed;
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0; // Reset scroll to create seamless loop
          // Duplicate content for seamless scroll
          while (scrollContainer.children.length < marketData.length * 2 && marketData.length > 0) {
             const firstChild = scrollContainer.children[0];
             if (firstChild) {
                scrollContainer.appendChild(firstChild.cloneNode(true));
             } else {
                break; // break if no children to clone
             }
          }
        }
        scrollContainer.style.transform = `translateX(-${scrollAmount}px)`;
      }
      requestAnimationFrame(animateScroll);
    };

    // Initial content duplication for seamless scroll
    if (scrollContainer && marketData.length > 0) {
        // Clear previous items
        while (scrollContainer.firstChild) {
            scrollContainer.removeChild(scrollContainer.firstChild);
        }
        // Add original items
        marketData.forEach(item => {
            const div = document.createElement('div');
            div.className = "market-item inline-block whitespace-nowrap px-4 py-1 text-xs";
            div.innerHTML = `
                <span class="font-semibold">${item.symbol}</span>
                <span class="ml-2">${item.value.toFixed(2)}</span>
                <span class="ml-1 ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}">
                    ${item.change >= 0 ? '▲' : '▼'} ${Math.abs(item.change).toFixed(2)}%
                </span>
            `;
            scrollContainer.appendChild(div);
        });
        // Add duplicated items
        marketData.forEach(item => {
            const div = document.createElement('div');
            div.className = "market-item inline-block whitespace-nowrap px-4 py-1 text-xs";
            div.innerHTML = `
                <span class="font-semibold">${item.symbol}</span>
                <span class="ml-2">${item.value.toFixed(2)}</span>
                <span class="ml-1 ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}">
                    ${item.change >= 0 ? '▲' : '▼'} ${Math.abs(item.change).toFixed(2)}%
                </span>
            `;
            scrollContainer.appendChild(div);
        });
    }


    const animationFrameId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [marketData, isPaused]);


  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value as keyof typeof dataCategories);
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div
      className="bg-gray-900 text-white overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-grow overflow-hidden">
          <div ref={scrollContainerRef} className="scrolling-wrapper flex whitespace-nowrap">
            {/* Content is now dynamically added in useEffect */}
          </div>
        </div>
        <div className="controls ml-4 flex items-center space-x-2 flex-shrink-0">
          <select 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(dataCategories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            onClick={handleRefresh}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Refresh market data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </div>
      <style jsx>{`
        .scrolling-wrapper {
          /* The animation is now handled by JavaScript transform */
        }
        .market-item {
          /* Ensure items are displayed inline */
        }
        .controls {
            /* Ensure controls don't get pushed out on smaller screens if text is long */
            min-width: fit-content;
        }
      `}</style>
    </div>
  );
};

export default MarketRibbon;