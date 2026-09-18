import React from 'react';
import { OrbitalSpecsView } from '@/components/history/OrbitalSpecsView';

export const metadata = {
  title: 'Orbital Specs & Engineering History | ISS Technical Compendium',
  description: 'Comprehensive orbital mechanics formulas, engineering subsystems, module anatomy, robotics, and 1998-2030 historical evolution of the International Space Station.',
};

export default function HistoryPage() {
  return <OrbitalSpecsView />;
}

