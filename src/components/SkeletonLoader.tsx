'use client';

import React from 'react';

export const StatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-panel border border-white/95 p-5 rounded-2xl sm:rounded-3xl h-32 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-tint/80" />
            <div className="h-8 bg-line/60 rounded-lg w-16" />
          </div>
          <div className="h-4 bg-line/60 rounded-md w-28" />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="divide-y divide-line/60 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-5 flex items-center justify-between gap-4 solid-table-row">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-line/70 rounded w-3/4" />
            <div className="h-3 bg-line/50 rounded w-1/4" />
          </div>
          <div className="h-8 w-20 bg-tint/80 rounded-full" />
        </div>
      ))}
    </div>
  );
};
