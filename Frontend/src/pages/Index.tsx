
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/dashboard/Dashboard';
import PageTitle from '@/components/ui/PageTitle';

// Create a client
const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <PageTitle
          title="Nadzorna ploča"
          subtitle="Dobrodošli na nadzornu ploču za upravljanje rođendaonicom."
        />
        <Dashboard />
      </Layout>
    </QueryClientProvider>
  );
};

export default Index;
