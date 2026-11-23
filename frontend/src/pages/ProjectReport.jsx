import ResourceLayout, { Section } from "../components/ResourceLayout";

const CONFIDENCE_BANDS = [
  ["50 – 60%", "59.6%"],
  ["60 – 70%", "73.8%"],
  ["70 – 80%", "86.1%"],
  ["80 – 90%", "94.2%"],
  ["90 – 100%", "99.4%"],
];

function Table({ head, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-white">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-white/10">
              {r.map((c, i) => (
                <td
                  key={i}
                  className={"px-4 py-3 " + (i === 0 ? "text-white" : "")}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProjectReport() {
  return (
    <ResourceLayout
      title="Project Report"
      subtitle="TruthLens: method, results and limitations of the Fake News Detection system."
    >
      <div className="mb-10">
        <a
          href="/TruthLens_Project_Report.pdf"
          download
          className="inline-flex items-center gap-2 rounded-xl bg-[#3ECF8E] px-5 py-3 text-sm font-semibold text-[#0B0E14] hover:bg-[#2CB67D] transition-colors"
        >
          Download PDF
        </a>
      </div>
      <Section title="Abstract">
        <p>
          TruthLens is a web-based system that classifies English news text as
          FAKE or REAL using TF-IDF features and a Logistic Regression
          classifier, and reports a confidence value together with measurable
          writing signals and a short explanation. The model was trained on a
          combined dataset of 96,842 articles. On a held-out test set of 19,367
          articles it reaches 95.09% accuracy. This number measures agreement
          with the dataset labels on data from the same sources. The model
          learns writing style and source patterns, not facts, and its accuracy
          drops sharply outside political and wire-style news.
        </p>
      </Section>

      <Section title="Method">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="text-white">Data:</span> nine public collections
            merged into one English-only dataset (57,916 REAL, 38,926 FAKE). See
            the Dataset page for the full list.
          </li>
          <li>
            <span className="text-white">Features:</span> TF-IDF on single
            words, 50,000 features, minimum document frequency 5, maximum
            document frequency 0.9.
          </li>
          <li>
            <span className="text-white">Model:</span> Logistic Regression.
            Naive Bayes was also tried; Logistic Regression was chosen as the
            final model.
          </li>
          <li>
            <span className="text-white">Evaluation:</span> 96,834 cleaned rows,
            80/20 stratified split with a fixed random seed, giving 19,367 test
            articles.
          </li>
          <li>
            <span className="text-white">UNCERTAIN rule:</span> a result is
            shown as UNCERTAIN when confidence is below 60% or the text has
            fewer than 15 words.
          </li>
          <li>
            <span className="text-white">Text signals:</span> sentiment (VADER),
            capital letters, exclamation marks, clickbait words, quotes and
            attribution, numbers and dates, sentence length and tone. These are
            shown to the user as context. Their thresholds are heuristic.
          </li>
        </ul>
      </Section>

      <Section title="Results">
        <p>
          Overall accuracy on the held-out test set is{" "}
          <span className="text-white">95.09%</span>.
        </p>
        <Table
          head={["Class", "Precision", "Recall", "F1"]}
          rows={[
            ["FAKE", "0.9428", "0.9346", "0.9387"],
            ["REAL", "0.9563", "0.9619", "0.9591"],
          ]}
        />
        <p>Confusion matrix (19,367 test articles):</p>
        <Table
          head={["Actual \\ Predicted", "FAKE", "REAL"]}
          rows={[
            ["FAKE", "7,275", "509"],
            ["REAL", "441", "11,142"],
          ]}
        />
        <p>
          Accuracy by domain: about 96.1% on political and wire-style news (ISOT
          and DataSet_Misinfo) but about 67.9% on the remaining domains
          combined. FakeHealth is around 65 to 67%. GossipCop is 48.7% on only
          115 test articles, which is too small a sample to read much into.
        </p>

        <p className="text-white pt-2">Accuracy by confidence band</p>
        <Table head={["Confidence", "Accuracy"]} rows={CONFIDENCE_BANDS} />
        <p>
          Confidence is informative: correct predictions average 92.3%
          confidence, wrong ones 68.8%. A band of 50 to 60% is close to a coin
          flip. However, 220 mistakes were made with 80% confidence or higher,
          so high confidence does not guarantee a correct label.
        </p>
        <p>
          We manually reviewed the 20 most confident mistakes (AI-assisted, so
          indicative only, not a rigorous audit). In 11 the dataset label itself
          looks wrong, in 3 the model made a real error, and 6 were unclear.
          This suggests part of the remaining error comes from label noise, not
          only from the model.
        </p>
      </Section>

      <Section title="Limitations">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="text-white">Not a fact-checker.</span> The model
            learns style and source patterns. A 95% score means agreement with
            the labels, not that claims were verified.
          </li>
          <li>
            <span className="text-white">Domain bias.</span> Strong on political
            and wire-style news, weak elsewhere.
          </li>
          <li>
            <span className="text-white">Old data.</span> Most articles date
            from 2019 to 2020, so newer topics are not represented.
          </li>
          <li>
            <span className="text-white">Label noise.</span> Some FakeHealth and
            GossipCop labels are questionable, and satire is labelled FAKE.
          </li>
          <li>
            <span className="text-white">Source artifacts.</span> Wire-style
            markers in real news can act as a shortcut for the model.
          </li>
          <li>
            <span className="text-white">False positives.</span> Dry,
            statistical news can be flagged with low confidence.
          </li>
          <li>
            <span className="text-white">Random split.</span> All numbers come
            from a random split of the same datasets. Accuracy on genuinely
            unseen news is expected to be lower.
          </li>
          <li>
            <span className="text-white">Heuristic signals.</span> Signal
            thresholds are hand-set, VADER is a general-purpose sentiment tool,
            and the capital-letter count also counts acronyms such as NASA.
          </li>
          <li>
            <span className="text-white">Hosting.</span> The backend runs on a
            free tier, so the first request after inactivity can take about 50
            seconds.
          </li>
        </ul>
      </Section>
    </ResourceLayout>
  );
}
