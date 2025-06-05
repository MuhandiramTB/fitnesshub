-- AlterTable
ALTER TABLE "User" ADD COLUMN     "achievements" JSONB DEFAULT '{"firstWorkout":false,"workoutsCompleted":0,"consistencyStreak":0}',
ADD COLUMN     "targetWeight" DOUBLE PRECISION,
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "workoutFrequency" INTEGER;
