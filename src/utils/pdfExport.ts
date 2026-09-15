import { jsPDF } from 'jspdf';
import { Exam, ExamAttempt } from '../types';

export function exportExamReportPDF(exam: Exam, attempt: ExamAttempt, studentName: string = 'Knowledge Seeker') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const checkAddPage = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - 20) {
      doc.addPage();
      y = 18;
      // Header on subsequent pages
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 150);
      doc.text(`SmartCells • ${exam.title} — Review & Feedback Report`, margin, 12);
      doc.setDrawColor(230, 230, 235);
      doc.line(margin, 14, pageWidth - margin, 14);
      y = 20;
    }
  };

  // --- Title / Header Banner ---
  doc.setFillColor(79, 70, 229); // Brand Indigo
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('SmartCells Academic Review & Exam Feedback', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(224, 231, 255);
  doc.text('Official Comprehensive Performance Analysis & Question Notes', margin + 6, y + 16);

  y += 28;

  // --- Metadata & Score Card ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(exam.title, margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const examDate = attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : new Date().toLocaleString();
  doc.text(`Student: ${studentName}  |  Subject: ${exam.subject}  |  Level: ${exam.grade || 'General'}  |  Difficulty: ${exam.difficulty || 'Standard'}`, margin + 6, y + 15);
  doc.text(`Completed: ${examDate}  |  Status: Completed`, margin + 6, y + 21);

  // Score Pills on right
  const scoreX = pageWidth - margin - 50;
  const isPassing = attempt.score >= 70;
  doc.setFillColor(isPassing ? 240 : 254, isPassing ? 253 : 242, isPassing ? 244 : 242);
  doc.setDrawColor(isPassing ? 187 : 254, isPassing ? 247 : 202, isPassing ? 208 : 202);
  doc.roundedRect(scoreX, y + 5, 44, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(isPassing ? 22 : 185, isPassing ? 101 : 28, isPassing ? 52 : 28);
  doc.text(`${attempt.score}%`, scoreX + 22, y + 15, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${Object.keys(attempt.answers).length}/${exam.questions.length} Questions Answered`, scoreX + 22, y + 22, { align: 'center' });

  y += 40;

  // --- AI Feedback & Coaching Notes ---
  if (attempt.feedback && attempt.feedback.trim()) {
    checkAddPage(30);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('AI FEEDBACK & RECOMMENDATIONS', margin + 4, y + 5);
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    // Clean out markdown symbols for clean PDF rendering
    const cleanFeedback = attempt.feedback
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .trim();

    const feedbackLines = doc.splitTextToSize(cleanFeedback, contentWidth - 4);
    for (const line of feedbackLines) {
      checkAddPage(6);
      doc.text(line, margin + 2, y);
      y += 5;
    }
    y += 6;
  }

  // --- Review Questions & Detailed Notes ---
  checkAddPage(20);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text('QUESTION-BY-QUESTION REVIEW & EXPLANATIONS', margin + 4, y + 5);
  y += 12;

  exam.questions.forEach((q, idx) => {
    const userAnswer = attempt.answers[q.id];
    const isCorrect = attempt.reviewedAnswers?.[q.id] ?? 
      (userAnswer && userAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim());

    checkAddPage(35);

    // Question box header
    doc.setFillColor(isCorrect ? 240 : 254, isCorrect ? 253 : 242, isCorrect ? 244 : 242);
    doc.setDrawColor(isCorrect ? 187 : 254, isCorrect ? 247 : 202, isCorrect ? 208 : 202);
    doc.roundedRect(margin, y, contentWidth, 6, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(isCorrect ? 21 : 185, isCorrect ? 128 : 28, isCorrect ? 61 : 28);
    doc.text(`Question ${idx + 1}  •  ${isCorrect ? 'CORRECT' : 'INCORRECT'}`, margin + 3, y + 4.2);

    y += 9;

    // Question text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    const qLines = doc.splitTextToSize(q.question, contentWidth - 6);
    for (const line of qLines) {
      checkAddPage(5);
      doc.text(line, margin + 3, y);
      y += 4.5;
    }
    y += 1.5;

    // Options if multiple choice
    if (q.options && q.options.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      for (const opt of q.options) {
        checkAddPage(4);
        const isUserOpt = userAnswer === opt;
        const isCorrectOpt = q.correctAnswer === opt;
        const prefix = isCorrectOpt ? '✓ ' : (isUserOpt ? '✗ ' : '• ');
        doc.text(`${prefix}${opt}`, margin + 6, y);
        y += 4;
      }
      y += 1.5;
    }

    // Answers summary line
    checkAddPage(10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    
    doc.setTextColor(isCorrect ? 22 : 220, isCorrect ? 101 : 38, isCorrect ? 52 : 38);
    doc.text(`Your Answer: ${userAnswer || '(No answer provided)'}`, margin + 3, y);
    
    doc.setTextColor(22, 101, 52);
    doc.text(`Correct Answer: ${q.correctAnswer}`, margin + 80, y);
    y += 5.5;

    // Explanation
    if (q.explanation) {
      checkAddPage(15);
      doc.setFillColor(254, 249, 195); // amber light
      doc.setDrawColor(253, 230, 138);
      
      const cleanExplanation = q.explanation
        .replace(/###/g, '')
        .replace(/##/g, '')
        .replace(/#/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .trim();
      const expLines = doc.splitTextToSize(`Explanation: ${cleanExplanation}`, contentWidth - 10);
      const expBoxHeight = expLines.length * 4 + 4;

      doc.roundedRect(margin + 2, y, contentWidth - 4, expBoxHeight, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(113, 63, 18);
      
      let expY = y + 3.2;
      for (const eline of expLines) {
        doc.text(eline, margin + 5, expY);
        expY += 4;
      }
      y += expBoxHeight + 4;
    } else {
      y += 4;
    }

    // Divider
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  });

  // --- Add Page Numbers to all pages ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `SmartCells Learning Systems • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const cleanFileName = exam.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${cleanFileName}_Review_Notes.pdf`);
}
