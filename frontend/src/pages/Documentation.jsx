import ResourceLayout, {
  Section,
  CodeBlock,
} from "../components/ResourceLayout";

export default function Documentation() {
  return (
    <ResourceLayout
      title="Documentation"
      subtitle="How to use TruthLens, and how it works under the hood."
    >
      <Section title="What is TruthLens?">
        <p>
          TruthLens is a machine learning system that analyses a piece of news
          text and estimates whether its writing patterns look more like real
          news or fake news. It was built as a Final Year Project at Islamia
          University Bahawalpur.
        </p>
      </Section>

      <Section title="How to use it">
        <ol className="list-decimal pl-6 space-y-2">
          <li>Create an account or sign in.</li>
          <li>Open the Dashboard.</li>
          <li>Paste the news text, or paste a link to a news article.</li>
          <li>Submit it for analysis and wait for the result.</li>
          <li>
            Read the result card: the label, the confidence, a short
            explanation, and the text signals panel.
          </li>
          <li>
            Your past analyses are saved in History, and Insights shows a
            summary of them.
          </li>
        </ol>
        <p>
          The backend runs on a free hosting tier, so the first request after a
          period of inactivity can take up to about a minute. Later requests are
          fast.
        </p>
      </Section>

      <Section title="Understanding the result">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="text-white">Label:</span> FAKE, REAL or UNCERTAIN.
          </li>
          <li>
            <span className="text-white">Confidence:</span> how strongly the
            model leans towards its label. A value close to 50% means the model
            is barely leaning either way.
          </li>
          <li>
            <span className="text-white">UNCERTAIN:</span> shown when the
            confidence is below 60% or the text is shorter than 15 words. Very
            short text does not give the model enough to judge.
          </li>
          <li>
            <span className="text-white">Explanation:</span> four short lines
            describing why the text was labelled this way.
          </li>
          <li>
            <span className="text-white">Text signals:</span> measurable writing
            features such as sentiment, capital letters, exclamation marks,
            clickbait words, quotes and attribution, numbers and dates, and
            sentence length.
          </li>
        </ul>
      </Section>

      <Section title="Links as input">
        <p>
          If you paste a URL, the backend downloads the page and extracts the
          main article text before analysing it. Pages that block automated
          access or hide the article behind a login cannot be read. In that
          case, copy the article text and paste it directly.
        </p>
      </Section>

      <Section title="Architecture">
        <CodeBlock>{`Browser (React + Tailwind, hosted on Vercel)
        |
        |  HTTPS + JWT
        v
Django REST API (hosted on Render)
        |-- TF-IDF + Logistic Regression model (scikit-learn, loaded via joblib)
        |-- Text signal extraction (VADER and rule-based features)
        |-- URL article extraction
        v
PostgreSQL database (Neon): users and submissions`}</CodeBlock>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="text-white">Frontend:</span> React with Tailwind
            CSS.
          </li>
          <li>
            <span className="text-white">Backend:</span> Django REST Framework
            with JWT authentication.
          </li>
          <li>
            <span className="text-white">Model:</span> TF-IDF features feeding a
            Logistic Regression classifier, trained on a combined news dataset
            (see the Dataset page).
          </li>
          <li>
            <span className="text-white">Database:</span> PostgreSQL stores user
            accounts and every submission with its result.
          </li>
        </ul>
      </Section>

      <Section title="What it does not do">
        <p>
          TruthLens does not check facts. The model learns writing style and
          source patterns from its training data, so a high confidence means the
          text resembles the examples it was trained on, not that the claims
          were verified. It works best on political and wire-style news similar
          to its training data and is less reliable on other domains such as
          health or entertainment. Treat the result as a signal to look closer,
          never as proof.
        </p>
      </Section>
    </ResourceLayout>
  );
}
