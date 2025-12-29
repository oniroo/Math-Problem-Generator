
/**
 * 수학 문제 채점을 위한 유틸리티 클래스입니다.
 */
export class GradingService {
  /**
   * 사용자의 입력값과 정답을 정규화하여 비교합니다.
   * 공백 제거 및 대소문자 무시 등을 수행합니다.
   */
  static compare(userAnswer: string, correctAnswer: string): boolean {
    const normalize = (text: string) => text.trim().replace(/\s/g, '').toLowerCase();
    return normalize(userAnswer) === normalize(correctAnswer);
  }
}
