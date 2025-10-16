'use client';

import { useState, useEffect } from 'react';
import { stageService } from '../api/services';
import { useLearningModuleData } from './useLearningData';
import { useCoursePostestData } from './useCoursePostestData';

// Data adapter that uses real API data with fallback to mock data
export function useStageData() {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to use real API first
        const stagesResponse = await stageService.getAllStages();
        
        if (stagesResponse.success && stagesResponse.data) {
          setStages(stagesResponse.data);
        } else {
          throw new Error('Failed to fetch stages from API');
        }
        
      } catch (err) {
        console.error('Error fetching stages from API, falling back to mock data:', err);
        
        // Fallback to mock data
        try {
          const { stages } = require('@/app/data/stages');
          const allStages = Object.values(stages);
          setStages(allStages);
          setError(null); // Clear error since we have fallback data
        } catch (fallbackError) {
          console.error('Failed to load fallback stage data:', fallbackError);
          setError('Failed to load stage data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    stages,
    loading,
    error,
  };
}

export function useUserProgress(userId?: number) {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          // No user ID, use localStorage fallback
          setProgress(null);
          return;
        }

        // Try to fetch from API (when ready)
        // For now, just return null to use localStorage fallback
        setProgress(null);
        
      } catch (err) {
        console.error('Error fetching user progress:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user progress');
        setProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return {
    progress,
    loading,
    error,
  };
}

// Use the real learning data hook
export function useLearningData() {
  return useLearningModuleData();
}

export function useQuizData() {
  // Use the new Course Postest API hook instead of mock data
  return useCoursePostestData();
}

export function useMiniGameData() {
  const [games, setGames] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // For now, use mock data (mini-game API integration can be added later)
        const { miniGames, solarQuizQuestions } = require('@/app/data/mini-games');
        setGames(miniGames);
        setQuestions(solarQuizQuestions);
        
      } catch (err) {
        console.error('Error fetching mini games:', err);
        setError('Failed to fetch mini games');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    games,
    questions,
    loading,
    error,
  };
}