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
      // Trigger confetti celebration!
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-clay-yellow text-slate-900 border-3 border-black rounded-3xl p-6 sm:p-8 shadow-brutal-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-1.5 rounded-full bg-white border-2 border-black hover:bg-slate-100 shadow-brutal-sm"
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white border-3 border-black flex items-center justify-center shadow-brutal text-2xl">
            🧠
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-black">
              학교 상식 미니 퀴즈 대작전!
            </h3>
            <p className="text-xs font-bold text-slate-800">
              퀴즈를 맞히고 실시간 명예의 전당 랭킹보드에 도전해 보세요!
            </p>
          </div>
        </div>

        {!isFinished ? (
          <div>
            {/* Progress & Current Score */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black bg-white px-3 py-1 rounded-xl border-2 border-black shadow-brutal-sm">
                문제 {currentQuestionIndex + 1} / {SCHOOL_QUIZ_QUESTIONS.length}
              </span>
              <span className="text-xs font-black bg-neo-pink text-white px-3 py-1 rounded-xl border-2 border-black shadow-brutal-sm">
                현재 점수: {score}점
              </span>
            </div>

            {/* Question Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-3 border-black shadow-brutal mb-5">
              <span className="text-xs font-bold text-amber-600 block mb-1">
                ⭐ 배점: {currentQ.points}점
              </span>
              <h4 className="text-base sm:text-lg font-black text-black leading-snug">
                {currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.answerIndex;
                let btnStyle = 'bg-white hover:bg-slate-50 text-black';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-300 text-black border-emerald-900';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-300 text-black border-rose-900';
                  } else {
                    btnStyle = 'bg-slate-100 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-2xl border-2 border-black text-left text-sm font-black flex items-center justify-between shadow-brutal-sm transition-all ${btnStyle}`}
                  >
                    <span>{idx + 1}. {opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-800" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-800" />}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full neo-btn py-3.5 bg-black text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2"
              >
                <span>{currentQuestionIndex + 1 === SCHOOL_QUIZ_QUESTIONS.length ? '결과 보기' : '다음 문제로'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="text-center py-2 animate-scale-up">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white border-3 border-black flex items-center justify-center shadow-brutal text-4xl mb-3">
              🏆
            </div>
            <h4 className="text-2xl font-black text-black mb-1">
              퀴즈 완료! 축하합니다!
            </h4>
            <p className="text-sm font-bold text-slate-800 mb-4">
              총 획득 점수: <span className="text-2xl font-black text-rose-600">{score}</span>점!
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmitScore} className="p-4 rounded-2xl bg-white border-3 border-black shadow-brutal mb-4 text-left">
                <label className="block text-xs font-black text-black mb-1">
                  명예의 전당 랭킹 등록 닉네임
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="예: 2학년 수학의정석"
                    className="flex-1 px-3 py-2 rounded-xl border-2 border-black text-sm font-bold shadow-brutal-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="neo-btn px-4 py-2 bg-neo-green text-black rounded-xl font-black text-xs hover:bg-emerald-400"
                  >
                    점수 등록
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 mb-4 rounded-2xl bg-emerald-100 border-2 border-emerald-600 text-emerald-800 text-xs font-black">
                ✅ 점수가 명예의 전당 랭킹보드에 성공적으로 등록되었습니다!
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleRestart}
                className="neo-btn flex-1 py-3 bg-white text-black rounded-2xl font-black text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다시 도전하기</span>
              </button>
              <button
                onClick={onClose}
                className="neo-btn flex-1 py-3 bg-black text-white rounded-2xl font-black text-xs"
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
