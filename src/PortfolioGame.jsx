import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Interactive objects in the game world
const INTERACTIVE_OBJECTS = [
  {
    id: 'desk',
    x: 150,
    y: 200,
    width: 80,
    height: 60,
    emoji: '💻',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    period: '2023 - Present',
    description: 'Built responsive web applications using React and TypeScript. Improved performance by 40%.',
    skills: ['React', 'TypeScript', 'Tailwind CSS']
  },
  {
    id: 'bookshelf',
    x: 450,
    y: 150,
    width: 70,
    height: 80,
    emoji: '📚',
    title: 'Junior Developer',
    company: 'StartUp Inc',
    period: '2022 - 2023',
    description: 'Developed features for internal CMS with Excel import/export functionality.',
    skills: ['JavaScript', 'Node.js', 'Excel Integration']
  },
  {
    id: 'plant',
    x: 300,
    y: 100,
    width: 50,
    height: 50,
    emoji: '🌱',
    title: 'Intern',
    company: 'Design Studio',
    period: '2021 - 2022',
    description: 'Assisted in building marketing websites and learned modern web development practices.',
    skills: ['HTML', 'CSS', 'JavaScript']
  }
];

function PortfolioGame() {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 300 });
  const [selectedObject, setSelectedObject] = useState(null);
  const [nearbyObject, setNearbyObject] = useState(null);
  const keysPressed = useRef({});
  const gameLoopRef = useRef(null);

  const PLAYER_SIZE = 40;
  const PLAYER_SPEED = 3;
  const INTERACTION_DISTANCE = 60;

  // Check if player is near any interactive object
  useEffect(() => {
    const nearby = INTERACTIVE_OBJECTS.find(obj => {
      const distance = Math.sqrt(
        Math.pow(playerPos.x - (obj.x + obj.width / 2), 2) +
        Math.pow(playerPos.y - (obj.y + obj.height / 2), 2)
      );
      return distance < INTERACTION_DISTANCE;
    });
    setNearbyObject(nearby);
  }, [playerPos]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      
      // Press E to interact
      if (e.key.toLowerCase() === 'e' && nearbyObject && !selectedObject) {
        setSelectedObject(nearbyObject);
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyObject, selectedObject]);

  // Game loop for smooth movement
  useEffect(() => {
    const gameLoop = () => {
      const keys = keysPressed.current;
      let newX = playerPos.x;
      let newY = playerPos.y;

      if (keys['w'] || keys['arrowup']) newY -= PLAYER_SPEED;
      if (keys['s'] || keys['arrowdown']) newY += PLAYER_SPEED;
      if (keys['a'] || keys['arrowleft']) newX -= PLAYER_SPEED;
      if (keys['d'] || keys['arrowright']) newX += PLAYER_SPEED;

      // Keep player in bounds
      newX = Math.max(0, Math.min(600 - PLAYER_SIZE, newX));
      newY = Math.max(0, Math.min(400 - PLAYER_SIZE, newY));

      if (newX !== playerPos.x || newY !== playerPos.y) {
        setPlayerPos({ x: newX, y: newY });
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [playerPos]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Instructions */}
        <div className="bg-slate-800 rounded-lg p-4 mb-4 text-white">
          <h1 className="text-2xl font-bold mb-2">My Interactive Portfolio</h1>
          <p className="text-slate-300 text-sm">
            Use <kbd className="px-2 py-1 bg-slate-700 rounded">WASD</kbd> or <kbd className="px-2 py-1 bg-slate-700 rounded">Arrow Keys</kbd> to move. 
            Press <kbd className="px-2 py-1 bg-slate-700 rounded">E</kbd> to interact with objects.
          </p>
        </div>

        {/* Game Canvas */}
        <div className="relative bg-gradient-to-b from-amber-100 to-green-200 rounded-lg overflow-hidden shadow-2xl" style={{ width: '600px', height: '400px' }}>
          {/* Floor pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(0,0,0,0.05) 49px, rgba(0,0,0,0.05) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(0,0,0,0.05) 49px, rgba(0,0,0,0.05) 50px)'
          }}></div>

          {/* Interactive Objects */}
          {INTERACTIVE_OBJECTS.map(obj => (
            <div
              key={obj.id}
              className="absolute flex items-center justify-center transition-transform hover:scale-110"
              style={{
                left: `${obj.x}px`,
                top: `${obj.y}px`,
                width: `${obj.width}px`,
                height: `${obj.height}px`,
                fontSize: '48px'
              }}
            >
              {obj.emoji}
            </div>
          ))}

          {/* Player Character */}
          <div
            className="absolute transition-all duration-75 text-4xl"
            style={{
              left: `${playerPos.x}px`,
              top: `${playerPos.y}px`,
              width: `${PLAYER_SIZE}px`,
              height: `${PLAYER_SIZE}px`
            }}
          >
            🚶
          </div>

          {/* Interaction Prompt */}
          {nearbyObject && !selectedObject && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
              Press E to inspect
            </div>
          )}
        </div>

        {/* Info Modal */}
        {selectedObject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedObject(null)}>
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedObject.title}</h2>
                  <p className="text-slate-600">{selectedObject.company}</p>
                  <p className="text-sm text-slate-500">{selectedObject.period}</p>
                </div>
                <button
                  onClick={() => setSelectedObject(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-slate-700 mb-4">{selectedObject.description}</p>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Skills & Technologies:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedObject.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedObject(null)}
                className="mt-6 w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioGame;