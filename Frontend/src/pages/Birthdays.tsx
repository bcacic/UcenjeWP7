
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BirthdayList from '@/components/birthdays/BirthdayList';
import PageTitle from '@/components/ui/PageTitle';

const Birthdays = () => {
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get('filter') || 'all';
  
  let title = 'Rođendani';
  let subtitle = 'Upravljajte svim zakazanim rođendanskim proslavama';
  
  if (filterType === 'upcoming') {
    title = 'Nadolazeći Rođendani';
    subtitle = 'Upravljajte nadolazećim rođendanskim proslavama';
  } else if (filterType === 'completed') {
    title = 'Završeni Rođendani';
    subtitle = 'Pregledajte završene rođendanske proslave';
  }

  return (
    <Layout>
      <PageTitle 
        title={title} 
        subtitle={subtitle} 
      />
      <BirthdayList />
    </Layout>
  );
};

export default Birthdays;
