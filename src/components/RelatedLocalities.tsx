import React from 'react';
import Link from 'next/link';
import { getPgLocationBySlug } from '@/data/pgLocations';
import { RELATED_LOCALITIES } from '@/data/relatedLocalities';
import styles from './RelatedLocalities.module.css';

interface Props {
  locationSlug: string;
}

const RelatedLocalities: React.FC<Props> = ({ locationSlug }) => {
  const related = RELATED_LOCALITIES[locationSlug] ?? [];
  if (!related.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Related PG Locations</h2>
      <div className={styles.grid}>
        {related.map((relSlug) => {
          const loc = getPgLocationBySlug(relSlug);
          const name = loc?.name || relSlug;
          return (
            <Link
              key={relSlug}
              href={`/pg/${relSlug}`}
              className={styles.card}
            >
              PG in {name}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedLocalities;
