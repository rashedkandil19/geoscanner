// ─── StatusBar.jsx ───────────────────────────────────────────────────────────
// بيعرض الإحصائيات الـ 3 (Suppliers Found / With Phone / With Website)
//
// Props:
//   total      : عدد النتايج الكلي
//   withPhone  : عدد اللي عندهم رقم تليفون
//   withWeb    : عدد اللي عندهم website
//
// لو stats = null → مش بيعرض حاجة (لو السيرش لسه محصلش)

export default function StatusBar({ stats }) {
  // لو مفيش stats → ارجع null (مش بيتعرض في الـ DOM خالص)
  // ده مثال تاني على Conditional Rendering باستخدام guard clause
  if (!stats) return null;

  // بنعمل الـ data بتاعة الـ stats كـ array
  // عشان نعملها map ونعرضها بنفس الـ pattern من غير تكرار كود
  const items = [
    { dot: "cyan", value: stats.total, label: "Suppliers Found" },
    { dot: "green", value: stats.withPhone, label: "With Phone" },
    { dot: "warn", value: stats.withWeb, label: "With Website" },
  ];

  return (
    <div className="stats-bar">
      {items.map((item) => (
        // key على الـ label عشان هو unique
        <div key={item.label} className="stat">
          <div className={`stat-dot ${item.dot}`} />
          {/* className بيتبنى ديناميكياً بـ template literal */}
          {/* النتيجة: "stat-dot cyan" أو "stat-dot green" إلخ */}
          <div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-key">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
