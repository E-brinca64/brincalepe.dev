import { operations } from "@/src/data/now";

type CurrentOperationsProps = {
  lang: "en" | "pt";
  label: string;
  title: string;
  updated: string;
  lastUpdated: string;
};

export function CurrentOperations({
  lang,
  label,
  title,
  updated,
  lastUpdated,
}: CurrentOperationsProps) {
  return (
    <section className="section wrap now-section" id="now">
      <div className="section-heading">
        <span>04 / {label}</span>
        <span>
          {updated} {lastUpdated}
        </span>
      </div>
      <h2>{title}</h2>
      <div className="operations">
        {operations.map((op) => (
          <div className="operation" key={op.number}>
            <span className="op-number">{op.number}</span>
            <strong>{op.label[lang]}</strong>
            <p>{lang === "en" ? op.en : op.pt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
