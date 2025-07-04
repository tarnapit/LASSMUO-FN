"use client";
import { useState, useRef } from "react";

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

interface DragDropQuestionProps {
  dragItems: DragItem[];
  dropZones: DropZone[];
  onAnswer: (isCorrect: boolean, userAnswer: Record<string, number>) => void;
  showResult: boolean;
  userAnswer?: Record<string, number>;
}

export default function DragDropQuestion({
  dragItems,
  dropZones,
  onAnswer,
  showResult,
  userAnswer
}: DragDropQuestionProps) {
  const [items, setItems] = useState<DragItem[]>(
    // Shuffle the drag items initially
    [...dragItems].sort(() => Math.random() - 0.5)
  );
  const [droppedItems, setDroppedItems] = useState<Record<number, DragItem>>({});
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<'items' | number | null>(null);
  const dragCounter = useRef(0);

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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
  };

  const handleDrop = (e: React.DragEvent, dropZoneId: number) => {
    e.preventDefault();
    dragCounter.current = 0;
    
    if (!draggedItem || !draggedFrom || showResult) return;

    // If dropping in the same place, do nothing
    if (draggedFrom === dropZoneId) return;

    const newDroppedItems = { ...droppedItems };
    let newItems = [...items];

    // Remove item from its current location
    if (draggedFrom === 'items') {
      newItems = items.filter(item => item.id !== draggedItem.id);
    } else if (typeof draggedFrom === 'number') {
      delete newDroppedItems[draggedFrom];
    }

    // If there's already an item in the target zone, move it back to items
    if (newDroppedItems[dropZoneId]) {
      newItems.push(newDroppedItems[dropZoneId]);
    }

    // Place the dragged item in the target zone
    newDroppedItems[dropZoneId] = draggedItem;

    setItems(newItems);
    setDroppedItems(newDroppedItems);
    setDraggedItem(null);
    setDraggedFrom(null);

    // Check if all items are placed
    if (newItems.length === 0) {
      const isCorrect = checkAnswer(newDroppedItems);
      const answer = Object.fromEntries(
        Object.entries(newDroppedItems).map(([zoneId, item]) => [item.id, parseInt(zoneId)])
      );
      onAnswer(isCorrect, answer);
    }
  };

  const handleDropToItems = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    
    if (!draggedItem || !draggedFrom || showResult) return;

    // Only allow dropping back to items from drop zones
    if (typeof draggedFrom === 'number') {
      const newDroppedItems = { ...droppedItems };
      delete newDroppedItems[draggedFrom];
      
      const newItems = [...items, draggedItem];
      
      setItems(newItems);
      setDroppedItems(newDroppedItems);
    }

    setDraggedItem(null);
    setDraggedFrom(null);
  };

  const checkAnswer = (droppedItems: Record<number, DragItem>): boolean => {
    return Object.entries(droppedItems).every(([zoneId, item]) => {
      return item.correctPosition === parseInt(zoneId);
    });
  };

  const getItemStyle = (item: DragItem, isInDropZone: boolean = false): string => {
    if (!showResult) {
      return "bg-white text-black hover:bg-gray-100 border-2 border-gray-300 cursor-grab active:cursor-grabbing";
    }
    
    // Show result colors
    if (userAnswer && userAnswer[item.id]) {
      const placedPosition = userAnswer[item.id];
      const isCorrect = item.correctPosition === placedPosition;
      return isCorrect 
        ? "bg-green-500 text-white border-2 border-green-600"
        : "bg-red-500 text-white border-2 border-red-600";
    }
    
    if (isInDropZone) {
      const placedPosition = Object.entries(droppedItems).find(([_, droppedItem]) => droppedItem.id === item.id)?.[0];
      if (placedPosition) {
        const isCorrect = item.correctPosition === parseInt(placedPosition);
        return isCorrect 
          ? "bg-green-500 text-white border-2 border-green-600"
          : "bg-red-500 text-white border-2 border-red-600";
      }
    }
    
    return "bg-gray-300 text-gray-600 border-2 border-gray-400";
  };

  const getDropZoneStyle = (zoneId: number, isDragOver: boolean = false): string => {
    const baseStyle = "min-h-24 p-4 rounded-lg border-2 transition-all duration-200";
    
    if (isDragOver) {
      return `${baseStyle} border-blue-500 bg-blue-100 scale-105`;
    }
    
    if (!showResult) {
      return droppedItems[zoneId] 
        ? `${baseStyle} border-blue-400 bg-blue-50` 
        : `${baseStyle} border-gray-300 bg-gray-50 border-dashed`;
    }
    
    // Show result colors
    if (droppedItems[zoneId]) {
      const item = droppedItems[zoneId];
      const isCorrect = item.correctPosition === zoneId;
      return isCorrect 
        ? `${baseStyle} border-green-400 bg-green-50`
        : `${baseStyle} border-red-400 bg-red-50`;
    }
    
    return `${baseStyle} border-gray-300 bg-gray-50 border-dashed`;
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Drop Zones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dropZones.map((zone) => (
          <div
            key={zone.id}
            className={getDropZoneStyle(zone.id, draggedItem !== null)}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, zone.id)}
          >
            <div className="text-center text-sm font-medium text-gray-600 mb-2">
              {zone.label}
            </div>
            
            {droppedItems[zone.id] && (
              <div
                draggable={!showResult}
                onDragStart={(e) => handleDragStart(e, droppedItems[zone.id], zone.id)}
                className={`
                  p-3 rounded-lg text-center font-medium transition-all duration-200
                  ${getItemStyle(droppedItems[zone.id], true)}
                  ${showResult ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                `}
              >
                <div className="flex items-center justify-center space-x-2">
                  {droppedItems[zone.id].emoji && (
                    <span className="text-lg">{droppedItems[zone.id].emoji}</span>
                  )}
                  <span className="text-sm">{droppedItems[zone.id].text}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Available Items */}
      <div className="bg-gray-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          ลากรายการด้านล่างไปยังตำแหน่งที่ถูกต้อง
        </h3>
        
        <div
          className={`
            flex flex-wrap gap-3 justify-center min-h-16 p-4 rounded-lg transition-all duration-200
            ${draggedItem && draggedFrom !== 'items' ? 'bg-blue-100 border-2 border-blue-300 border-dashed' : 'bg-transparent'}
          `}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDropToItems}
        >
          {items.map((item) => (
            <div
              key={item.id}
              draggable={!showResult}
              onDragStart={(e) => handleDragStart(e, item, 'items')}
              className={`
                p-3 rounded-lg font-medium transition-all duration-200
                ${getItemStyle(item)}
                ${showResult ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
              `}
            >
              <div className="flex items-center space-x-2">
                {item.emoji && (
                  <span className="text-lg">{item.emoji}</span>
                )}
                <span>{item.text}</span>
              </div>
            </div>
          ))}
          
          {items.length === 0 && !showResult && (
            <div className="text-gray-500 text-sm italic">
              ลากรายการจากบนลงมาวางที่นี่เพื่อย้ายกลับ
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      {!showResult && items.length > 0 && (
        <div className="text-center text-gray-600">
          <p className="text-sm">💡 ลากและวางรายการไปยังตำแหน่งที่ถูกต้อง</p>
        </div>
      )}
    </div>
  );
}
