import data from "../../data/model_eval_results.json";

// Source names ko readable labels mein badalna
const LABELS = {
  True: "ISOT (real)",
  Fake: "ISOT (fake)",
  DataSet_Misinfo_TRUE: "Misinfo set (real)",
  DataSet_Misinfo_FAKE: "Misinfo set (fake)",
  "FakeHealth-HealthStory": "FakeHealth: HealthStory",
  "FakeHealth-HealthRelease": "FakeHealth: HealthRelease",
  GossipCop: "GossipCop (entertainment)",
  "BBC Sport": "BBC Sport (real)",
  "The Onion Sports": "The Onion Sports (satire)",
  "BBC Business": "BBC Business (real)",
  CNBC: "CNBC (real)",
  "The Onion Business": "The Onion Business (satire)",
};

// Political/wire news wale sources ek group mein
const MAIN_SOURCES = new Set([
  "True",
  "Fake",
  "DataSet_Misinfo_TRUE",
  "DataSet_Misinfo_FAKE",
]);

const pct = (x) => (x * 100).toFixed(2) + "%";

function Section({ title, note, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/3 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {note && <p className="mt-1 text-sm text-white/55">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ModelInfo() {
  const cm = data.confusion_matrix["rows_actual_cols_pred_[FAKE,REAL]"];
  const trainRows = data.total_rows - data.test_rows;

  const rows = Object.entries(data.per_source)
    .map(([key, v]) => ({
      name: LABELS[key] ?? key,
      main: MAIN_SOURCES.has(key),
      ...v,
    }))
    .sort((a, b) => b.total - a.total);

  const group = (isMain) => {
    const list = rows.filter((r) => r.main === isMain);
    const correct = list.reduce((s, r) => s + r.correct, 0);
    const total = list.reduce((s, r) => s + r.total, 0);
    return { correct, total, acc: (correct / total) * 100 };
  };
  const mainG = group(true);
  const divG = group(false);

  const facts = [
    ["Algorithm", "TF-IDF features + Logistic Regression"],
    ["Features", "50,000 unigram TF-IDF terms (min_df 5, max_df 0.9)"],
    [
      "Dataset",
      `${data.total_rows.toLocaleString()} labelled articles after cleaning`,
    ],
    [
      "Split",
      `${trainRows.toLocaleString()} train / ${data.test_rows.toLocaleString()} test (80/20, stratified)`,
    ],
    [
      "Verdicts",
      "REAL, FAKE, or UNCERTAIN (confidence below 60% or fewer than 15 words)",
    ],
  ];

  const limitations = [
    "Domain bias: most training data is political and wire-style news. On other domains (health, entertainment) accuracy is much lower.",
    "Temporal drift: much of the training data is from 2019-2020, so recent events and entities are unfamiliar to the model.",
    "Dry statistical reporting (market figures, trade data) is sometimes flagged as FAKE with low confidence.",
    'Source-style artifacts: real ISOT articles are Reuters-style, so words such as "on", "tuesday" or "statement" act as strong REAL signals.',
    "Low-confidence predictions (50-60%) are close to a coin flip, and wrong predictions can also occur at high confidence.",
    "Labels in the health and entertainment sets are noisy, and satire (The Onion) is counted as FAKE.",
    "The explanation signals (caps ratio, exclamation count, tone cut-offs) are heuristics and were not tuned on real data. The sentiment tool (VADER) is general-purpose, not news-specific.",
    "All figures come from a random held-out split of the same data, so accuracy on unseen real-world news will be lower.",
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Model Info</h2>
        <p className="mt-1 text-sm text-white/55">
          How the detector works and how it performed on a held-out test set.
        </p>
      </div>

      <Section title="Model overview">
        <dl className="divide-y divide-white/10">
          {facts.map(([k, v]) => (
            <div
              key={k}
              className="flex flex-col gap-1 py-2 sm:flex-row sm:gap-6"
            >
              <dt className="w-28 shrink-0 text-sm text-white/50">{k}</dt>
              <dd className="text-sm text-white">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        title="Overall performance"
        note={`Measured on ${data.test_rows.toLocaleString()} held-out articles the model never saw during training.`}
      >
        <p className="text-4xl font-semibold text-[#3ECF8E]">
          {data.accuracy_percent ?? data["accuracy_%"]}%
          <span className="ml-2 text-sm font-normal text-white/50">
            accuracy
          </span>
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-105 text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="py-2 pr-4 font-medium">Class</th>
                <th className="py-2 pr-4 font-medium">Precision</th>
                <th className="py-2 pr-4 font-medium">Recall</th>
                <th className="py-2 font-medium">F1</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {["FAKE", "REAL"].map((c) => (
                <tr key={c} className="border-t border-white/10">
                  <td className="py-2 pr-4">{c}</td>
                  <td className="py-2 pr-4">{pct(data[c].precision)}</td>
                  <td className="py-2 pr-4">{pct(data[c].recall)}</td>
                  <td className="py-2">{pct(data[c].f1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Confusion matrix"
        note="Rows are the actual label, columns are the model's prediction."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-90 text-center text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="py-2"></th>
                <th className="py-2 font-medium">Predicted FAKE</th>
                <th className="py-2 font-medium">Predicted REAL</th>
              </tr>
            </thead>
            <tbody className="text-white">
              <tr className="border-t border-white/10">
                <td className="py-3 text-left text-white/50">Actual FAKE</td>
                <td className="py-3 font-semibold text-[#3ECF8E]">
                  {cm[0][0].toLocaleString()}
                </td>
                <td className="py-3">{cm[0][1].toLocaleString()}</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="py-3 text-left text-white/50">Actual REAL</td>
                <td className="py-3">{cm[1][0].toLocaleString()}</td>
                <td className="py-3 font-semibold text-[#3ECF8E]">
                  {cm[1][1].toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Accuracy by data source"
        note="The overall figure is dominated by political and wire-style news. Other domains are far weaker, and several of these test sets are small."
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm text-white/50">Political / wire news</p>
            <p className="text-2xl font-semibold text-white">
              {mainG.acc.toFixed(1)}%
            </p>
            <p className="text-xs text-white/45">
              {mainG.total.toLocaleString()} test articles
            </p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm text-white/50">
              Other domains (health, entertainment, sports, business)
            </p>
            <p className="text-2xl font-semibold text-white">
              {divG.acc.toFixed(1)}%
            </p>
            <p className="text-xs text-white/45">
              {divG.total.toLocaleString()} test articles
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-105 text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="py-2 pr-4 font-medium">Source</th>
                <th className="py-2 pr-4 font-medium">Test articles</th>
                <th className="py-2 font-medium">Accuracy</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {rows.map((r) => (
                <tr key={r.name} className="border-t border-white/10">
                  <td className="py-2 pr-4">{r.name}</td>
                  <td className="py-2 pr-4">{r.total.toLocaleString()}</td>
                  <td className="py-2">{r["acc_%"].toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Accuracy by confidence"
        note="Higher confidence is more reliable. Below 60% the model is close to guessing, which is why those results are shown as UNCERTAIN."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-90 text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="py-2 pr-4 font-medium">Confidence</th>
                <th className="py-2 pr-4 font-medium">Test articles</th>
                <th className="py-2 font-medium">Accuracy</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {data.confidence_bands.map((b) => (
                <tr key={b.band} className="border-t border-white/10">
                  <td className="py-2 pr-4">{b.band}%</td>
                  <td className="py-2 pr-4">{b.n.toLocaleString()}</td>
                  <td className="py-2">{b["accuracy_%"].toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Known limitations">
        <ul className="list-disc space-y-2 pl-5 text-sm text-white/80">
          {limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </Section>

      <Section title="Retraining">
        <p className="text-sm text-white/80">
          Retraining is done offline with the project's training script, and the
          updated model files are then redeployed with the app. In-app
          retraining is not available on the current hosting tier, so it is
          planned as future work.
        </p>
      </Section>
    </div>
  );
}
