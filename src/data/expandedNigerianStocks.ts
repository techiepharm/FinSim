
export interface NigerianStock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  exchange: string;
  beta: number;
  pe: number;
  dividend: number;
}

export const expandedNigerianStocks: NigerianStock[] = [
  // Banking Sector (Tier 1 Banks)
  {
    symbol: "GTCO",
    name: "Guaranty Trust Holding Company Plc",
    sector: "Banking",
    currentPrice: 28.50,
    change: 2.15,
    changePercent: 8.16,
    volume: 45000000,
    marketCap: "₦847.5B",
    exchange: "NGX",
    beta: 1.2,
    pe: 12.5,
    dividend: 3.2
  },
  {
    symbol: "ZENITHBANK",
    name: "Zenith Bank Plc",
    sector: "Banking",
    currentPrice: 25.80,
    change: 1.87,
    changePercent: 7.81,
    volume: 38000000,
    marketCap: "₦811.4B",
    exchange: "NGX",
    beta: 1.1,
    pe: 11.8,
    dividend: 2.8
  },
  {
    symbol: "UBA",
    name: "United Bank for Africa Plc",
    sector: "Banking",
    currentPrice: 12.40,
    change: -0.65,
    changePercent: -4.98,
    volume: 42000000,
    marketCap: "₦421.9B",
    exchange: "NGX",
    beta: 1.3,
    pe: 10.2,
    dividend: 2.1
  },
  {
    symbol: "ACCESS",
    name: "Access Holdings Plc",
    sector: "Banking",
    currentPrice: 15.20,
    change: 1.25,
    changePercent: 8.96,
    volume: 35000000,
    marketCap: "₦542.1B",
    exchange: "NGX",
    beta: 1.4,
    pe: 9.8,
    dividend: 2.5
  },
  {
    symbol: "FBNH",
    name: "FBN Holdings Plc",
    sector: "Banking",
    currentPrice: 11.85,
    change: -1.12,
    changePercent: -8.64,
    volume: 28000000,
    marketCap: "₦422.6B",
    exchange: "NGX",
    beta: 1.5,
    pe: 8.5,
    dividend: 1.8
  },
  {
    symbol: "STERLNBANK",
    name: "Sterling Bank Plc",
    sector: "Banking",
    currentPrice: 2.85,
    change: 0.15,
    changePercent: 5.56,
    volume: 55000000,
    marketCap: "₦89.2B",
    exchange: "NGX",
    beta: 1.6,
    pe: 7.2,
    dividend: 1.2
  },
  {
    symbol: "WEMABANK",
    name: "Wema Bank Plc",
    sector: "Banking",
    currentPrice: 4.75,
    change: 0.25,
    changePercent: 5.56,
    volume: 32000000,
    marketCap: "₦168.5B",
    exchange: "NGX",
    beta: 1.7,
    pe: 6.8,
    dividend: 1.5
  },

  // Oil & Gas Sector
  {
    symbol: "SEPLAT",
    name: "Seplat Petroleum Development Company Plc",
    sector: "Oil & Gas",
    currentPrice: 450.00,
    change: 15.50,
    changePercent: 3.57,
    volume: 1200000,
    marketCap: "₦264.6B",
    exchange: "NGX",
    beta: 1.8,
    pe: 15.2,
    dividend: 4.5
  },
  {
    symbol: "TOTAL",
    name: "Total Nigeria Plc",
    sector: "Oil & Gas",
    currentPrice: 285.50,
    change: -8.20,
    changePercent: -2.79,
    volume: 800000,
    marketCap: "₦31.4B",
    exchange: "NGX",
    beta: 1.3,
    pe: 18.5,
    dividend: 6.2
  },
  {
    symbol: "ETERNA",
    name: "Eterna Plc",
    sector: "Oil & Gas",
    currentPrice: 8.75,
    change: 0.65,
    changePercent: 8.02,
    volume: 2500000,
    marketCap: "₦12.3B",
    exchange: "NGX",
    beta: 2.1,
    pe: 12.8,
    dividend: 2.8
  },
  {
    symbol: "CONOIL",
    name: "Conoil Plc",
    sector: "Oil & Gas",
    currentPrice: 42.10,
    change: 1.85,
    changePercent: 4.60,
    volume: 950000,
    marketCap: "₦38.7B",
    exchange: "NGX",
    beta: 1.9,
    pe: 14.2,
    dividend: 3.5
  },
  {
    symbol: "OANDO",
    name: "Oando Plc",
    sector: "Oil & Gas",
    currentPrice: 15.85,
    change: -0.95,
    changePercent: -5.66,
    volume: 18000000,
    marketCap: "₦19.8B",
    exchange: "NGX",
    beta: 2.3,
    pe: 8.9,
    dividend: 1.8
  },

  // Telecommunications
  {
    symbol: "MTNN",
    name: "MTN Nigeria Communications Plc",
    sector: "Telecommunications",
    currentPrice: 195.50,
    change: 5.85,
    changePercent: 3.09,
    volume: 8500000,
    marketCap: "₦4.01T",
    exchange: "NGX",
    beta: 0.8,
    pe: 22.5,
    dividend: 5.2
  },
  {
    symbol: "AIRTELAFRI",
    name: "Airtel Africa Plc",
    sector: "Telecommunications",
    currentPrice: 1250.00,
    change: 45.50,
    changePercent: 3.78,
    volume: 450000,
    marketCap: "₦4.68T",
    exchange: "NGX",
    beta: 0.9,
    pe: 19.8,
    dividend: 4.8
  },

  // Consumer Goods
  {
    symbol: "DANGSUGAR",
    name: "Dangote Sugar Refinery Plc",
    sector: "Consumer Goods",
    currentPrice: 18.75,
    change: -0.65,
    changePercent: -3.35,
    volume: 15000000,
    marketCap: "₦225.0B",
    exchange: "NGX",
    beta: 1.1,
    pe: 16.8,
    dividend: 2.5
  },
  {
    symbol: "NESTLE",
    name: "Nestle Nigeria Plc",
    sector: "Consumer Goods",
    currentPrice: 1480.00,
    change: 25.50,
    changePercent: 1.75,
    volume: 180000,
    marketCap: "₦1.35T",
    exchange: "NGX",
    beta: 0.7,
    pe: 25.8,
    dividend: 6.5
  },
  {
    symbol: "UNILEVER",
    name: "Unilever Nigeria Plc",
    sector: "Consumer Goods",
    currentPrice: 15.85,
    change: 0.45,
    changePercent: 2.92,
    volume: 8500000,
    marketCap: "₦115.8B",
    exchange: "NGX",
    beta: 0.9,
    pe: 18.5,
    dividend: 4.2
  },
  {
    symbol: "GUINNESS",
    name: "Guinness Nigeria Plc",
    sector: "Consumer Goods",
    currentPrice: 42.50,
    change: 1.25,
    changePercent: 3.03,
    volume: 5200000,
    marketCap: "₦75.6B",
    exchange: "NGX",
    beta: 1.2,
    pe: 15.2,
    dividend: 3.8
  },
  {
    symbol: "NASCON",
    name: "Nascon Allied Industries Plc",
    sector: "Consumer Goods",
    currentPrice: 28.85,
    change: 1.45,
    changePercent: 5.29,
    volume: 3500000,
    marketCap: "₦148.2B",
    exchange: "NGX",
    beta: 1.0,
    pe: 14.5,
    dividend: 3.2
  },

  // Building Materials
  {
    symbol: "DANGCEM",
    name: "Dangote Cement Plc",
    sector: "Building Materials",
    currentPrice: 285.00,
    change: 8.25,
    changePercent: 2.98,
    volume: 2500000,
    marketCap: "₦4.85T",
    exchange: "NGX",
    beta: 1.3,
    pe: 18.2,
    dividend: 4.5
  },
  {
    symbol: "LAFARGE",
    name: "Lafarge Africa Plc",
    sector: "Building Materials",
    currentPrice: 28.40,
    change: 0.95,
    changePercent: 3.46,
    volume: 12000000,
    marketCap: "₦458.4B",
    exchange: "NGX",
    beta: 1.4,
    pe: 12.8,
    dividend: 2.8
  },
  {
    symbol: "WAPCO",
    name: "Lafarge Africa Plc",
    sector: "Building Materials",
    currentPrice: 28.40,
    change: 0.95,
    changePercent: 3.46,
    volume: 12000000,
    marketCap: "₦458.4B",
    exchange: "NGX",
    beta: 1.4,
    pe: 12.8,
    dividend: 2.8
  },

  // Technology Sector
  {
    symbol: "CWG",
    name: "Computer Warehouse Group Plc",
    sector: "Technology",
    currentPrice: 2.85,
    change: 0.35,
    changePercent: 14.00,
    volume: 18000000,
    marketCap: "₦12.8B",
    exchange: "NGX",
    beta: 2.5,
    pe: 8.5,
    dividend: 1.2
  },
  {
    symbol: "SOVEREIGN",
    name: "Sovereign Trust Insurance Plc",
    sector: "Technology",
    currentPrice: 0.85,
    change: 0.05,
    changePercent: 6.25,
    volume: 25000000,
    marketCap: "₦3.2B",
    exchange: "NGX",
    beta: 2.8,
    pe: 6.2,
    dividend: 0.8
  },
  {
    symbol: "COURTVILLE",
    name: "Courtville Business Solutions Plc",
    sector: "Technology",
    currentPrice: 0.65,
    change: 0.15,
    changePercent: 30.00,
    volume: 32000000,
    marketCap: "₦1.8B",
    exchange: "NGX",
    beta: 3.2,
    pe: 5.8,
    dividend: 0.5
  },

  // Agriculture Sector
  {
    symbol: "OKOMUOIL",
    name: "Okomu Oil Palm Company Plc",
    sector: "Agriculture",
    currentPrice: 125.50,
    change: 4.25,
    changePercent: 3.51,
    volume: 850000,
    marketCap: "₦101.3B",
    exchange: "NGX",
    beta: 1.1,
    pe: 16.5,
    dividend: 4.2
  },
  {
    symbol: "PRESCO",
    name: "Presco Plc",
    sector: "Agriculture",
    currentPrice: 95.75,
    change: 2.85,
    changePercent: 3.07,
    volume: 1200000,
    marketCap: "₦103.4B",
    exchange: "NGX",
    beta: 1.2,
    pe: 14.8,
    dividend: 3.5
  },
  {
    symbol: "LIVESTOCK",
    name: "Livestock Feeds Plc",
    sector: "Agriculture",
    currentPrice: 2.85,
    change: 0.25,
    changePercent: 9.62,
    volume: 18500000,
    marketCap: "₦15.2B",
    exchange: "NGX",
    beta: 1.8,
    pe: 8.5,
    dividend: 1.8
  },
  {
    symbol: "ELLAHLAKES",
    name: "Ellah Lakes Plc",
    sector: "Agriculture",
    currentPrice: 4.25,
    change: -0.15,
    changePercent: -3.41,
    volume: 8500000,
    marketCap: "₦8.9B",
    exchange: "NGX",
    beta: 2.0,
    pe: 7.2,
    dividend: 1.5
  },

  // Industrial Goods
  {
    symbol: "MEYER",
    name: "Meyer Plc",
    sector: "Industrial Goods",
    currentPrice: 3.85,
    change: 0.25,
    changePercent: 6.94,
    volume: 12000000,
    marketCap: "₦7.1B",
    exchange: "NGX",
    beta: 1.6,
    pe: 9.2,
    dividend: 2.1
  },
  {
    symbol: "BERGER",
    name: "Berger Paints Nigeria Plc",
    sector: "Industrial Goods",
    currentPrice: 9.50,
    change: 0.45,
    changePercent: 4.97,
    volume: 6500000,
    marketCap: "₦10.5B",
    exchange: "NGX",
    beta: 1.3,
    pe: 11.5,
    dividend: 2.8
  },
  {
    symbol: "CUTIX",
    name: "Cutix Plc",
    sector: "Industrial Goods",
    currentPrice: 2.65,
    change: 0.18,
    changePercent: 7.29,
    volume: 15000000,
    marketCap: "₦5.3B",
    exchange: "NGX",
    beta: 1.9,
    pe: 8.2,
    dividend: 1.5
  },

  // Insurance
  {
    symbol: "AIICO",
    name: "AIICO Insurance Plc",
    sector: "Insurance",
    currentPrice: 1.15,
    change: 0.08,
    changePercent: 7.48,
    volume: 28000000,
    marketCap: "₦20.7B",
    exchange: "NGX",
    beta: 1.4,
    pe: 12.5,
    dividend: 2.2
  },
  {
    symbol: "MANSARD",
    name: "Mansard Insurance Plc",
    sector: "Insurance",
    currentPrice: 2.45,
    change: 0.15,
    changePercent: 6.52,
    volume: 15000000,
    marketCap: "₦9.8B",
    exchange: "NGX",
    beta: 1.5,
    pe: 10.8,
    dividend: 2.8
  },
  {
    symbol: "NEM",
    name: "NEM Insurance Company Nigeria Plc",
    sector: "Insurance",
    currentPrice: 3.25,
    change: 0.18,
    changePercent: 5.87,
    volume: 12000000,
    marketCap: "₦12.5B",
    exchange: "NGX",
    beta: 1.3,
    pe: 11.2,
    dividend: 2.5
  },

  // Healthcare & Pharmaceuticals
  {
    symbol: "FIDSON",
    name: "Fidson Healthcare Plc",
    sector: "Healthcare",
    currentPrice: 8.85,
    change: 0.65,
    changePercent: 7.93,
    volume: 14000000,
    marketCap: "₦15.9B",
    exchange: "NGX",
    beta: 1.7,
    pe: 13.5,
    dividend: 2.8
  },
  {
    symbol: "PHARMDEKO",
    name: "Pharma-Deko Plc",
    sector: "Healthcare",
    currentPrice: 2.15,
    change: 0.12,
    changePercent: 5.91,
    volume: 22000000,
    marketCap: "₦4.3B",
    exchange: "NGX",
    beta: 1.8,
    pe: 9.5,
    dividend: 1.8
  },
  {
    symbol: "MORISON",
    name: "Morison Industries Plc",
    sector: "Healthcare",
    currentPrice: 1.85,
    change: 0.08,
    changePercent: 4.52,
    volume: 18000000,
    marketCap: "₦3.7B",
    exchange: "NGX",
    beta: 1.6,
    pe: 8.8,
    dividend: 1.5
  },

  // Conglomerates
  {
    symbol: "DANGOTE",
    name: "Dangote Industries Limited",
    sector: "Conglomerates",
    currentPrice: 18.50,
    change: 0.85,
    changePercent: 4.81,
    volume: 25000000,
    marketCap: "₦312.5B",
    exchange: "NGX",
    beta: 1.1,
    pe: 14.2,
    dividend: 3.2
  },
  {
    symbol: "TRANSCORP",
    name: "Transnational Corporation Plc",
    sector: "Conglomerates",
    currentPrice: 1.85,
    change: 0.12,
    changePercent: 6.94,
    volume: 45000000,
    marketCap: "₦75.8B",
    exchange: "NGX",
    beta: 1.4,
    pe: 8.5,
    dividend: 1.8
  },

  // Real Estate
  {
    symbol: "UPDC",
    name: "UPDC Plc",
    sector: "Real Estate",
    currentPrice: 1.25,
    change: 0.05,
    changePercent: 4.17,
    volume: 35000000,
    marketCap: "₦11.2B",
    exchange: "NGX",
    beta: 1.6,
    pe: 12.8,
    dividend: 1.5
  }
];

export const getStocksBySector = (sector: string) => {
  return expandedNigerianStocks.filter(stock => stock.sector === sector);
};

export const getAllSectors = () => {
  return [...new Set(expandedNigerianStocks.map(stock => stock.sector))];
};

export const getTopPerformers = (count: number = 10) => {
  return [...expandedNigerianStocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, count);
};

export const getTopLosers = (count: number = 10) => {
  return [...expandedNigerianStocks]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, count);
};

export const getHighVolumeStocks = (count: number = 10) => {
  return [...expandedNigerianStocks]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, count);
};

export const searchStocks = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return expandedNigerianStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(lowercaseQuery) ||
    stock.name.toLowerCase().includes(lowercaseQuery) ||
    stock.sector.toLowerCase().includes(lowercaseQuery)
  );
};

export const getRandomStocks = (count: number = 10) => {
  const shuffled = [...expandedNigerianStocks].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
