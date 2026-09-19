import React from 'react';
import MainContent from '../components/MainContent';
import RightPanel from '../components/RightPanel';

export default function Dashboard() {
  return (
    <>
      <MainContent />
      <RightPanel className="w-full xl:w-[410px] xl:ml-2 flex-shrink-0" />
    </>
  );
}
