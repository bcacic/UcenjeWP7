
import React from 'react';
import Layout from '@/components/layout/Layout';
import BirthdayBoyList from '@/components/birthday-boys/BirthdayBoyList';
import PageTitle from '@/components/ui/PageTitle';

const BirthdayBoys = () => {
  return (
    <Layout>
      <PageTitle 
        title="Slavljenici" 
        subtitle="Upravljajte svim profilima slavljenika" 
      />
      <BirthdayBoyList />
    </Layout>
  );
};

export default BirthdayBoys;
