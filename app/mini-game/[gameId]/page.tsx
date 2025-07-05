"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMiniGameById } from "../../data/mini-games";
import { MiniGame } from "../../types/game";
import Navbar from "../../components/layout/Navbar";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic imports for game components
const PlanetMatchGame = dynamic(() => import("./components/PlanetMatchGame"), {
  loading: () => <GameLoadingComponent />,
});
const SolarQuizGame = dynamic(() => import("./components/SolarQuizGame"), {
  loading: () => <GameLoadingComponent />,
});
const SpaceMemoryGame = dynamic(() => import("./components/SpaceMemoryGame"), {
  loading: () => <GameLoadingComponent />,
});
const PlanetOrderGame = dynamic(() => import("./components/PlanetOrderGame"), {
  loading: () => <GameLoadingComponent />,
});
const ConstellationConnectGame = dynamic(() => import("./components/ConstellationConnectGame"), {
  loading: () => <GameLoadingComponent />,
});
const AsteroidDodgeGame = dynamic(() => import("./components/AsteroidDodgeGame"), {
  loading: () => <GameLoadingComponent />,
});
const GalaxyExplorerGame = dynamic(() => import("./components/GalaxyExplorerGame"), {
  loading: () => <GameLoadingComponent />,
});
const BlackHoleEscapeGame = dynamic(() => import("./components/BlackHoleEscapeGame"), {
  loading: () => <GameLoadingComponent />,
});

// Loading component for games
function GameLoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Gamepad2 className="text-yellow-400 animate-spin mx-auto mb-4" size={48} />
        <p className="text-white text-lg">กำลังโหลดเกม...</p>
      </div>
    </div>
  );
}

// Coming soon component for unimplemented games
function ComingSoonComponent({ game }: { game: MiniGame }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 max-w-md">
        <div className="text-6xl mb-6">{game.thumbnail}</div>
        <h2 className="text-2xl font-bold text-white mb-4">เกมกำลังพัฒนา</h2>
        <p className="text-gray-300 mb-6">
          {game.title} กำลังอยู่ในระหว่างการพัฒนา
        </p>
        <p className="text-gray-400 text-sm mb-8">
          {game.description}
        </p>
        <Link href="/mini-game">
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold px-6 py-3 rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all">
            กลับไปเลือกเกมอื่น
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function MiniGameDynamic() {
  const params = useParams();
  const [game, setGame] = useState<MiniGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.gameId) {
      const foundGame = getMiniGameById(params.gameId as string);
      if (foundGame) {
        setGame(foundGame);
      }
      setIsLoading(false);
    }
  }, [params.gameId]);

  // Function to render the appropriate game component
  const renderGameComponent = () => {
    if (!game) return null;

    switch (game.id) {
      case 'planet-match':
        return <PlanetMatchGame game={game} />;
      case 'solar-quiz':
        return <SolarQuizGame game={game} />;
      case 'space-memory':
        return <SpaceMemoryGame game={game} />;
      case 'planet-order':
        return <PlanetOrderGame game={game} />;
      case 'constellation-connect':
        return <ConstellationConnectGame game={game} />;
      case 'asteroid-dodge':
        return <AsteroidDodgeGame game={game} />;
      case 'galaxy-explorer':
        return <GalaxyExplorerGame game={game} />;
      case 'black-hole-escape':
        return <BlackHoleEscapeGame game={game} />;
      default:
        return <ComingSoonComponent game={game} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <GameLoadingComponent />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">ไม่พบเกม</h2>
          <p className="text-gray-300 mb-6">เกมที่คุณกำลังมองหาไม่มีอยู่</p>
          <Link href="/mini-game">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold px-6 py-3 rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all">
              กลับไปหน้ามินิเกม
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/mini-game" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            กลับไปหน้ามินิเกม
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{game.title}</h1>
              <p className="text-gray-400">{game.description}</p>
            </div>
            <div className="text-4xl">{game.thumbnail}</div>
          </div>
        </div>

        {/* Game Component */}
        <div className="max-w-6xl mx-auto">
          {renderGameComponent()}
        </div>
      </div>

      {/* Background Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  );
}
