import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Dumbbell, ChevronRight } from 'lucide-react';
import { exercises, categories } from '@/data/exercises';
import { cn } from '@/lib/utils';

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Exercises() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredExercises = exercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Exercise Library</h1>
        <p className="text-muted-foreground">Browse and learn exercises</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Exercise list */}
      <div className="space-y-3">
        {filteredExercises.map((exercise, index) => (
          <motion.button
            key={exercise.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            className="w-full p-4 rounded-2xl bg-card border text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{exercise.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{exercise.equipment}</span>
                  <span className="text-muted-foreground">•</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      difficultyColors[exercise.difficulty]
                    )}
                  >
                    {exercise.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {exercise.muscleGroups.slice(0, 3).map((muscle) => (
                    <span
                      key={muscle}
                      className="px-2 py-0.5 bg-secondary rounded text-xs"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </div>
          </motion.button>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No exercises found</p>
        </div>
      )}
    </div>
  );
}

