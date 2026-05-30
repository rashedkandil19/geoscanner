// ─── ResultsTable.jsx ────────────────────────────────────────────────────────
// بيعرض جدول النتايج
//
// Props:
//   results : array من الأماكن — كل عنصر فيه (name, address, category, إلخ)
//   message : نص بيتعرض لو مفيش نتايج (error أو loading message)
//   msgType : نوع الـ message ("loading" أو "error") — بيأثر على الـ CSS class

export default function ResultsTable({ results, message, msgType }) {
  return (
    <div className="table-wrapper">
      <table>
        {/* thead ثابت دايماً — مش بيتغير مع النتايج */}
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Address</th>
            <th>Category</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Map</th>
          </tr>
        </thead>

        <tbody>
          {/* ─── Conditional Rendering بـ Ternary ─── */}
          {message ? (
            // لو في message → اعرضها في row واحدة بـ colspan=7
            <tr>
              <td colSpan="7" className={`msg ${msgType || ""}`}>
                {/* colSpan مش colspan — JSX camelCase */}
                {message}
              </td>
            </tr>
          ) : (
            // لو مفيش message → اعرض النتايج
            results.map((r, i) => (
              // i هو الـ index (0, 1, 2, ...) — بنستخدمه للنمبرة
              <tr
                key={r.mapUrl}
                // key لازم يكون unique — الـ mapUrl كويس عشان كل مكان عنده URL مختلف
                onClick={() => window.open(r.mapUrl, "_blank")}
                // كل الـ row قابلة للضغط وبتفتح Google Maps في tab جديد
                style={{ cursor: "pointer" }}
              >
                {/* النمبرة: padStart بتضيف صفر قدام الأرقام الأقل من 10 */}
                {/* 1 → "01"   /   10 → "10" */}
                <td
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.7rem",
                    color: "var(--text3)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </td>

                <td className="name">
                  {r.name}
                  {/* && هنا: لو r.website موجود → اعرض الـ link */}
                  {/* لو r.website = null أو "" → مش بيعرض حاجة */}
                  {r.website && (
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noreferrer"
                      // rel="noreferrer" مهم للأمان:
                      // بيمنع الـ tab الجديد يعرف من فين جه المستخدم
                      onClick={(e) => e.stopPropagation()}
                      // stopPropagation مهم!
                      // لو المستخدم ضغط على الـ link والـ row عندها onClick
                      // من غير stopPropagation → الاتنين هيتنفذوا
                      // مع stopPropagation → بس الـ link هيشتغل
                      style={{
                        fontSize: "0.68rem",
                        color: "var(--accent2)",
                        fontFamily: "var(--mono)",
                        textDecoration: "none",
                      }}
                    >
                      ↗ website
                    </a>
                  )}
                </td>

                <td style={{ fontSize: "0.78rem", maxWidth: "220px" }}>
                  {r.address}
                </td>

                <td>
                  <span className="tag">{r.category}</span>
                </td>

                <td className="phone">{r.phone}</td>

                <td>
                  <span
                    className={`tag ${r.opening === "Open Now" ? "open" : ""}`}
                  >
                    {r.opening || "—"}
                  </span>
                </td>

                <td>
                  <a
                    className="map-btn"
                    href={r.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    MAP
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
