import { Fragment } from "react";

/**
 * Phone numbers and e-mail addresses that wrap cleanly on narrow screens.
 * Use these wherever a number or address is rendered as text.
 */

/** Never breaks inside the number ("66 78 / 04 11"); the whole number moves to the next line instead. */
export function PhoneText({ children }: { children: string }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

// inline-block = "move as one piece". It drops the parent's underline, hence the inherited text-decoration.
const piece = "inline-block max-w-full break-words [text-decoration:inherit]";

/** One half of an address. Only breaks (before a "." or after a "-") when it is wider than its container. */
function EmailPart({ text }: { text: string }) {
  return (
    <span className={piece}>
      {text.split(/(?<=-)|(?=\.)/).map((segment, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {segment}
        </Fragment>
      ))}
    </span>
  );
}

/**
 * In order of preference: the whole address moves to the next line; it breaks after the @;
 * a half breaks at a "." or "-"; and only as a last resort inside a word.
 */
export function EmailText({ children }: { children: string }) {
  const at = children.indexOf("@") + 1;
  return (
    <span className={piece}>
      <EmailPart text={children.slice(0, at)} />
      <wbr />
      <EmailPart text={children.slice(at)} />
    </span>
  );
}
