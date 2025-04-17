'use client'

import { useTranslation } from 'next-i18next';
import { useParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

const Home = () => {
  const { t } = useTranslation('common');
  const { locale } = useParams();
  const { i18n } = useTranslation();
  // i18n.changeLanguage(locale);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary">
        Welcome to PagePilot!
      </h1>{' '}
      {/* This is an example */}
      <p className="text-gray-700 mt-4">
        This is the home page of our PWA 3. Feel free to navigate to the About and Contact pages.
      </p>
      <p>{t('greeting')}</p>
      <p>{t('description')}</p>
    </div>
  );
};

export default Home;
