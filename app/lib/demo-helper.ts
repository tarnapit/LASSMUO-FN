// Helper function to simulate completed modules for demo purposes
export function simulateCompletedModules() {
  if (typeof window === 'undefined') return;
  
  // จำลองว่า solar-system module เรียนจบแล้ว
  const solarSystemProgress = {
    moduleId: 'solar-system',
    isStarted: true,
    isCompleted: true,
    completedChapters: ['chapter-1', 'chapter-2', 'chapter-3'],
    totalTimeSpent: 45,
    completedAt: new Date().toISOString(),
    chapters: {
      'chapter-1': {
        moduleId: 'solar-system',
        chapterId: 'chapter-1',
        completed: true,
        score: 100,
        completedAt: new Date(),
        timeSpent: 15,
        readProgress: 100
      },
      'chapter-2': {
        moduleId: 'solar-system',
        chapterId: 'chapter-2',
        completed: true,
        score: 100,
        completedAt: new Date(),
        timeSpent: 20,
        readProgress: 100
      },
      'chapter-3': {
        moduleId: 'solar-system',
        chapterId: 'chapter-3',
        completed: true,
        score: 100,
        completedAt: new Date(),
        timeSpent: 10,
        readProgress: 100
      }
    }
  };

  // จำลองว่า earth-structure module เรียนจบแล้ว
  const earthStructureProgress = {
    moduleId: 'earth-structure',
    isStarted: true,
    isCompleted: true,
    completedChapters: ['chapter-1', 'chapter-2', 'chapter-3'],
    totalTimeSpent: 40,
    completedAt: new Date().toISOString(),
    chapters: {
      'chapter-1': {
        moduleId: 'earth-structure',
        chapterId: 'chapter-1',
        completed: true,
        score: 100,
        completedAt: new Date(),
        timeSpent: 15,
        readProgress: 100
      },
      'chapter-2': {
        moduleId: 'earth-structure',
        chapterId: 'chapter-2',
        completed: true,
        score: 100,
        completedAt: new Date(),
        timeSpent: 15,
        readProgress: 100
      },
      'chapter-3': {
        moduleId: 'earth-structure',
        chapterId: 'chapter-3',
        completed: true,
        score: 100,
        completedAt: new Date(),
        timeSpent: 10,
        readProgress: 100
      }
    }
  };

  // บันทึกลง localStorage
  localStorage.setItem('module-progress-solar-system', JSON.stringify(solarSystemProgress));
  localStorage.setItem('module-progress-earth-structure', JSON.stringify(earthStructureProgress));
  
  console.log('Demo: Simulated completed modules for solar-system and earth-structure');
}
