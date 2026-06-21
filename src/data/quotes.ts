/**
 * Motivational quotes for the Epics panel. Themes: self-belief, capability,
 * deserving good things, and encouragement to act.
 *
 * Curated for impact, motivation, empowerment, and self-worth — not breadth
 * for its own sake. Selection is session-scoped (stable until page reload);
 * swap `getSessionQuote` for a date-keyed picker when moving to daily rotation.
 */

export interface Quote {
  text: string;
  attribution: string;
}

export const QUOTES: Quote[] = [
  // Stoics & classical
  {
    text: "\u201cYou have power over your mind \u2014 not outside events. Realize this, and you will find strength.\u201d",
    attribution: "Marcus Aurelius",
  },
  {
    text: "\u201cWaste no more time arguing about what a good man should be. Be one.\u201d",
    attribution: "Marcus Aurelius",
  },
  {
    text: "\u201cThe impediment to action advances action. What stands in the way becomes the way.\u201d",
    attribution: "Marcus Aurelius",
  },
  {
    text: "\u201cIt is not because things are difficult that we do not dare; it is because we do not dare that things are difficult.\u201d",
    attribution: "Seneca",
  },
  {
    text: "\u201cBegin at once to live, and count each separate day as a separate life.\u201d",
    attribution: "Seneca",
  },
  {
    text: "\u201cLuck is what happens when preparation meets opportunity.\u201d",
    attribution: "Seneca",
  },
  {
    text: "\u201cIt\u2019s not what happens to you, but how you react to it that matters.\u201d",
    attribution: "Epictetus",
  },
  {
    text: "\u201cNo man is free who is not master of himself.\u201d",
    attribution: "Epictetus",
  },
  {
    text: "\u201cWe are what we repeatedly do. Excellence, then, is not an act, but a habit.\u201d",
    attribution: "Aristotle",
  },
  {
    text: "\u201cThe beginning is the most important part of the work.\u201d",
    attribution: "Plato",
  },
  {
    text: "\u201cThe secret of change is to focus all of your energy not on fighting the old, but on building the new.\u201d",
    attribution: "Socrates",
  },
  {
    text: "\u201cMy life has been full of terrible misfortunes, most of which never happened.\u201d",
    attribution: "Michel de Montaigne",
  },
  {
    text: "\u201cWhile there\u2019s life, there\u2019s hope.\u201d",
    attribution: "Marcus Tullius Cicero",
  },

  // Modern thinkers
  {
    text: "\u201cNot everything that is faced can be changed, but nothing can be changed until it is faced.\u201d",
    attribution: "James Baldwin",
  },
  {
    text: "\u201cThe world is before you, and you need not take it or leave it as it was when you came in.\u201d",
    attribution: "James Baldwin",
  },
  {
    text: "\u201cChange your life today. Don\u2019t gamble on the future, act now, without delay.\u201d",
    attribution: "Simone de Beauvoir",
  },
  {
    text: "\u201cIn the depth of winter, I finally learned that within me there lay an invincible summer.\u201d",
    attribution: "Albert Camus",
  },
  {
    text: "\u201cWhen we are no longer able to change a situation, we are challenged to change ourselves.\u201d",
    attribution: "Viktor Frankl",
  },
  {
    text: "\u201cThose who have a \u2018why\u2019 to live, can bear with almost any \u2018how\u2019.\u201d",
    attribution: "Viktor Frankl",
  },
  {
    text: "\u201cEven in the darkest times, we have the right to expect some illumination.\u201d",
    attribution: "Hannah Arendt",
  },
  {
    text: "\u201cThere is only one corner of the universe you can be certain of improving, and that\u2019s your own self.\u201d",
    attribution: "Aldous Huxley",
  },
  {
    text: "\u201cThe good life is one inspired by love and guided by knowledge.\u201d",
    attribution: "Bertrand Russell",
  },

  // Spiritual & contemplative
  {
    text: "\u201cBecause you are alive, everything is possible.\u201d",
    attribution: "Thich Nhat Hanh",
  },
  {
    text: "\u201cSmile, breathe, and go slowly.\u201d",
    attribution: "Thich Nhat Hanh",
  },
  {
    text: "\u201cYou are an aperture through which the universe is looking at and exploring itself.\u201d",
    attribution: "Alan Watts",
  },
  {
    text: "\u201cWe\u2019re all just walking each other home.\u201d",
    attribution: "Ram Dass",
  },
  {
    text: "\u201cThe moment you understand yourself, you begin to understand the universe.\u201d",
    attribution: "Jiddu Krishnamurti",
  },

  // Science & inquiry
  {
    text: "\u201cSomewhere, something incredible is waiting to be known.\u201d",
    attribution: "Carl Sagan",
  },
  {
    text: "\u201cWe are a way for the cosmos to know itself.\u201d",
    attribution: "Carl Sagan",
  },
  {
    text: "\u201cIt is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.\u201d",
    attribution: "Charles Darwin",
  },
  {
    text: "\u201cYou never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.\u201d",
    attribution: "Buckminster Fuller",
  },
  {
    text: "\u201cNothing in life is as important as you think it is while you are thinking about it.\u201d",
    attribution: "Daniel Kahneman",
  },
  {
    text: "\u201cDon\u2019t pay attention to \u2018authorities\u2019. Think for yourself.\u201d",
    attribution: "Richard Feynman",
  },

  // Literature
  {
    text: "\u201cIt is good to have an end to journey toward; but it is the journey that matters, in the end.\u201d",
    attribution: "Ursula K. Le Guin",
  },
  {
    text: "\u201cIf you do not turn your life into a story, you just become a part of someone else\u2019s story.\u201d",
    attribution: "Terry Pratchett",
  },
  {
    text: "\u201cPractice any art, no matter how well or badly, not to get money and fame, but to experience becoming, to find out what\u2019s inside you.\u201d",
    attribution: "Kurt Vonnegut",
  },
  {
    text: "\u201cYou are your best thing.\u201d",
    attribution: "Toni Morrison",
  },
  {
    text: "\u201cKeep a little fire burning; however small, however hidden.\u201d",
    attribution: "Cormac McCarthy",
  },
  {
    text: "\u201cYou cannot find peace by avoiding life.\u201d",
    attribution: "Virginia Woolf",
  },
  {
    text: "\u201cA man\u2019s errors are his portals of discovery.\u201d",
    attribution: "James Joyce",
  },

  // Design & craft (only where the line speaks to agency or inner conviction)
  {
    text: "\u201cThe life of a designer is a life of fight. Fight against the ugliness.\u201d",
    attribution: "Massimo Vignelli",
  },

  // Civil & human rights
  {
    text: "\u201cIf there is no struggle, there is no progress.\u201d",
    attribution: "Frederick Douglass",
  },
  {
    text: "\u201cIt always seems impossible until it\u2019s done.\u201d",
    attribution: "Nelson Mandela",
  },
  {
    text: "\u201cHope is not the conviction that something will turn out well but the certainty that something makes sense, regardless of how it turns out.\u201d",
    attribution: "V\u00e1clav Havel",
  },
  {
    text: "\u201cA major problem is that many individuals don\u2019t believe that they can make a difference.\u201d",
    attribution: "Elinor Ostrom",
  },

  // Leaders & statesmen
  {
    text: "\u201cNever, never, never give up.\u201d",
    attribution: "Winston Churchill",
  },
  {
    text: "\u201cSuccess is not final, failure is not fatal: it is the courage to continue that counts.\u201d",
    attribution: "Winston Churchill",
  },
  {
    text: "\u201cBelieve you can and you\u2019re halfway there.\u201d",
    attribution: "Theodore Roosevelt",
  },
  {
    text: "\u201cDo what you can, with what you have, where you are.\u201d",
    attribution: "Theodore Roosevelt",
  },
  {
    text: "\u201cThe best way to predict your future is to create it.\u201d",
    attribution: "Abraham Lincoln",
  },
  {
    text: "\u201cEnergy and persistence conquer all things.\u201d",
    attribution: "Benjamin Franklin",
  },

  // Sports & coaching
  {
    text: "\u201cDon\u2019t count the days; make the days count.\u201d",
    attribution: "Muhammad Ali",
  },
  {
    text: "\u201cI am the greatest. I said that even before I knew I was.\u201d",
    attribution: "Muhammad Ali",
  },
  {
    text: "\u201cI really think a champion is defined not by their wins but by how they can recover when they fall.\u201d",
    attribution: "Serena Williams",
  },
  {
    text: "\u201cIt\u2019s not whether you get knocked down; it\u2019s whether you get up.\u201d",
    attribution: "Vince Lombardi",
  },
  {
    text: "\u201cExcellence is the gradual result of always striving to do better.\u201d",
    attribution: "Pat Riley",
  },

  // Business & builders
  {
    text: "\u201cYour work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.\u201d",
    attribution: "Steve Jobs",
  },
  {
    text: "\u201cSomeone is sitting in the shade today because someone planted a tree a long time ago.\u201d",
    attribution: "Warren Buffett",
  },
  {
    text: "\u201cGuard your time. It is all you have.\u201d",
    attribution: "Naval Ravikant",
  },

  // Voices of encouragement
  {
    text: "\u201cNothing can dim the light which shines from within.\u201d",
    attribution: "Maya Angelou",
  },
  {
    text: "\u201cYou may not control all the events that happen to you, but you can decide not to be reduced by them.\u201d",
    attribution: "Maya Angelou",
  },
  {
    text: "\u201cYou are imperfect, you are wired for struggle, but you are worthy of love and belonging.\u201d",
    attribution: "Bren\u00e9 Brown",
  },
  {
    text: "\u201cThe biggest adventure you can take is to live the life of your dreams.\u201d",
    attribution: "Oprah Winfrey",
  },
  {
    text: "\u201cYou don\u2019t have to be somebody different to be important. You\u2019re important in your own right.\u201d",
    attribution: "Michelle Obama",
  },
  {
    text: "\u201cNo one can make you feel inferior without your consent.\u201d",
    attribution: "Eleanor Roosevelt",
  },
  {
    text: "\u201cThe future belongs to those who believe in the beauty of their dreams.\u201d",
    attribution: "Eleanor Roosevelt",
  },

  // Existential depth
  {
    text: "\u201cThat which does not kill us makes us stronger.\u201d",
    attribution: "Friedrich Nietzsche",
  },
  {
    text: "\u201cBecome who you are.\u201d",
    attribution: "Friedrich Nietzsche",
  },
  {
    text: "\u201cLife can only be understood backwards; but it must be lived forwards.\u201d",
    attribution: "S\u00f8ren Kierkegaard",
  },
  {
    text: "\u201cEveryone thinks of changing the world, but no one thinks of changing himself.\u201d",
    attribution: "Leo Tolstoy",
  },
];

/** Pick a random quote from the library. */
export function pickRandomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]!;
}

/** Stable for the current page session; changes on reload or redeploy. */
let sessionQuote: Quote | null = null;

export function getSessionQuote(): Quote {
  sessionQuote ??= pickRandomQuote();
  return sessionQuote;
}
