
export interface NigerianStock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  change: number;
  volume: number;
  marketCap: string;
  exchange: string;
}

export const nigerianStocks: NigerianStock[] = [
  // Banking Sector
  {
    symbol: "GTCO",
    name: "Guaranty Trust Holding Company Plc",
    sector: "Banking",
    currentPrice: 28.50,
    change: 2.15,
    volume: 45000000,
    marketCap: "₦847.5B",
    exchange: "NSE"
  },
  {
    symbol: "ZENITHBANK",
    name: "Zenith Bank Plc",
    sector: "Banking",
    currentPrice: 25.80,
    change: 1.87,
    volume: 38000000,
    marketCap: "₦811.4B",
    exchange: "NSE"
  },
  {
    symbol: "UBA",
    name: "United Bank for Africa Plc",
    sector: "Banking",
    currentPrice: 12.40,
    change: -0.65,
    volume: 42000000,
    marketCap: "₦421.9B",
    exchange: "NSE"
  },
  {
    symbol: "ACCESS",
    name: "Access Holdings Plc",
    sector: "Banking",
    currentPrice: 15.20,
    change: 1.25,
    volume: 35000000,
    marketCap: "₦542.1B",
    exchange: "NSE"
  },
  {
    symbol: "FBNH",
    name: "FBN Holdings Plc",
    sector: "Banking",
    currentPrice: 11.85,
    change: -1.12,
    volume: 28000000,
    marketCap: "₦422.6B",
    exchange: "NSE"
  },

  // Oil & Gas Sector
  {
    symbol: "SEPLAT",
    name: "Seplat Petroleum Development Company Plc",
    sector: "Oil & Gas",
    currentPrice: 450.00,
    change: 3.25,
    volume: 1200000,
    marketCap: "₦264.6B",
    exchange: "NSE"
  },
  {
    symbol: "TOTAL",
    name: "Total Nigeria Plc",
    sector: "Oil & Gas",
    currentPrice: 285.50,
    change: -2.18,
    volume: 800000,
    marketCap: "₦31.4B",
    exchange: "NSE"
  },
  {
    symbol: "ETERNA",
    name: "Eterna Plc",
    sector: "Oil & Gas",
    currentPrice: 8.75,
    change: 0.85,
    volume: 2500000,
    marketCap: "₦12.3B",
    exchange: "NSE"
  },
  {
    symbol: "CONOIL",
    name: "Conoil Plc",
    sector: "Oil & Gas",
    currentPrice: 42.10,
    change: 1.45,
    volume: 950000,
    marketCap: "₦38.7B",
    exchange: "NSE"
  },

  // Technology Sector
  {
    symbol: "CWG",
    name: "Computer Warehouse Group Plc",
    sector: "Technology",
    currentPrice: 2.85,
    change: 5.45,
    volume: 18000000,
    marketCap: "₦12.8B",
    exchange: "NSE"
  },
  {
    symbol: "SOVEREIGN",
    name: "Sovereign Trust Insurance Plc",
    sector: "Technology",
    currentPrice: 0.85,
    change: 2.15,
    volume: 25000000,
    marketCap: "₦3.2B",
    exchange: "NSE"
  },
  {
    symbol: "COURTVILLE",
    name: "Courtville Business Solutions Plc",
    sector: "Technology",
    currentPrice: 0.65,
    change: 8.35,
    volume: 32000000,
    marketCap: "₦1.8B",
    exchange: "NSE"
  },

  // Telecommunications
  {
    symbol: "MTNN",
    name: "MTN Nigeria Communications Plc",
    sector: "Telecommunications",
    currentPrice: 195.50,
    change: 1.85,
    volume: 8500000,
    marketCap: "₦4.01T",
    exchange: "NSE"
  },
  {
    symbol: "AIRTELAFRI",
    name: "Airtel Africa Plc",
    sector: "Telecommunications",
    currentPrice: 1250.00,
    change: 2.45,
    volume: 450000,
    marketCap: "₦4.68T",
    exchange: "NSE"
  },

  // Consumer Goods
  {
    symbol: "DANGSUGAR",
    name: "Dangote Sugar Refinery Plc",
    sector: "Consumer Goods",
    currentPrice: 18.75,
    change: -0.85,
    volume: 15000000,
    marketCap: "₦225.0B",
    exchange: "NSE"
  },
  {
    symbol: "NESTLE",
    name: "Nestle Nigeria Plc",
    sector: "Consumer Goods",
    currentPrice: 1480.00,
    change: 1.25,
    volume: 180000,
    marketCap: "₦1.35T",
    exchange: "NSE"
  },
  {
    symbol: "UNILEVER",
    name: "Unilever Nigeria Plc",
    sector: "Consumer Goods",
    currentPrice: 15.85,
    change: 0.65,
    volume: 8500000,
    marketCap: "₦115.8B",
    exchange: "NSE"
  },
  {
    symbol: "GUINNESS",
    name: "Guinness Nigeria Plc",
    sector: "Consumer Goods",
    currentPrice: 42.50,
    change: 2.15,
    volume: 5200000,
    marketCap: "₦75.6B",
    exchange: "NSE"
  },

  // Building Materials
  {
    symbol: "DANGCEM",
    name: "Dangote Cement Plc",
    sector: "Building Materials",
    currentPrice: 285.00,
    change: 1.75,
    volume: 2500000,
    marketCap: "₦4.85T",
    exchange: "NSE"
  },
  {
    symbol: "LAFARGE",
    name: "Lafarge Africa Plc",
    sector: "Building Materials",
    currentPrice: 28.40,
    change: 0.95,
    volume: 12000000,
    marketCap: "₦458.4B",
    exchange: "NSE"
  },

  // Agriculture Sector
  {
    symbol: "OKOMUOIL",
    name: "Okomu Oil Palm Company Plc",
    sector: "Agriculture",
    currentPrice: 125.50,
    change: 2.85,
    volume: 850000,
    marketCap: "₦101.3B",
    exchange: "NSE"
  },
  {
    symbol: "PRESCO",
    name: "Presco Plc",
    sector: "Agriculture",
    currentPrice: 95.75,
    change: 1.45,
    volume: 1200000,
    marketCap: "₦103.4B",
    exchange: "NSE"
  },
  {
    symbol: "LIVESTOCK",
    name: "Livestock Feeds Plc",
    sector: "Agriculture",
    currentPrice: 2.85,
    change: 3.65,
    volume: 18500000,
    marketCap: "₦15.2B",
    exchange: "NSE"
  },
  {
    symbol: "ELLAHLAKES",
    name: "Ellah Lakes Plc",
    sector: "Agriculture",
    currentPrice: 4.25,
    change: -1.25,
    volume: 8500000,
    marketCap: "₦8.9B",
    exchange: "NSE"
  },

  // Industrial Goods
  {
    symbol: "MEYER",
    name: "Meyer Plc",
    sector: "Industrial Goods",
    currentPrice: 3.85,
    change: 1.85,
    volume: 12000000,
    marketCap: "₦7.1B",
    exchange: "NSE"
  },
  {
    symbol: "BERGER",
    name: "Berger Paints Nigeria Plc",
    sector: "Industrial Goods",
    currentPrice: 9.50,
    change: 0.75,
    volume: 6500000,
    marketCap: "₦10.5B",
    exchange: "NSE"
  },

  // Insurance
  {
    symbol: "AIICO",
    name: "AIICO Insurance Plc",
    sector: "Insurance",
    currentPrice: 1.15,
    change: 2.25,
    volume: 28000000,
    marketCap: "₦20.7B",
    exchange: "NSE"
  },
  {
    symbol: "MANSARD",
    name: "Mansard Insurance Plc",
    sector: "Insurance",
    currentPrice: 2.45,
    change: 1.25,
    volume: 15000000,
    marketCap: "₦9.8B",
    exchange: "NSE"
  },

  // Healthcare & Pharmaceuticals
  {
    symbol: "FIDSON",
    name: "Fidson Healthcare Plc",
    sector: "Healthcare",
    currentPrice: 8.85,
    change: 3.25,
    volume: 14000000,
    marketCap: "₦15.9B",
    exchange: "NSE"
  },
  {
    symbol: "PHARMDEKO",
    name: "Pharma-Deko Plc",
    sector: "Healthcare",
    currentPrice: 2.15,
    change: 1.85,
    volume: 22000000,
    marketCap: "₦4.3B",
    exchange: "NSE"
  }
];

export const getStocksBySector = (sector: string) => {
  return nigerianStocks.filter(stock => stock.sector === sector);
};

export const getAllSectors = () => {
  return [...new Set(nigerianStocks.map(stock => stock.sector))];
};

export const getRandomStocks = (count: number = 10) => {
  const shuffled = [...nigerianStocks].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const searchStocks = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return nigerianStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(lowercaseQuery) ||
    stock.name.toLowerCase().includes(lowercaseQuery) ||
    stock.sector.toLowerCase().includes(lowercaseQuery)
  );
};
