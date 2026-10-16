import Headline from '../components/Headline.tsx';
import Quote from '../components/Quote.tsx';

export default function Home() {
  return (
    <>
      <Headline variant={'h1'}>Home</Headline>
      <Quote
        text={
          'Werte Lords, werte Ladies...aber auch die seien gegrüsst, die hier nicht auf einem Kissen sitzen!'
        }
        author={'Geoffrey Chaucer'}
        source={'Ritter aus Leidenschaft'}
      />
      <Quote
        text={'Das Horn Helm Hammerhands soll erschallen in der Klamm. Ein allerletztes Mal.'}
        author={'Théoden'}
        source={'Der Herr der Ringe: Die zwei Türme'}
      />
      <Quote
        text={'JP soll bitte in jedem Meeting immer der erste sein.'}
        author={'E.'}
        source={'Irgendwann am Anfang des Capstone Projektes'}
      />

      <Quote
        text={'F* JA!'}
        author={'Alle anderen'}
        source={'Irgendwann am Anfang des Capstone Projektes'}
      />
    </>
  );
}
