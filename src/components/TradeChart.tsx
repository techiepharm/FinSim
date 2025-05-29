
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";

interface TradeData {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: string;
  currentPrice?: number;
}

interface TradeChartProps {
  trade: TradeData;
  priceHistory: Array<{ time: string; price: number; }>;
}

const TradeChart = ({ trade, priceHistory }: TradeChartProps) => {
  const currentPrice = trade.currentPrice || trade.price;
  const profitLoss = trade.type === 'buy' 
    ? (currentPrice - trade.price) * trade.shares
    : (trade.price - currentPrice) * trade.shares;
  const profitLossPercent = trade.type === 'buy'
    ? ((currentPrice - trade.price) / trade.price) * 100
    : ((trade.price - currentPrice) / trade.price) * 100;

  const lotSize = Math.floor(trade.shares / 100); // Standard lot is 100 shares
  const remainingShares = trade.shares % 100;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-white">{trade.symbol} Trade Details</span>
          <span className={`text-sm px-2 py-1 rounded ${
            trade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {trade.type.toUpperCase()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trade Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400">Shares</p>
              <p className="text-lg font-medium text-white">{trade.shares}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Entry Price</p>
              <p className="text-lg font-medium text-white">${trade.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Investment</p>
              <p className="text-lg font-medium text-white">${trade.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400">Current Price</p>
              <p className="text-lg font-medium text-white">${currentPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">P&L</p>
              <div className="flex items-center gap-1">
                {profitLoss >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <p className={`text-lg font-medium ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${Math.abs(profitLoss).toFixed(2)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400">P&L %</p>
              <p className={`text-lg font-medium ${profitLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Lot Information */}
        <div className="bg-slate-700 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Position Details
          </h4>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-slate-400">Standard Lots</p>
              <p className="text-white font-medium">{lotSize}</p>
            </div>
            <div>
              <p className="text-slate-400">Odd Lot</p>
              <p className="text-white font-medium">{remainingShares}</p>
            </div>
            <div>
              <p className="text-slate-400">Trade Time</p>
              <p className="text-white font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(trade.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="h-48">
          <h4 className="text-sm font-medium text-white mb-2">Price Movement</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={10}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={10}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F9FAFB'
                }}
                formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={profitLoss >= 0 ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={{ fill: profitLoss >= 0 ? '#10B981' : '#EF4444', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: profitLoss >= 0 ? '#10B981' : '#EF4444', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Trade Timestamp */}
        <div className="text-xs text-slate-400 pt-2 border-t border-slate-600">
          Trade executed on {new Date(trade.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeChart;
