import { progressManager } from './progress';
import { MiniGameAttempt, GameResult } from '../types/mini-game';

export class MiniGameProgressHelper {
  
  // สร้าง MiniGameAttempt จาก GameResult
  static createAttemptFromResult(
    gameId: string, 
    gameMode: string, 
    result: GameResult, 
    answers: Record<string, any> = {},
    questionTimes: Record<string, number> = {}
  ): MiniGameAttempt {
    const now = new Date();
    
    return {
      id: `${gameMode}-${now.getTime()}`,
      gameId,
      gameMode: gameMode as any,
      answers,
      score: result.score,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      percentage: result.percentage,
      timeSpent: result.timeSpent,
      bonusPoints: result.bonusPoints,
      startedAt: new Date(now.getTime() - (result.timeSpent * 1000)),
      completedAt: now,
      questionTimes
    };
  }
  
  // บันทึกผลลัพธ์เกม
  static saveGameResult(
    gameId: string,
    gameMode: string,
    result: GameResult,
    answers: Record<string, any> = {},
    questionTimes: Record<string, number> = {}
  ): void {
    const attempt = this.createAttemptFromResult(gameId, gameMode, result, answers, questionTimes);
    progressManager.saveMiniGameAttempt(attempt);
  }
  
  // ดึงสถิติเกม
  static getGameStats() {
    return progressManager.getMiniGameStats();
  }
  
  // ดึงจำนวนเกมที่เล่นแล้ว
  static getCompletedGamesCount(): number {
    const stats = progressManager.getMiniGameStats();
    if (!stats) return 0;
    
    const uniqueGameModes = new Set(stats.attempts.map(a => a.gameMode));
    return uniqueGameModes.size;
  }
  
  // ดึงคะแนนรวม
  static getTotalScore(): number {
    const stats = progressManager.getMiniGameStats();
    return stats?.totalScore || 0;
  }
  
  // ดึงจำนวนวันติดต่อกัน
  static getStreakDays(): number {
    const progress = progressManager.getProgress();
    return progress.currentStreak || 0;
  }
  
  // ตรวจสอบว่าเคยเล่นโหมดนี้หรือยัง
  static hasCompleted(gameMode: string): boolean {
    return progressManager.hasPlayedGameMode(gameMode);
  }
  
  // ดึงคะแนนสูงสุดในโหมดที่ระบุ
  static getBestScore(gameMode: string): number {
    const stats = progressManager.getMiniGameStats();
    if (!stats) return 0;
    
    switch (gameMode) {
      case 'score-challenge':
        return stats.scoreChallengeBest;
      case 'time-rush':
        return stats.timeRushBest;
      case 'random-quiz':
        return stats.randomQuizBest;
      default:
        return 0;
    }
  }
  
  // ดึงประวัติการเล่นในโหมดที่ระบุ
  static getGameHistory(gameMode?: string): MiniGameAttempt[] {
    return progressManager.getMiniGameHistory(gameMode);
  }
  
  // ดึง achievements ที่ปลดล็อกแล้ว
  static getUnlockedAchievements(): string[] {
    const stats = progressManager.getMiniGameStats();
    return stats?.achievements || [];
  }
  
  // คำนวณเปอร์เซ็นต์ความก้าวหน้า
  static getProgressPercentage(): number {
    const totalModes = 3; // score-challenge, time-rush, random-quiz
    const completedModes = this.getCompletedGamesCount();
    return Math.round((completedModes / totalModes) * 100);
  }
  
  // ดึงข้อมูลสำหรับการแสดง achievement
  static getAchievementData() {
    const unlockedAchievements = this.getUnlockedAchievements();
    const stats = progressManager.getMiniGameStats();
    
    return [
      {
        id: "first-game",
        name: "ผู้เริ่มต้น",
        description: "เล่นแบบทดสอบครั้งแรก",
        icon: "🎮",
        unlocked: unlockedAchievements.includes('first-game'),
        reward: "+50 คะแนน",
      },
      {
        id: "score-master",
        name: "ปรมาจารย์คะแนน",
        description: "ได้คะแนนเต็มใน Score Challenge",
        icon: "🏆",
        unlocked: unlockedAchievements.includes('score-master'),
        reward: "+200 คะแนน",
      },
      {
        id: "speed-demon",
        name: "ปีศาจความเร็ว",
        description: "ตอบถูก 20 ข้อใน Time Rush",
        icon: "⚡",
        unlocked: unlockedAchievements.includes('speed-demon'),
        reward: "+300 คะแนน",
      },
      {
        id: "knowledge-expert",
        name: "ผู้เชี่ยวชาญความรู้",
        description: "ผ่านทุกโหมดด้วยคะแนน 80%+",
        icon: "🧠",
        unlocked: unlockedAchievements.includes('knowledge-expert'),
        reward: "+500 คะแนน",
      },
      {
        id: "perfect-score",
        name: "คะแนนสมบูรณ์แบบ",
        description: "ได้คะแนน 100% ในโหมดใดโหมดหนึ่ง",
        icon: "⭐",
        unlocked: unlockedAchievements.includes('perfect-score'),
        reward: "+250 คะแนน",
      },
      {
        id: "quiz-champion",
        name: "แชมป์แบบทดสอบ",
        description: "ครองอันดับ 1 ในลีดเดอร์บอร์ด",
        icon: "👑",
        unlocked: false, // This would need leaderboard integration
        reward: "+1000 คะแนน",
      }
    ];
  }
  
  // ดึงสถิติที่น่าสนใจ
  static getInterestingStats() {
    const stats = progressManager.getMiniGameStats();
    const progress = progressManager.getProgress();
    
    if (!stats) {
      return {
        totalPlays: 0,
        averageTime: 0,
        bestScore: 0,
        accuracy: 0
      };
    }
    
    const accuracy = stats.gamesPlayed > 0 
      ? Math.round(stats.attempts.reduce((sum, a) => sum + a.percentage, 0) / stats.gamesPlayed)
      : 0;
    
    return {
      totalPlays: stats.gamesPlayed,
      averageTime: stats.gamesPlayed > 0 ? Math.round(stats.totalTimeSpent / stats.gamesPlayed) : 0,
      bestScore: stats.bestScore,
      accuracy
    };
  }
}
