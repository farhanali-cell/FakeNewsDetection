import ResourceLayout, { Section } from "../components/ResourceLayout";

const SOURCES = [
  {
    name: "ISOT True / Fake",
    rows: "38,644",
    note: "Political and wire-style news",
  },
  {
    name: "DataSet_Misinfo",
    rows: "54,892",
    note: "Mixed news and misinformation",
  },
  { name: "FakeHealth", rows: "2,135", note: "Health news" },
  { name: "GossipCop", rows: "557", note: "Entertainment news" },
  { name: "BBC Sport", rows: "232", note: "Real" },
  { name: "Onion Sports", rows: "78", note: "Satire, labelled FAKE" },
  { name: "BBC Business", rows: "107", note: "Real" },
  { name: "CNBC", rows: "141", note: "Real" },
  { name: "Onion Business", rows: "56", note: "Satire, labelled FAKE" },
];

export default function Dataset() {
  return (
    <ResourceLayout
      title="Dataset"
      subtitle="What the TruthLens model was trained on, and where that data falls short."
    >
      <Section title="Overview">
        <p>
          The training data combines several public news collections into one
          English-only dataset of <span className="text-white">96,842</span>{" "}
          articles: <span className="text-white">57,916 REAL</span> and{" "}
          <span className="text-white">38,926 FAKE</span>. Smaller collections
          from sports and business news were added to widen the range of topics
          beyond politics.
        </p>
      </Section>

      <Section title="Sources">
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Dataset</th>
                <th className="px-4 py-3 font-semibold">Rows</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.name} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white">{s.name}</td>
                  <td className="px-4 py-3">{s.rows}</td>
                  <td className="px-4 py-3">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          ISOT and DataSet_Misinfo together make up almost all of the data, so
          the model is mostly shaped by political and wire-style news.
        </p>
      </Section>

      <Section title="Preparation">
        <ul className="list-disc pl-6 space-y-2">
          <li>Only English text is used.</li>
          <li>
            After cleaning, 96,834 rows were kept for training and evaluation.
          </li>
          <li>
            The data was split 80/20 with stratification (fixed random seed),
            giving 19,367 test articles.
          </li>
          <li>
            Features: TF-IDF on single words, up to 50,000 features, ignoring
            words that appear in fewer than 5 documents or in more than 90% of
            documents.
          </li>
          <li>
            Logistic Regression and Naive Bayes were both tried. Logistic
            Regression was chosen as the final model.
          </li>
        </ul>
      </Section>

      <Section title="Known limitations of the data">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="text-white">Domain bias:</span> accuracy is about
            96% on political and wire-style news but about 68% on the other
            domains combined.
          </li>
          <li>
            <span className="text-white">Age of the data:</span> most articles
            are from 2019 to 2020, so newer topics and writing trends are not
            represented.
          </li>
          <li>
            <span className="text-white">Label noise:</span> some labels in
            FakeHealth and GossipCop are questionable, and satire (The Onion) is
            labelled FAKE even though it is not meant to deceive.
          </li>
          <li>
            <span className="text-white">Source artifacts:</span> real news in
            the data often carries wire-agency style markers, which the model
            can pick up as a shortcut.
          </li>
        </ul>
      </Section>
    </ResourceLayout>
  );
}
