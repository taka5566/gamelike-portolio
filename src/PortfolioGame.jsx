import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// Interactive objects in the game world
const INTERACTIVE_OBJECTS = [
  {
    id: 'desk',
    top: 5,
    left: 5,
    width: 3,
    height: 2,
    emoji: '💻',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    period: '2023 - Present',
    description: 'Built responsive web applications using React and TypeScript. Improved performance by 40%.',
    skills: ['React', 'TypeScript', 'Tailwind CSS']
  },
  // {
  //   id: 'bookshelf',
  //   x: 450,
  //   y: 150,
  //   width: 70,
  //   height: 80,
  //   emoji: '📚',
  //   title: 'Junior Developer',
  //   company: 'StartUp Inc',
  //   period: '2022 - 2023',
  //   description: 'Developed features for internal CMS with Excel import/export functionality.',
  //   skills: ['JavaScript', 'Node.js', 'Excel Integration']
  // },
  // {
  //   id: 'plant',
  //   x: 300,
  //   y: 100,
  //   width: 50,
  //   height: 50,
  //   emoji: '🌱',
  //   title: 'Intern',
  //   company: 'Design Studio',
  //   period: '2021 - 2022',
  //   description: 'Assisted in building marketing websites and learned modern web development practices.',
  //   skills: ['HTML', 'CSS', 'JavaScript']
  // }
];

function PortfolioGame() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [nearbyObject, setNearbyObject] = useState(null);
  
  const BLOCK_SIZE = 50;
  const [playerPos, setPlayerPos] = useState([8, 1]);

  const FIELD_WIDTH = 10;
  const FIELD_HEIGHT = 10;
  const FIELD_POSITION = [100, 500];

  // Use functional update to avoid stale closure
  function handleKeyDown(e) {
    
    setPlayerPos(prev => {
      let newPos = [...prev];
      
      if (e.key.toLowerCase() === 'w') {
        newPos[1] = Math.max(0, prev[1] - 1); // Move up
      } else if (e.key.toLowerCase() === 's') {
        newPos[1] = Math.min(FIELD_HEIGHT - 1, prev[1] + 1); // Move down
      } else if (e.key.toLowerCase() === 'a') {
        newPos[0] = Math.max(0, prev[0] - 1); // Move left
      } else if (e.key.toLowerCase() === 'd') {
        newPos[0] = Math.min(FIELD_WIDTH - 1, prev[0] + 1); // Move right
      }
      
      return newPos;
    });
  }

  function renderObjects(obj) {
    return (
      <div>
        {INTERACTIVE_OBJECTS.id}
      </div>
    )
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    renderObjects(INTERACTIVE_OBJECTS[0])
    
    // Cleanup function to remove listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array is fine now

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0">
        {Array.from({ length: FIELD_HEIGHT }).map((_, row) =>
          Array.from({ length: FIELD_WIDTH }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              className="absolute border border-gray-800"
              style={{
                left: FIELD_POSITION[1] + col * BLOCK_SIZE,
                top: FIELD_POSITION[0] + row * BLOCK_SIZE,
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            />
          ))
        )}
      </div>

      {/* Player */}
      <div 
        className="absolute bg-blue-500 flex items-center justify-center text-white font-bold transition-transform"
        style={{
          left: FIELD_POSITION[1] + playerPos[0] * BLOCK_SIZE,
          top: FIELD_POSITION[0] + playerPos[1] * BLOCK_SIZE,
          width:  BLOCK_SIZE,
          height: BLOCK_SIZE
        }}
      >
        N
      </div>

      {INTERACTIVE_OBJECTS.map(obj => (
        <div
          key={obj.id}
          className="absolute flex items-center justify-center text-4xl cursor-pointer bg-red-500"
          style={{
            left: FIELD_POSITION[1] + obj.left ,
            top: FIELD_POSITION[0] + obj.top ,
          width: obj.width * BLOCK_SIZE,
          height: obj.height * BLOCK_SIZE
          }}
        >
          {obj.id}
        </div>
      ))}

    </div>
  );
}

export default PortfolioGame;