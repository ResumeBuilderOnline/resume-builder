/**
 * CustomSections
 *
 * Renders user-defined custom resume sections. Each custom section is
 * `{ id, title, items }` where `items` may be strings or objects with
 * flexible fields (title/subtitle/date/description/bullets, etc.).
 *
 * The `prefix` is the template's CSS class prefix (e.g. "basic", "modern",
 * "ats") so the rendered elements use the active template's styling. All
 * blocks carry `data-block` / `data-block-kind` so they participate in
 * normal pagination.
 */
import React from 'react';

function renderItem(item, i, prefix) {
  if (typeof item === 'string') {
    return (
      <p className={`${prefix}-text`} key={i}>
        {item}
      </p>
    );
  }
  if (!item || typeof item !== 'object') return null;

  const title = item.title || item.role || item.name || item.heading;
  const subtitle =
    item.subtitle || item.company || item.organization || item.school;
  const date = item.date || item.duration || item.period;
  const location = item.location || item.city;

  return (
    <div key={item.id || i}>
      {(title || date) && (
        <div className={`${prefix}-item-head`}>
          {title && <strong>{title}</strong>}
          {date && <span className={`${prefix}-date`}>{date}</span>}
        </div>
      )}
      {(subtitle || location) && (
        <div className={`${prefix}-sub`}>
          {[subtitle, location].filter(Boolean).join('  •  ')}
        </div>
      )}
      {item.description && (
        <p className={`${prefix}-text`}>{item.description}</p>
      )}
      {Array.isArray(item.bullets) && item.bullets.length > 0 && (
        <ul className={`${prefix}-list`}>
          {item.bullets.map((b, bi) => (
            <li key={bi}>{b}</li>
          ))}
        </ul>
      )}
      {Array.isArray(item.achievements) && item.achievements.length > 0 && (
        <ul className={`${prefix}-list`}>
          {item.achievements.map((b, bi) => (
            <li key={bi}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CustomSections({ sections, prefix }) {
  if (!Array.isArray(sections)) return null;

  const visible = sections.filter(
    (s) => s && s.title && Array.isArray(s.items) && s.items.length > 0
  );

  if (visible.length === 0) return null;

  return visible.map((section) => (
    <React.Fragment key={section.id || section.title}>
      <section
        className={`${prefix}-section`}
        data-block
        data-block-kind="heading"
      >
        <h2 className={`${prefix}-section-title`}>{section.title}</h2>
      </section>
      <div
        className={`${prefix}-block ${prefix}-custom-item`}
        data-block
        data-block-kind="entry"
      >
        {section.items.map((item, i) => renderItem(item, i, prefix))}
      </div>
    </React.Fragment>
  ));
}
