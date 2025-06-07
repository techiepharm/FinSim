
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface TradingSectionProps {
  onFeatureClick: (featureName: string, description: string) => void;
}

const TradingSection = ({ onFeatureClick }: TradingSectionProps) => {
  return (
    <Card className="bg-gradient-to-r from-green-900/50 to-emerald-800/50 border-green-600/50">
      <CardContent className="p-6 text-center">
        <h3 className="text-3xl font-bold text-green-300 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          📈 Nigerian Stock Exchange (NSE) Trading Platform
        </h3>
        <p className="text-green-200 mb-6 text-lg">
          Begin your investment journey in the Nigerian Stock Exchange with virtual Nigerian Naira, featuring real-time NSE data and detailed stock charts
        </p>
        <Button 
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
          onClick={() => {
            onFeatureClick("Start NSE Trading", "Begin your Nigerian investment journey with virtual Naira to learn NSE trading without risk");
            window.location.href = '/trading';
          }}
        >
          Click Here to Start NSE Trading
        </Button>
      </CardContent>
    </Card>
  );
};

export default TradingSection;
