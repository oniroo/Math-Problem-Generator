
import { ProblemType } from './types';

export const PROBLEM_TYPE_LABELS: Record<ProblemType, string> = {
  [ProblemType.DIRECT]: "직접 계산형",
  [ProblemType.PROPERTY]: "성질 활용형",
  [ProblemType.BASE_CHANGE]: "밑 변환형",
  [ProblemType.FRACTION]: "분수·역수 계산형",
  [ProblemType.SIMPLIFICATION]: "복잡한 식 단순화형",
  [ProblemType.EQUATION]: "방정식 풀이형",
  [ProblemType.APPROXIMATION]: "근사값 계산형",
};

export const PROBLEM_TYPE_DESCRIPTIONS: Record<ProblemType, string> = {
  [ProblemType.DIRECT]: "기본 정의를 이용해 바로 답을 구하는 문제",
  [ProblemType.PROPERTY]: "로그의 덧셈, 뺄셈, 거듭 제곱 성질 활용",
  [ProblemType.BASE_CHANGE]: "밑 변환 공식 활용",
  [ProblemType.FRACTION]: "음수 지수나 분수 형태로 나타내는 문제",
  [ProblemType.SIMPLIFICATION]: "여러 로그가 섞여 있는 식을 정리",
  [ProblemType.EQUATION]: "로그가 포함된 방정식 풀이",
  [ProblemType.APPROXIMATION]: "주어진 로그 값을 이용한 근사값 계산",
};
