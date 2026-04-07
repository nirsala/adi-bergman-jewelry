export default function SeoContent() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'מה זה מויסנייט?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'מויסנייט הוא אבן חן סינתטית בעלת מדד שבירה גבוה מיהלום (2.65 לעומת 2.42), המעניקה ברק וניצוצות יוצאי דופן. מויסנייט הוא בחירה אתית ובת-קיימא לתכשיטים יוקרתיים, עם קשיות של 9.25 בסולם מוס.',
        },
      },
      {
        '@type': 'Question',
        name: 'האם מויסנייט עמיד לאורך זמן?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'כן, מויסנייט הוא אחד מאבני החן הקשות ביותר (9.25 בסולם מוס) ועמיד מאוד לשריטות ופגיעות. הוא מתאים לשימוש יומיומי לאורך שנים רבות, כולל טבעות אירוסין.',
        },
      },
      {
        '@type': 'Question',
        name: 'מה ההבדל בין מויסנייט ליהלום?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'מויסנייט מציע ברק וזוהר חזקים יותר מיהלום בזכות מדד שבירה גבוה יותר. הוא אתי לחלוטין (לא כרוי), עמיד כמעט כמו יהלום, ובמחיר נגיש משמעותית. תכשיטי מויסנייט של עדי ברגמן מגיעים עם תעודת GRA.',
        },
      },
      {
        '@type': 'Question',
        name: 'האם התכשיטים מגיעים עם תעודה?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'כן, כל אבני המויסנייט שלנו מגיעות עם תעודת GRA (Gemological Research Association) המאשרת את האותנטיות והאיכות של האבן.',
        },
      },
      {
        '@type': 'Question',
        name: 'מאיזה זהב עשויים התכשיטים?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'התכשיטים שלנו עשויים מזהב 14K או 18K אמיתי — זהב לבן, זהב צהוב או זהב ורוד, בהתאם לדגם. חלק מהתכשיטים זמינים גם בכסף סטרלינג 925 או פלטינום.',
        },
      },
    ],
  };

  return (
    <section className="py-16 md:py-20 bg-white" aria-label="שאלות נפוצות על מויסנייט">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-[800px] mx-auto px-5 md:px-10">
        <h2 className="font-heading text-[28px] md:text-[36px] text-text text-center mb-3">
          שאלות נפוצות על מויסנייט
        </h2>
        <div className="w-8 h-[1px] bg-accent mx-auto mb-10" />

        <div className="space-y-6">
          {(faqSchema.mainEntity as Array<{name: string; acceptedAnswer: {text: string}}>).map((faq, i) => (
            <details key={i} className="group border-b border-border pb-5">
              <summary className="flex items-center justify-between cursor-pointer text-[16px] font-medium text-text hover:text-accent transition-colors">
                <h3 className="text-[16px] font-medium">{faq.name}</h3>
                <span className="text-accent text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-[14px] text-text-light leading-[1.8]">
                {faq.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
