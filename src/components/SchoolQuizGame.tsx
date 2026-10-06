'use client';

import React, { useState } from 'react';
import { SCHOOL_QUIZ_QUESTIONS } from '@/data/mockData';
import { Sparkles, Trophy, CheckCircle2, XCircle, RotateCcw, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SchoolQuizGameProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitScore: (nickname: string, score: number) => void;
}

export const SchoolQuizGame: React.FC<SchoolQuizGameProps> = ({
  isOpen,
  onClose,
  onSubmitScore,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentQ = SCHOOL_QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    if (idx === currentQ.answerIndex) {
      setScore((prev) => prev + currentQ.points);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < SCHOOL_QUIZ_QUESTIONS.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setSubmitted(false);
  };

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onSubmitScore(nickname.trim(), score);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg clay-card glass-panel border border-white/60 dark:border-white/15 p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl clay-btn bg-amber-500 text-white flex items-center justify-center shadow-md text-2xl">
            🧠
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
              학교 상식 미니 퀴즈
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              문제를 맞히고 실시간 명예의 전당 랭킹에 도전하세요!
            </p>
          </div>
        </div>

        {!isFinished ? (
          <div>
            {/* Progress & Current Score */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full clay-badge bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                문제 {currentQuestionIndex + 1} / {SCHOOL_QUIZ_QUESTIONS.length}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full clay-badge bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                현재 점수: {score}점
              </span>
            </div>

            {/* Question Card */}
            <div className="p-4 sm:p-5 rounded-2xl clay-card bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 mb-5">
              <span className="text-xs font-bold text-amber-600 block mb-1">
                ⭐ 배점: {currentQ.points}점
              </span>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white leading-snug">
                {currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.answerIndex;
                let btnStyle = 'bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:bg-white';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-100 text-rose-900 border-rose-400 dark:bg-rose-950 dark:text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-100 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-2xl clay-btn text-left text-sm font-bold flex items-center justify-between transition-all ${btnStyle}`}
                  >
                    <span>{idx + 1}. {opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full py-3 clay-btn bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{currentQuestionIndex + 1 === SCHOOL_QUIZ_QUESTIONS.length ? '최종 결과 확인하기' : '다음 문제'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Quiz Results View */
          <div className="text-center py-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl clay-card bg-amber-100 text-amber-600 flex items-center justify-center text-4xl shadow-md">
              🏆
            </div>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-1">
              퀴즈 도전 완료!
            </h4>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4">
              총 획득 점수: <strong className="text-indigo-600 dark:text-indigo-400 text-xl">{score}점</strong>
            </p>

            {/* Score Submit Form */}
            {!submitted ? (
              <form onSubmit={handleSubmitScore} className="p-4 rounded-2xl clay-card bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  명예의 전당에 닉네임을 등록하세요!
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="등록할 닉네임 입력"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs clay-input text-slate-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="clay-btn px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                  >
                    랭킹 등록
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-5 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>명예의 전당에 점수가 정상 등록되었습니다! 🎉</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 py-2.5 clay-btn bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다시 도전하기</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 clay-btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
