import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, BookOpen, Award } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface VideoEducationProps {
  topic?: string;
  compact?: boolean;
}

const VideoEducation = ({ topic = "general", compact = false }: VideoEducationProps) => {
  const videoContent = {
    general: [
      {
        id: 1,
        title: "Introduction to Nigerian Stock Market",
        description: "Learn the basics of NSE trading and investment fundamentals",
        duration: "12:30",
        level: "Beginner",
        thumbnail: "🏛️",
        topics: ["NSE Overview", "Market Hours", "Stock Types"]
      },
      {
        id: 2,
        title: "Understanding Financial Ratios",
        description: "How to analyze Nigerian companies using key financial metrics",
        duration: "15:45",
        level: "Intermediate",
        thumbnail: "📊",
        topics: ["P/E Ratio", "ROE", "Debt-to-Equity"]
      },
      {
        id: 3,
        title: "Portfolio Diversification in Nigeria",
        description: "Building a balanced portfolio across Nigerian sectors",
        duration: "18:20",
        level: "Intermediate",
        thumbnail: "🎯",
        topics: ["Sector Analysis", "Risk Management", "Asset Allocation"]
      }
    ],
    trading: [
      {
        id: 4,
        title: "Technical Analysis for Nigerian Stocks",
        description: "Chart patterns and indicators for NSE stocks",
        duration: "22:15",
        level: "Advanced",
        thumbnail: "📈",
        topics: ["Chart Patterns", "Support & Resistance", "Volume Analysis"]
      },
      {
        id: 5,
        title: "Risk Management Strategies",
        description: "Protecting your portfolio in volatile markets",
        duration: "16:40",
        level: "Intermediate",
        thumbnail: "🛡️",
        topics: ["Stop Loss", "Position Sizing", "Hedging"]
      }
    ],
    savings: [
      {
        id: 6,
        title: "Emergency Fund Building",
        description: "Creating financial security in Nigerian economy",
        duration: "11:25",
        level: "Beginner",
        thumbnail: "💰",
        topics: ["Goal Setting", "High-Yield Accounts", "Automation"]
      },
      {
        id: 7,
        title: "Investment vs Savings",
        description: "When to save vs when to invest in Nigeria",
        duration: "13:50",
        level: "Beginner",
        thumbnail: "⚖️",
        topics: ["Time Horizon", "Risk Tolerance", "Inflation Impact"]
      }
    ]
  };

  const videos = videoContent[topic] || videoContent.general;
  const displayVideos = compact ? videos.slice(0, 2) : videos;

  const playVideo = (video: any) => {
    toast.success(`🎥 Playing: ${video.title}`, {
      description: "This is a demo video. In the full app, this would open the video player.",
      duration: 4000,
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-600/20 text-green-300';
      case 'Intermediate': return 'bg-yellow-600/20 text-yellow-300';
      case 'Advanced': return 'bg-red-600/20 text-red-300';
      default: return 'bg-blue-600/20 text-blue-300';
    }
  };

  if (compact) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Play className="h-5 w-5 text-red-400" />
            Video Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayVideos.map((video) => (
            <div 
              key={video.id}
              className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
              onClick={() => playVideo(video)}
            >
              <div className="text-2xl">{video.thumbnail}</div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{video.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getLevelColor(video.level)}>
                    {video.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{video.duration}</span>
                  </div>
                </div>
              </div>
              <Play className="h-4 w-4 text-red-400" />
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={() => {
              toast("📚 Learning Center", {
                description: "Opening comprehensive video library...",
              });
            }}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View All Videos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Financial Education Videos</h2>
        <p className="text-slate-400">Interactive video lessons to boost your financial knowledge</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="p-0">
              {/* Video Thumbnail */}
              <div 
                className="bg-slate-700 h-48 flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors relative group"
                onClick={() => playVideo(video)}
              >
                <div className="text-6xl">{video.thumbnail}</div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {video.duration}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-white font-medium">{video.title}</h3>
                  <Badge className={getLevelColor(video.level)}>
                    {video.level}
                  </Badge>
                </div>
                
                <p className="text-slate-300 text-sm">{video.description}</p>
                
                {/* Topics */}
                <div className="flex flex-wrap gap-1">
                  {video.topics.map((topicItem, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="text-xs text-slate-400 border-slate-600"
                    >
                      {topicItem}
                    </Badge>
                  ))}
                </div>

                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => playVideo(video)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Section */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">3</p>
              <p className="text-slate-400 text-sm">Videos Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">45m</p>
              <p className="text-slate-400 text-sm">Watch Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">2</p>
              <p className="text-slate-400 text-sm">Certificates Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoEducation;
