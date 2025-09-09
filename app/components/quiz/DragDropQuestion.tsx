"use client";
import { useState, useRef, useEffect } from "react";
import { Volume2, CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface DragItem {
  id: string;
  text: string;
  emoji?: string;
  correctPosition: number;
}

interface DropZone {
  id: number;
  label: string;
}

interface EnhancedDragDropQuestionProps {
  dragItems: DragItem[];
  dropZones: DropZone[];
  onAnswer: (isCorrect: boolean, userAnswer: Record<string, number>) => void;
  showResult: boolean;
  userAnswer?: Record<string, number>;
  question?: string;
}

export default function EnhancedDragDropQuestion({
  dragItems,
  dropZones,
  onAnswer,
  showResult,
  userAnswer,
  question = "ลากคำตอบไปยังตำแหน่งที่ถูกต้อง"
}: EnhancedDragDropQuestionProps) {
  const [items, setItems] = useState<DragItem[]>([]);
  const [droppedItems, setDroppedItems] = useState<Record<number, DragItem>>({});
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<'items' | number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<number | null>(null);
  const dragCounter = useRef(0);

  // Initialize items and restore user answer
  useEffect(() => {
    // Reset all states first to ensure clean start
    setDroppedItems({});
    setIsComplete(false);
    setDraggedItem(null);
    setDraggedFrom(null);
    setHoveredZone(null);
    dragCounter.current = 0;
    
    const shuffledItems = [...dragItems].sort(() => Math.random() - 0.5);
    setItems(shuffledItems);
    
    if (userAnswer) {
      const restored: Record<number, DragItem> = {};
      Object.entries(userAnswer).forEach(([itemId, zoneId]) => {
        const item = dragItems.find(item => item.id === itemId);
        if (item) {
          restored[zoneId] = item;
        }
      });
      setDroppedItems(restored);
      setItems(prev => prev.filter(item => !Object.values(restored).some(dropped => dropped.id === item.id)));
    }
  }, [dragItems, userAnswer]);

  // Additional effect to reset states when question changes (when dragItems prop changes)
  useEffect(() => {
    // This effect specifically handles question transitions
    setDroppedItems({});
    setIsComplete(false);
    setDraggedItem(null);
    setDraggedFrom(null);
    setHoveredZone(null);
    dragCounter.current = 0;
  }, [dragItems]);

  const handleDragStart = (e: React.DragEvent, item: DragItem, from: 'items' | number) => {
    if (showResult) return;
    
    setDraggedItem(item);
    setDraggedFrom(from);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, zoneId: number) => {
    e.preventDefault();
    setHoveredZone(zoneId);
    dragCounter.current++;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setHoveredZone(null);
    }
  };

  const handleDrop = (e: React.DragEvent, zoneId: number) => {
    e.preventDefault();
    setHoveredZone(null);
    dragCounter.current = 0;
    
    if (!draggedItem || showResult) return;

    // Remove item from previous location
    if (draggedFrom === 'items') {
      setItems(prev => prev.filter(item => item.id !== draggedItem.id));
    } else if (typeof draggedFrom === 'number') {
      setDroppedItems(prev => {
        const newItems = { ...prev };
        delete newItems[draggedFrom];
        return newItems;
      });
    }

    // Add to new zone (replace if occupied)
    const previousItemInZone = droppedItems[zoneId];
    if (previousItemInZone) {
      setItems(prev => [...prev, previousItemInZone]);
    }

    setDroppedItems(prev => ({
      ...prev,
      [zoneId]: draggedItem
    }));

    setDraggedItem(null);
    setDraggedFrom(null);
  };

  const handleSubmit = () => {
    if (showResult || Object.keys(droppedItems).length !== dragItems.length) return;
    
    // Check if all items are correctly placed
    const isCorrect = dragItems.every(item => {
      const placedZone = Object.entries(droppedItems).find(([_, placedItem]) => placedItem.id === item.id);
      return placedZone && parseInt(placedZone[0]) === item.correctPosition;
    });

    setIsComplete(true);
    
    // Create user answer record
    const userAnswerRecord: Record<string, number> = {};
    Object.entries(droppedItems).forEach(([zoneId, item]) => {
      userAnswerRecord[item.id] = parseInt(zoneId);
    });
    
    onAnswer(isCorrect, userAnswerRecord);
  };

  const handleReset = () => {
    if (showResult) return;
    
    // Move all dropped items back to items area
    const allItems = [...items, ...Object.values(droppedItems)];
    setItems(allItems.sort(() => Math.random() - 0.5));
    setDroppedItems({});
    setIsComplete(false);
  };

  const getZoneStyle = (zoneId: number) => {
    const hasItem = droppedItems[zoneId];
    const isHovered = hoveredZone === zoneId;
    
    if (showResult && hasItem) {
      const isCorrect = hasItem.correctPosition === zoneId;
      return `
        border-2 rounded-xl p-4 min-h-[80px] flex items-center justify-center
        transition-all duration-300
        ${isCorrect 
          ? 'border-green-500 bg-green-500/20 text-green-400' 
          : 'border-red-500 bg-red-500/20 text-red-400'
        }
      `;
    }
    
    return `
      border-2 border-dashed rounded-xl p-4 min-h-[80px] flex items-center justify-center
      transition-all duration-300
      ${hasItem 
        ? 'border-blue-400 bg-blue-500/20 text-white' 
        : isHovered 
          ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300'
          : 'border-gray-500 bg-gray-700/50 text-gray-300'
      }
    `;
  };

  const getItemStyle = (item: DragItem, location: 'items' | 'dropped') => {
    if (showResult && location === 'dropped') {
      const placedZone = Object.entries(droppedItems).find(([_, placedItem]) => placedItem.id === item.id);
      if (placedZone) {
        const isCorrect = parseInt(placedZone[0]) === item.correctPosition;
        return `
          px-4 py-3 rounded-xl font-semibold cursor-move
          transition-all duration-300 border-2
          ${isCorrect 
            ? 'bg-green-500 text-white border-green-500' 
            : 'bg-red-500 text-white border-red-500'
          }
        `;
      }
    }
    
    return `
      px-4 py-3 rounded-xl font-semibold cursor-move
      bg-white text-gray-900 border-2 border-gray-200
      hover:border-blue-400 hover:bg-blue-50
      transform transition-all duration-200 hover:scale-105
      shadow-md hover:shadow-lg
    `;
  };

  const allItemsPlaced = Object.keys(droppedItems).length === dragItems.length;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white">
          {question}
        </h1>
        
        <div className="flex items-center space-x-4">
          <button
            className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
            title="ฟังเสียงคำถาม"
            aria-label="ฟังเสียงคำถาม"
          >
            <Volume2 className="w-6 h-6 text-white" />
          </button>
          
          {!showResult && (
            <button
              onClick={handleReset}
              className="p-3 bg-gray-500 hover:bg-gray-600 rounded-full transition-colors"
              title="รีเซ็ตการจัดเรียง"
              aria-label="รีเซ็ตการจัดเรียง"
            >
              <RotateCcw className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8 text-center">
        <p className="text-gray-300 text-lg">
          ลากรายการจากด้านล่างไปวางในตำแหน่งที่ถูกต้อง
        </p>
      </div>

      {/* Drop Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {dropZones.map((zone) => (
          <div
            key={zone.id}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, zone.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, zone.id)}
            className={getZoneStyle(zone.id)}
          >
            {droppedItems[zone.id] ? (
              <div
                draggable={!showResult}
                onDragStart={(e) => handleDragStart(e, droppedItems[zone.id], zone.id)}
                className={getItemStyle(droppedItems[zone.id], 'dropped')}
              >
                {droppedItems[zone.id].emoji && (
                  <span className="mr-2">{droppedItems[zone.id].emoji}</span>
                )}
                {droppedItems[zone.id].text}
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl mb-2">⬇️</div>
                <span className="font-semibold">{zone.label}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Available Items */}
      <div className="bg-gray-800/50 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold text-white mb-4 text-center">รายการที่สามารถลากได้</h3>
        <div className="flex flex-wrap justify-center gap-4 min-h-[100px]">
          {items.map((item) => (
            <div
              key={item.id}
              draggable={!showResult}
              onDragStart={(e) => handleDragStart(e, item, 'items')}
              className={getItemStyle(item, 'items')}
            >
              {item.emoji && <span className="mr-2">{item.emoji}</span>}
              {item.text}
            </div>
          ))}
          {items.length === 0 && !showResult && (
            <div className="text-gray-500 text-center py-8">
              <p>รายการทั้งหมดถูกวางแล้ว!</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      {allItemsPlaced && !showResult && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            ตรวจสอบคำตอบ
          </button>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center space-x-2 text-gray-300">
          <span>ความคืบหน้า:</span>
          <span className="font-semibold text-white">
            {Object.keys(droppedItems).length}/{dragItems.length}
          </span>
          {allItemsPlaced && !showResult && (
            <CheckCircle className="w-5 h-5 text-green-400 ml-2" />
          )}
        </div>
      </div>
    </div>
  );
}
