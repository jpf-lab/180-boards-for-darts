type QuoteProps = {
  text: string;
  author: string;
  source: string;
  /** Language of the quote, default 'de' */
  lang?: string;
};

export default function Quote({ text, author, source, lang = 'de' }: Readonly<QuoteProps>) {
  return (
    <figure className={'border-l-4 border-sky-800 pl-4 my-4'}>
      <blockquote lang={lang} className={'italic text-lg'}>
        <p>{text}</p>
      </blockquote>
      <figcaption className={'text-sm mt-2'}>
        — {author}, <cite>{source}</cite>
      </figcaption>
    </figure>
  );
}
