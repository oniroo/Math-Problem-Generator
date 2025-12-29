
import React, { useEffect, useRef, memo } from 'react';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * LaTeX 수식을 렌더링하는 컴포넌트입니다.
 * React.memo를 사용하여 콘텐츠가 변경되지 않으면 리렌더링을 방지합니다.
 */
const MathRenderer: React.FC<MathRendererProps> = memo(({ content, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typeset = () => {
      const MathJax = (window as any).MathJax;
      if (MathJax && containerRef.current) {
        // 이전 렌더링 결과가 깨지지 않도록 DOM이 준비된 후 typesetPromise 호출
        MathJax.typesetPromise([containerRef.current]).catch((err: any) => 
          console.error('MathJax typeset failed: ', err)
        );
      }
    };

    // React가 DOM을 업데이트한 후 다음 프레임에서 MathJax가 실행되도록 유도
    const rafHandle = requestAnimationFrame(typeset);
    
    return () => {
      cancelAnimationFrame(rafHandle);
    };
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      // MathJax가 내부 DOM을 조작하므로, React가 간섭하지 않도록 dangerouslySetInnerHTML 사용
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
});

export default MathRenderer;
