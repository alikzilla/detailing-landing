import { Fragment } from 'react';

/**
 * Wraps every word in <span data-word> so GSAP can animate words one by one. "\n" becomes a line break.
 * Each section styles the words with `.someClass [data-word]` in its own CSS module.
 */
export default function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(' ').filter(Boolean).map((word, wi, arr) => (
            <Fragment key={wi}>
              <span data-word>{word}</span>
              {wi < arr.length - 1 && ' '}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}
